// app/components/settings/SubscriptionCard.tsx

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";

import { useUser } from "@/lib/AuthProvider";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import { useBrowserReturnRefresh } from "@/lib/useBrowserReturnRefresh";

const PRICES = {
  premium_month: "price_1TAso3HU07xU2AfQk4fucP73",
  pro_month: "price_1TAsr7HU07xU2AfQhxqpau3T",
};

type SubscriptionDetails = {
  plan: string;
  status?: string | null;
  current_period_end?: string | null;
};

export default function SubscriptionCard() {
  const langCode = useLang();
  const t = uiText[langCode];

  const { user } = useUser();

  const [data, setData] =
    useState<SubscriptionDetails>({
      plan: "free",
      status: null,
      current_period_end: null,
    });

  const [loading, setLoading] =
    useState(true);

  const mountedRef = useRef(false);
  const loadingRef = useRef(false);

  /* ───────────────── Load ───────────────── */

  const load = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        "/api/profile/subscription-details",
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Subscription request failed: ${res.status}`
        );
      }

      const json =
        (await res.json()) as SubscriptionDetails;

      if (!mountedRef.current) {
        return;
      }

      setData({
        plan: json.plan ?? "free",
        status: json.status ?? null,
        current_period_end:
          json.current_period_end ?? null,
      });
    } catch (error) {
      console.error(
        "Subscription details error:",
        error
      );

      if (!mountedRef.current) {
        return;
      }

      setData({
        plan: "free",
        status: null,
        current_period_end: null,
      });
    } finally {
      loadingRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void load();

    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  useBrowserReturnRefresh(
    load,
    {
      enabled: Boolean(user?.id),
    }
  );

  /* ───────────────── Checkout ───────────────── */

  async function checkout(
    priceId: string
  ) {
    if (!user?.id) {
      return;
    }

    try {
      const res = await fetch(
        "/api/stripe/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            priceId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          `Checkout request failed: ${res.status}`
        );
      }

      const json =
        (await res.json()) as {
          url?: string;
        };

      if (json.url) {
        window.location.href =
          json.url;
      }
    } catch (error) {
      console.error(
        "Stripe checkout error:",
        error
      );
    }
  }

  /* ───────────────── Portal home ───────────────── */

  async function openPortal() {
    try {
      const res = await fetch(
        "/api/stripe/portal",
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Portal request failed: ${res.status}`
        );
      }

      const json =
        (await res.json()) as {
          url?: string;
        };

      if (json.url) {
        window.location.href =
          json.url;
      }
    } catch (error) {
      console.error(
        "Stripe portal error:",
        error
      );
    }
  }

  /* ───────────────── Portal update ───────────────── */

  async function openUpdate() {
    try {
      const res = await fetch(
        "/api/stripe/portal-update",
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Portal update request failed: ${res.status}`
        );
      }

      const json =
        (await res.json()) as {
          url?: string;
        };

      if (json.url) {
        window.location.href =
          json.url;
      }
    } catch (error) {
      console.error(
        "Stripe portal update error:",
        error
      );
    }
  }

  /* ───────────────── Helpers ───────────────── */

  function formatDate(
    value?: string | null
  ) {
    if (!value) {
      return null;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date.toLocaleDateString(
      langCode
    );
  }

  const rawPlan =
    data.plan ?? "free";

  const rawStatus =
    data.status ?? null;

  const rawIsPaidPlan =
    rawPlan === "premium" ||
    rawPlan === "pro" ||
    rawPlan === "coach";

  const isActiveSubscription =
    rawIsPaidPlan &&
    (
      rawStatus === "active" ||
      rawStatus === "trialing"
    );

  const plan =
    isActiveSubscription
      ? rawPlan
      : "free";

  const status =
    isActiveSubscription
      ? rawStatus
      : null;

  const renewDate =
    isActiveSubscription
      ? formatDate(
          data.current_period_end
        )
      : null;

  const isPaidPlan =
    isActiveSubscription;

  const showStatus =
    isActiveSubscription &&
    Boolean(status);

  const showRenewDate =
    isActiveSubscription &&
    Boolean(renewDate);

  const planLabel =
    t.subscription.plans[
      plan as keyof typeof t.subscription.plans
    ] ?? plan;

  /* ───────────────── UI ───────────────── */

  return (
    <Card
      header={
        <CardHeader
          title={t.subscription.title}
        />
      }
    >
      {loading && (
        <div>
          {t.subscription.loading}
        </div>
      )}

      {!loading && (
        <>
          {/* PLAN */}

          <div className="mt-3 mb-2">
            {t.subscription.currentPlan}:

            <b className="ml-2">
              {planLabel}
            </b>
          </div>

          {/* STATUS */}

          {showStatus && (
            <div className="text-sm text-gray-600 mb-1">
              {t.subscription.status}:

              <span className="ml-2">
                {status}
              </span>
            </div>
          )}

          {/* RENEW */}

          {showRenewDate && (
            <div className="text-sm text-gray-600 mb-3">
              {t.subscription.renew}:

              <span className="ml-2">
                {renewDate}
              </span>
            </div>
          )}

          {/* FREE */}

          {plan === "free" && (
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="button"
                onClick={() =>
                  checkout(
                    PRICES.premium_month
                  )
                }
                className="
                  w-full
                  px-3
                  py-3
                  bg-[#191970]
                  text-white
                  rounded-[var(--radius)]
                  hover:bg-[#0BA4E0]
                  transition-colors
                  text-center
                  leading-tight
                "
              >
                <div className="font-semibold">
                  {
                    t.subscription
                      .plans.premium
                  }
                </div>

                <div className="text-sm opacity-90">
                  {
                    t.subscription
                      .pricing.premium
                  }
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  checkout(
                    PRICES.pro_month
                  )
                }
                className="
                  w-full
                  px-3
                  py-3
                  bg-[#191970]
                  text-white
                  rounded-[var(--radius)]
                  hover:bg-[#0BA4E0]
                  transition-colors
                  text-center
                  leading-tight
                "
              >
                <div className="font-semibold">
                  {
                    t.subscription
                      .plans.pro
                  }
                </div>

                <div className="text-sm opacity-90">
                  {
                    t.subscription
                      .pricing.pro
                  }
                </div>
              </button>
            </div>
          )}

          {/* PREMIUM / PRO / COACH */}

          {isPaidPlan && (
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="button"
                onClick={openUpdate}
                className="
                  w-full
                  px-4
                  py-3
                  bg-[#191970]
                  text-white
                  rounded-[var(--radius)]
                  hover:bg-[#0BA4E0]
                  transition-colors
                "
              >
                {
                  t.subscription
                    .actions.change
                }
              </button>

              <button
                type="button"
                onClick={openPortal}
                className="
                  w-full
                  px-4
                  py-3
                  bg-[#191970]
                  text-white
                  rounded-[var(--radius)]
                  hover:bg-[#0BA4E0]
                  transition-colors
                "
              >
                {
                  t.subscription
                    .actions.manage
                }
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
