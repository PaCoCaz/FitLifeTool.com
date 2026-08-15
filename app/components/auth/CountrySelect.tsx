"use client";

import { useEffect, useId, useState } from "react";
import { useLang } from "@/lib/useLang";
import type { CountryOption } from "@/lib/countries/countryReference";

type Props = {
  value: string;
  onChange: (countryCode: string) => void;
  label: string;
  placeholder: string;
  loadingLabel: string;
  errorLabel: string;
  disabled?: boolean;
};

export default function CountrySelect({
  value,
  onChange,
  label,
  placeholder,
  loadingLabel,
  errorLabel,
  disabled = false,
}: Props) {
  const id = useId();
  const lang = useLang();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || loading || error}
        aria-describedby={error ? `${id}-error` : undefined}
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
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {errorLabel}
        </p>
      )}
    </div>
  );
}
