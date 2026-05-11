// app/components/settings/SubscriptionCard.tsx

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import { useUser } from "@/lib/AuthProvider";

import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

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
    });

  const [loading, setLoading] =
    useState(true);

  // -------------------------
  // Load
  // -------------------------

  async function load() {
    try {
      const res =
        await fetch(
          "/api/profile/subscription-details"
        );

      const json =
        await res.json();

      setData(json);
    } catch {
      setData({
        plan: "free",
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // -------------------------
  // Checkout (free only)
  // -------------------------

  async function checkout(
    priceId: string
  ) {
    if (!user?.id) return;

    const res =
      await fetch(
        "/api/stripe/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            priceId,
            userId: user.id,
          }),
        }
      );

    const json =
      await res.json();

    if (json.url) {
      window.location.href =
        json.url;
    }
  }

  // -------------------------
  // Portal home
  // -------------------------

  async function openPortal() {
    const res =
      await fetch(
        "/api/stripe/portal",
        {
          method: "POST",
        }
      );

    const json =
      await res.json();

    if (json.url) {
      window.location.href =
        json.url;
    }
  }

  // -------------------------
  // Portal update
  // -------------------------

  async function openUpdate() {
    const res =
      await fetch(
        "/api/stripe/portal-update",
        {
          method: "POST",
        }
      );

    const json =
      await res.json();

    if (json.url) {
      window.location.href =
        json.url;
    }
  }

  // -------------------------
  // Helpers
  // -------------------------

  function formatDate(
    value?: string | null
  ) {
    if (!value) return null;

    return new Date(
      value
    ).toLocaleDateString(
      langCode
    );
  }

  const plan =
    data.plan ?? "free";

  const status =
    data.status ?? null;

  const renewDate =
    formatDate(
      data.current_period_end
    );

  // -------------------------
  // UI
  // -------------------------

  return (
    <Card
      header={<CardHeader title={t.subscription.title} />}
    >
      {loading && <div>{t.subscription.loading}</div>}

      {!loading && (
        <>
          {/* PLAN */}

          <div className="mt-3 mb-2">
            {t.subscription.currentPlan}:
            <b className="ml-2">
              {t.subscription.plans[plan]}
            </b>
          </div>

          {/* STATUS */}

          {status && (
            <div className="text-sm text-gray-600 mb-1">
              {t.subscription.status}:
              <span className="ml-2">{status}</span>
            </div>
          )}

          {/* RENEW */}

          {renewDate && (
            <div className="text-sm text-gray-600 mb-3">
              {t.subscription.renew}:
              <span className="ml-2">{renewDate}</span>
            </div>
          )}

          {/* FREE */}

          {plan === "free" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() =>
                  checkout(
                    PRICES.premium_month
                  )
                }
                className="
                  w-full
                  px-3 py-3
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
                  {t.subscription.plans.premium}
                </div>
                <div className="text-sm opacity-90">
                  {t.subscription.pricing.premium}
                </div>
              </button>

              <button
                onClick={() =>
                  checkout(
                    PRICES.pro_month
                  )
                }
                className="
                  w-full
                  px-3 py-3
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
                  {t.subscription.plans.pro}
                </div>
                <div className="text-sm opacity-90">
                  {t.subscription.pricing.pro}
                </div>
              </button>
            </div>
          )}

          {/* PREMIUM / PRO */}

          {(plan === "premium" ||
            plan === "pro") && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={openUpdate}
                className="
                  w-full px-4 py-3
                  bg-[#191970]
                  text-white
                  rounded-[var(--radius)]
                  hover:bg-[#0BA4E0]
                  transition-colors
                "
              >
                {t.subscription.actions.change}
              </button>

              <button
                onClick={openPortal}
                className="
                  w-full px-4 py-3
                  bg-[#191970]
                  text-white
                  rounded-[var(--radius)]
                  hover:bg-[#0BA4E0]
                  transition-colors
                "
              >
                {t.subscription.actions.manage}
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}