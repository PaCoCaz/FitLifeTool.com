// app/components/settings/SubscriptionCard.tsx

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { useUser } from "@/lib/AuthProvider";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  pro: "Pro",
};

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
  const { user } = useUser();

  const [data, setData] =
    useState<SubscriptionDetails>({
      plan: "free",
    });

  const [loading, setLoading] =
    useState(true);

  // -------------------------
  // Load subscription details
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
  // Checkout
  // -------------------------

  async function checkout(
    priceId: string
  ) {
    if (!user?.id) {
      alert("Geen user");
      return;
    }

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
  // Portal
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
    } else {
      alert("Portal fout");
    }
  }

  // -------------------------
  // Helpers
  // -------------------------

  function formatDate(
    value?: string | null
  ) {
    if (!value) return null;

    const d =
      new Date(value);

    return d.toLocaleDateString(
      "nl-NL"
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
    <Card title="Abonnement">
      {loading && (
        <div>Laden...</div>
      )}

      {!loading && (
        <>
          {/* PLAN */}

          <div className="mb-2">
            Plan:
            <b className="ml-2">
              {
                PLAN_LABEL[
                  plan
                ]
              }
            </b>
          </div>

          {/* STATUS */}

          {status && (
            <div className="text-sm text-gray-600 mb-1">
              Status:
              <span className="ml-2">
                {status}
              </span>
            </div>
          )}

          {/* RENEW DATE */}

          {renewDate && (
            <div className="text-sm text-gray-600 mb-3">
              Volgende verlenging:
              <span className="ml-2">
                {renewDate}
              </span>
            </div>
          )}

          {/* FREE */}

          {plan === "free" && (
            <>
              <button
                onClick={() =>
                  checkout(
                    PRICES.premium_month
                  )
                }
                className="px-3 py-2 bg-green-600 text-white rounded mr-2"
              >
                Upgrade naar Premium
              </button>

              <button
                onClick={() =>
                  checkout(
                    PRICES.pro_month
                  )
                }
                className="px-3 py-2 bg-purple-600 text-white rounded"
              >
                Upgrade naar Pro
              </button>
            </>
          )}

          {/* PREMIUM */}

          {plan === "premium" && (
            <>
              <button
                onClick={() =>
                  checkout(
                    PRICES.pro_month
                  )
                }
                className="px-3 py-2 bg-purple-600 text-white rounded mr-2"
              >
                Upgrade naar Pro
              </button>

              <button
                onClick={
                  openPortal
                }
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Beheer abonnement
              </button>
            </>
          )}

          {/* PRO */}

          {plan === "pro" && (
            <button
              onClick={
                openPortal
              }
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Beheer abonnement
            </button>
          )}
        </>
      )}
    </Card>
  );
}