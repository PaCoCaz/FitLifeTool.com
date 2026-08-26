import type { createSupabaseServer } from "@/lib/supabase/supabaseServer";

type SupabaseClientLike = ReturnType<
  typeof createSupabaseServer
>;

export type LocalCustomerMapping = {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email?: string | null;
};

export type CustomerMappingInput = {
  userId: string;
  stripeCustomerId: string;
};

export type StripeCustomerIdentity = {
  id: string;
  deleted?: boolean | void;
  email?: string | null;
  metadata?: Record<string, string> | null;
};

export type CustomerMappingStore = {
  findByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<LocalCustomerMapping | null>;
  findByUserId(
    userId: string
  ): Promise<LocalCustomerMapping | null>;
  insert(
    input: CustomerMappingInput
  ): Promise<LocalCustomerMapping>;
  requestEmailReconciliation(userId: string): Promise<void>;
};

export class CustomerMappingError extends Error {
  readonly code:
    | "INVALID_USER_ID"
    | "INVALID_STRIPE_CUSTOMER_ID"
    | "MISSING_STRIPE_USER_ID"
    | "CUSTOMER_MAPPING_CONFLICT"
    | "DELETED_STRIPE_CUSTOMER";

  constructor(
    code:
      | "INVALID_USER_ID"
      | "INVALID_STRIPE_CUSTOMER_ID"
      | "MISSING_STRIPE_USER_ID"
      | "CUSTOMER_MAPPING_CONFLICT"
      | "DELETED_STRIPE_CUSTOMER",
    message: string
  ) {
    super(message);
    this.code = code;
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const STRIPE_CUSTOMER_ID_PATTERN = /^cus_[A-Za-z0-9]+$/;

function assertIdentity(input: CustomerMappingInput) {
  if (!UUID_PATTERN.test(input.userId)) {
    throw new CustomerMappingError(
      "INVALID_USER_ID",
      "Customer mapping requires a valid Supabase user id"
    );
  }

  if (!STRIPE_CUSTOMER_ID_PATTERN.test(input.stripeCustomerId)) {
    throw new CustomerMappingError(
      "INVALID_STRIPE_CUSTOMER_ID",
      "Customer mapping requires a valid Stripe customer id"
    );
  }
}

function assertMatchingRows(
  input: CustomerMappingInput,
  byStripeCustomerId: LocalCustomerMapping | null,
  byUserId: LocalCustomerMapping | null
) {
  if (
    byStripeCustomerId &&
    byStripeCustomerId.user_id !== input.userId
  ) {
    throw new CustomerMappingError(
      "CUSTOMER_MAPPING_CONFLICT",
      "Stripe customer is already mapped to another user"
    );
  }

  if (
    byUserId &&
    byUserId.stripe_customer_id !== input.stripeCustomerId
  ) {
    throw new CustomerMappingError(
      "CUSTOMER_MAPPING_CONFLICT",
      "Supabase user is already mapped to another Stripe customer"
    );
  }

  if (
    byStripeCustomerId &&
    byUserId &&
    byStripeCustomerId.id !== byUserId.id
  ) {
    throw new CustomerMappingError(
      "CUSTOMER_MAPPING_CONFLICT",
      "Customer identity resolves to different local rows"
    );
  }

  return byStripeCustomerId ?? byUserId;
}

function isUniqueViolation(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
  );
}

async function loadMatchingRows(
  store: CustomerMappingStore,
  input: CustomerMappingInput
) {
  const [byStripeCustomerId, byUserId] = await Promise.all([
    store.findByStripeCustomerId(input.stripeCustomerId),
    store.findByUserId(input.userId),
  ]);

  return {
    byStripeCustomerId,
    byUserId,
  };
}

export async function ensureCustomerMapping(
  store: CustomerMappingStore,
  input: CustomerMappingInput
) {
  assertIdentity(input);

  const initialRows = await loadMatchingRows(store, input);
  const existing = assertMatchingRows(
    input,
    initialRows.byStripeCustomerId,
    initialRows.byUserId
  );

  if (existing) {
    if (!existing.email) {
      await store.requestEmailReconciliation(input.userId);
    }
    return existing;
  }

  try {
    const created = await store.insert({
      userId: input.userId,
      stripeCustomerId: input.stripeCustomerId,
    });
    await store.requestEmailReconciliation(input.userId);
    return created;
  } catch (error) {
    if (!isUniqueViolation(error)) {
      throw error;
    }

    // A customer and checkout webhook can race. Accept the race only when both
    // unique identifiers now resolve to the exact same local mapping.
    const racedRows = await loadMatchingRows(store, input);
    const racedMapping = assertMatchingRows(
      input,
      racedRows.byStripeCustomerId,
      racedRows.byUserId
    );

    if (!racedMapping) {
      throw error;
    }

    return racedMapping;
  }
}

export function getStripeCustomerUserId(
  customer: StripeCustomerIdentity
) {
  if (customer.deleted) {
    throw new CustomerMappingError(
      "DELETED_STRIPE_CUSTOMER",
      "Deleted Stripe customer cannot be mapped"
    );
  }

  const userId = customer.metadata?.user_id;

  if (!userId) {
    throw new CustomerMappingError(
      "MISSING_STRIPE_USER_ID",
      "Stripe customer is missing required user metadata"
    );
  }

  assertIdentity({
    userId,
    stripeCustomerId: customer.id,
  });

  return userId;
}

export function stripeCustomerEmailNeedsReconciliation(input: {
  customer: StripeCustomerIdentity;
  expectedUserId: string;
  confirmedAuthEmail: string;
}) {
  const metadataUserId = getStripeCustomerUserId(input.customer);

  if (metadataUserId !== input.expectedUserId) {
    throw new CustomerMappingError(
      "CUSTOMER_MAPPING_CONFLICT",
      "Stripe customer metadata does not match the confirmed Auth identity"
    );
  }

  return input.customer.email !== input.confirmedAuthEmail;
}

export function getCheckoutSessionUserId(input: {
  clientReferenceId?: string | null;
  metadataUserId?: string | null;
}) {
  const userId = input.clientReferenceId;

  if (!userId) {
    throw new CustomerMappingError(
      "MISSING_STRIPE_USER_ID",
      "Checkout Session is missing its authenticated user reference"
    );
  }

  if (
    input.metadataUserId &&
    input.metadataUserId !== userId
  ) {
    throw new CustomerMappingError(
      "CUSTOMER_MAPPING_CONFLICT",
      "Checkout Session user references do not match"
    );
  }

  if (!UUID_PATTERN.test(userId)) {
    throw new CustomerMappingError(
      "INVALID_USER_ID",
      "Checkout Session contains an invalid user reference"
    );
  }

  return userId;
}

export function createSupabaseCustomerMappingStore(
  supabase: SupabaseClientLike
): CustomerMappingStore {
  const selectColumns =
    "id, user_id, stripe_customer_id, email";

  return {
    async findByStripeCustomerId(stripeCustomerId) {
      const { data, error } = await supabase
        .from("customers")
        .select(selectColumns)
        .eq("stripe_customer_id", stripeCustomerId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as LocalCustomerMapping | null;
    },

    async findByUserId(userId) {
      const { data, error } = await supabase
        .from("customers")
        .select(selectColumns)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as LocalCustomerMapping | null;
    },

    async insert(input) {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          user_id: input.userId,
          stripe_customer_id: input.stripeCustomerId,
        })
        .select(selectColumns)
        .single();

      if (error) {
        throw error;
      }

      return data as LocalCustomerMapping;
    },

    async requestEmailReconciliation(userId) {
      const { error } = await supabase.rpc(
        "request_auth_email_reconciliation",
        { p_user_id: userId }
      );
      if (error) {
        throw error;
      }
    },
  };
}

export async function ensureSupabaseCustomerMapping(
  supabase: SupabaseClientLike,
  input: CustomerMappingInput
) {
  return ensureCustomerMapping(
    createSupabaseCustomerMappingStore(supabase),
    input
  );
}

export async function resolveLocalCustomerMapping(input: {
  supabase: SupabaseClientLike;
  stripeCustomerId: string;
  retrieveStripeCustomer: (
    stripeCustomerId: string
  ) => Promise<StripeCustomerIdentity>;
}) {
  const store = createSupabaseCustomerMappingStore(
    input.supabase
  );
  const existing = await store.findByStripeCustomerId(
    input.stripeCustomerId
  );

  if (existing) {
    return existing;
  }

  const stripeCustomer = await input.retrieveStripeCustomer(
    input.stripeCustomerId
  );
  const userId = getStripeCustomerUserId(stripeCustomer);

  return ensureCustomerMapping(store, {
    userId,
    stripeCustomerId: stripeCustomer.id,
  });
}
