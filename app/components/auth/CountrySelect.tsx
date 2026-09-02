"use client";

import { useEffect, useId, useState } from "react";
import { useLang } from "@/lib/useLang";
import type { CountryOption } from "@/lib/countries/countryReference";

type Props = {
  id?: string;
  value: string;
  onChange: (countryCode: string) => void;
  label: string;
  placeholder: string;
  loadingLabel: string;
  errorLabel: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
};

export default function CountrySelect({
  id,
  value,
  onChange,
  label,
  placeholder,
  loadingLabel,
  errorLabel,
  disabled = false,
  invalid = false,
  describedBy,
}: Props) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const lang = useLang();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const internalErrorId = `${selectId}-load-error`;
  const ariaDescribedBy =
    [describedBy, error ? internalErrorId : null].filter(Boolean).join(" ") ||
    undefined;

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(`/api/reference/countries?lang=${encodeURIComponent(lang)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Country request failed");

        const result = (await response.json()) as { countries?: CountryOption[] };
        setCountries(result.countries ?? []);
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCountries();
    return () => controller.abort();
  }, [lang]);

  return (
    <div>
      <label htmlFor={selectId} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || loading || error}
        aria-invalid={invalid || error}
        aria-describedby={ariaDescribedBy}
        className="w-full rounded border px-3 py-2 text-base disabled:bg-gray-100"
      >
        <option value="">{loading ? loadingLabel : placeholder}</option>
        {countries.map((country) => (
          <option key={country.country_code} value={country.country_code}>
            {country.name}
          </option>
        ))}
      </select>
      {error && (
        <p id={internalErrorId} className="mt-1 text-sm text-red-600" role="alert">
          {errorLabel}
        </p>
      )}
    </div>
  );
}
