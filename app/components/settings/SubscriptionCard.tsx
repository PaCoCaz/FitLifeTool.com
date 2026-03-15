// app/components/settings/SubscriptionCard.tsx

"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  pro: "Pro",
};

const PLAN_PRICE: Record<string, string> = {
  free: "Gratis",
  premium: "€ 4,95 / maand",
  pro: "€ 8,95 / maand",
};

const PRICE_ID = {
  premium:
    "price_1TAso3HU07xU2AfQk4fucP73",

  pro:
    "price_1TAsr7HU07xU2AfQhxqpau3T",
};

export default function SubscriptionCard() {

  const [plan, setPlan] =
    useState<string>("free");

  const [userId, setUserId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  // -------------------------
  // load
  // -------------------------

  async function load() {

    try {

      const res =
        await fetch(
          "/api/profile/subscription"
        );

      const data =
        await res.json();

      const p =
        data?.abonnement ?? "free";

      if (p === "coach") {
        setPlan("pro");
      } else {
        setPlan(p);
      }

      setUserId(
        data?.user_id ?? null
      );

    } catch {

      setPlan("free");

    }

    setLoading(false);

  }

  useEffect(() => {
    load();
  }, []);

  // -------------------------
  // portal
  // -------------------------

  async function openPortal() {

    const res =
      await fetch(
        "/api/stripe/portal",
        {
          method: "POST",
        }
      );

    const data =
      await res.json();

    if (data.url) {

      window.location.href =
        data.url;

    }

  }

  // -------------------------
  // checkout (free → premium)
  // -------------------------

  async function checkout(
    priceId: string
  ) {

    if (!userId) return;

    setBusy(true);

    const res =
      await fetch(
        "/api/stripe/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            priceId,
            userId,
          }),
        }
      );

    const data =
      await res.json();

    if (data.url) {

      window.location.href =
        data.url;

    }

    setBusy(false);

  }

  // -------------------------
  // change plan (premium → pro)
  // -------------------------

  async function changePlan(
    priceId: string
  ) {

    setBusy(true);

    await fetch(
      "/api/stripe/change-plan",
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

    location.reload();

  }

  // -------------------------
  // UI
  // -------------------------

  return (
    <Card title="Abonnement">

      {loading && <div>Laden...</div>}

      {!loading && (

        <div className="space-y-3">

          <div>

            <div className="text-sm text-gray-500">
              Plan
            </div>

            <div className="text-lg font-semibold">
              {PLAN_LABEL[plan]}
            </div>

          </div>

          <div>

            <div className="text-sm text-gray-500">
              Prijs
            </div>

            <div>
              {PLAN_PRICE[plan]}
            </div>

          </div>

          {/* FREE */}

          {plan === "free" && (

            <button
              disabled={busy}
              onClick={() =>
                checkout(
                  PRICE_ID.premium
                )
              }
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Upgrade naar Premium
            </button>

          )}

          {/* PREMIUM */}

          {plan === "premium" && (

            <button
              disabled={busy}
              onClick={() =>
                changePlan(
                  PRICE_ID.pro
                )
              }
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Upgrade naar Pro
            </button>

          )}

          {/* betaald */}

          {plan !== "free" && (

            <button
              onClick={openPortal}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Beheer abonnement
            </button>

          )}

        </div>

      )}

    </Card>
  );

}
