"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import CountrySelect from "@/components/auth/CountrySelect";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/AuthProvider";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";
import type { CountryOption } from "@/lib/countries/countryReference";
import { formatUnsupportedRegionMessage, isSupportedRegionalMarket } from "@/lib/markets/nutritionMarketSupport";

type RegionValues = { country_code: string; food_region: string };

export default function RegionCard() {
  const { user } = useUser();
  const lang = useLang();
  const t = uiText[lang];
  const [saved, setSaved] = useState<RegionValues | null>(null);
  const [draft, setDraft] = useState<RegionValues>({ country_code: "", food_region: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supportedMarketCodes, setSupportedMarketCodes] = useState<string[] | null>(null);
  const [countryNames, setCountryNames] = useState<CountryOption[]>([]);

  useEffect(() => {
    if (!user) return;
    void supabase.from("profiles").select("country_code, food_region").eq("id", user.id).single().then((result: { data: RegionValues | null; error: { message: string } | null }) => {
      const { data, error: loadError } = result;
      if (loadError || !data) {
        setError(t.auth.onboardingError);
        return;
      }
      const values = { country_code: data.country_code, food_region: data.food_region };
      setSaved(values);
      setDraft(values);
    });
  }, [t.auth.onboardingError, user]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMarketSupport() {
      try {
        const response = await fetch("/api/reference/nutrition-markets", { signal: controller.signal });
        if (!response.ok) throw new Error("Nutrition market request failed");
        const result = (await response.json()) as { market_codes?: string[] };
        setSupportedMarketCodes(result.market_codes ?? []);
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") setSupportedMarketCodes(null);
      }
    }

    void loadMarketSupport();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountryNames() {
      try {
        const response = await fetch(`/api/reference/countries?lang=${encodeURIComponent(lang)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Country request failed");
        const result = (await response.json()) as { countries?: CountryOption[] };
        setCountryNames(result.countries ?? []);
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") setCountryNames([]);
      }
    }

    void loadCountryNames();
    return () => controller.abort();
  }, [lang]);

  const dirty = saved && (draft.country_code !== saved.country_code || draft.food_region !== saved.food_region);
  const invalid = !draft.country_code || !draft.food_region;
  const savedFoodRegionName = countryNames.find(
    ({ country_code }) => country_code === saved?.food_region
  )?.name;
  const showUnsupportedRegion = Boolean(
    saved?.food_region &&
      savedFoodRegionName &&
      supportedMarketCodes &&
      !isSupportedRegionalMarket(saved.food_region, supportedMarketCodes)
  );

  async function save() {
    if (!user || !dirty || invalid) return;
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase.from("profiles").update({
      country_code: draft.country_code,
      food_region: draft.food_region,
      updated_at: new Date().toJSON(),
    }).eq("id", user.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved({ ...draft });
  }

  return (
    <Card header={<CardHeader title={t.auth.regionTitle} />}>
      <div className="space-y-5 pt-3">
        <div>
          <CountrySelect value={draft.country_code} onChange={(country_code) => setDraft((current) => ({ ...current, country_code }))} label={t.auth.residenceCountry} placeholder={t.auth.selectCountry} loadingLabel={t.auth.loadingCountries} errorLabel={t.auth.countryLoadError} disabled={saving} />
          <p className="mt-1 text-xs text-gray-500">{t.auth.residenceDescription}</p>
        </div>
        <div>
          <CountrySelect value={draft.food_region} onChange={(food_region) => setDraft((current) => ({ ...current, food_region }))} label={t.auth.foodRegion} placeholder={t.auth.selectCountry} loadingLabel={t.auth.loadingCountries} errorLabel={t.auth.countryLoadError} disabled={saving} />
          <p className="mt-1 text-xs text-gray-500">{t.auth.foodRegionDescription}</p>
          {showUnsupportedRegion && savedFoodRegionName && (
            <p className="mt-2 text-xs text-amber-700" role="status">
              {formatUnsupportedRegionMessage(t.auth.unsupportedFoodRegion, savedFoodRegionName)}
            </p>
          )}
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <div className="flex justify-end pt-2">
          <button
            onClick={save}
            disabled={!dirty || invalid || saving}
            className={`
              rounded-[var(--radius)]
              border
              px-4
              py-2
              text-sm

              ${
                saving
                  ? "border-gray-300 text-gray-400"
                  : !dirty || invalid
                  ? "border-green-500 text-green-600"
                  : "border-[#0095D3] text-[#0095D3] hover:bg-[#0095D3] hover:text-white"
              }
            `}
          >
            {saving
              ? t.common.saving
              : !dirty || invalid
              ? t.common.saved
              : t.common.save}
          </button>
        </div>
      </div>
    </Card>
  );
}
