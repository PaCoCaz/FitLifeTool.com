export type ChangePlanCustomer = {
  id: string;
  stripeCustomerId: string;
};

export type ChangePlanSubscription = {
  id: string;
};

export type RetrievedStripeSubscription = {
  id: string;
  customer: string | { id?: string } | null;
  items: {
    data: Array<{
      id: string;
    }>;
  };
};

export type ChangePlanDependencies = {
  findCustomerByUserId(
    userId: string
  ): Promise<ChangePlanCustomer | null>;
  findChangeableSubscriptionsByCustomerId(
    localCustomerId: string
  ): Promise<ChangePlanSubscription[]>;
  retrieveStripeSubscription(
    stripeSubscriptionId: string
  ): Promise<RetrievedStripeSubscription>;
  updateStripeSubscription(
    stripeSubscriptionId: string,
    input: {
      itemId: string;
      priceId: string;
    }
  ): Promise<void>;
};

export class ChangePlanError extends Error {
  readonly code:
    | "CUSTOMER_NOT_FOUND"
    | "SUBSCRIPTION_NOT_FOUND"
    | "AMBIGUOUS_SUBSCRIPTION"
    | "STRIPE_CUSTOMER_MISMATCH"
    | "SUBSCRIPTION_ITEM_NOT_FOUND";

  constructor(
    code:
      | "CUSTOMER_NOT_FOUND"
      | "SUBSCRIPTION_NOT_FOUND"
      | "AMBIGUOUS_SUBSCRIPTION"
      | "STRIPE_CUSTOMER_MISMATCH"
      | "SUBSCRIPTION_ITEM_NOT_FOUND",
    message: string
  ) {
    super(message);
    this.code = code;
  }
}

function getStripeId(
  value: string | { id?: string } | null
) {
  if (typeof value === "string") {
    return value;
  }

  return value?.id ?? null;
}

export async function changePlanForUser(
  dependencies: ChangePlanDependencies,
  input: {
    userId: string;
    priceId: string;
  }
) {
  const customer = await dependencies.findCustomerByUserId(
    input.userId
  );

  if (!customer) {
    throw new ChangePlanError(
      "CUSTOMER_NOT_FOUND",
      "No billing customer exists for the authenticated user"
    );
  }

  const subscriptions =
    await dependencies.findChangeableSubscriptionsByCustomerId(
      customer.id
    );

  if (subscriptions.length === 0) {
    throw new ChangePlanError(
      "SUBSCRIPTION_NOT_FOUND",
      "No changeable subscription exists for the authenticated user"
    );
  }

  if (subscriptions.length !== 1) {
    throw new ChangePlanError(
      "AMBIGUOUS_SUBSCRIPTION",
      "Multiple changeable subscriptions require manual reconciliation"
    );
  }

  // subscriptions.id is the persisted Stripe subscription id (sub_...).
  // subscriptions.customer_id was already resolved with customers.id above.
  const localSubscription = subscriptions[0];
  const stripeSubscription =
    await dependencies.retrieveStripeSubscription(
      localSubscription.id
    );
  const stripeCustomerId = getStripeId(
    stripeSubscription.customer
  );

  if (stripeCustomerId !== customer.stripeCustomerId) {
    throw new ChangePlanError(
      "STRIPE_CUSTOMER_MISMATCH",
      "Stripe subscription belongs to another customer"
    );
  }

  const itemId = stripeSubscription.items.data[0]?.id;

  if (!itemId) {
    throw new ChangePlanError(
      "SUBSCRIPTION_ITEM_NOT_FOUND",
      "Stripe subscription has no changeable item"
    );
  }

  await dependencies.updateStripeSubscription(
    localSubscription.id,
    {
      itemId,
      priceId: input.priceId,
    }
  );

  return {
    subscriptionId: localSubscription.id,
  };
}
