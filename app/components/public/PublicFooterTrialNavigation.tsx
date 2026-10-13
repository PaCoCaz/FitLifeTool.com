"use client";

import { useLayoutEffect, useRef, useState } from "react";

type FooterLabels = readonly [string, string, string, string, string, string];

const ROW_OPTIONS = [[6], [4, 2], [3, 3], [2, 2, 2]] as const;

export default function PublicFooterTrialNavigation({
  labels,
  ariaLabel,
}: {
  labels: FooterLabels;
  ariaLabel: string;
}) {
  const navigationRef = useRef<HTMLElement>(null);
  const [rowLengths, setRowLengths] = useState<readonly number[]>([2, 2, 2]);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    const measure = () => {
      const labelWidths = Array.from(
        navigation.querySelectorAll<HTMLElement>("[data-footer-measure-label]")
      ).map((element) => element.getBoundingClientRect().width);
      const separator = navigation.querySelector<HTMLElement>("[data-footer-measure-separator]");
      const separatorStyle = separator ? getComputedStyle(separator) : null;
      const separatorWidth = separator && separatorStyle
        ? separator.getBoundingClientRect().width
          + parseFloat(separatorStyle.marginLeft)
          + parseFloat(separatorStyle.marginRight)
        : 0;
      const availableWidth = navigation.clientWidth;

      if (labelWidths.length !== labels.length || availableWidth <= 0) return;

      const fittingRows = ROW_OPTIONS.find((option) => {
        let offset = 0;
        return option.every((length) => {
          const rowWidth = labelWidths
            .slice(offset, offset + length)
            .reduce((sum, width) => sum + width, 0) + (length - 1) * separatorWidth;
          offset += length;
          return rowWidth <= availableWidth;
        });
      });

      if (fittingRows) setRowLengths(fittingRows);
      setMeasured(true);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(navigation);
    void document.fonts.ready.then(measure);
    return () => observer.disconnect();
  }, [labels]);

  const rowStarts = rowLengths.map((_, index) =>
    rowLengths.slice(0, index).reduce((sum, length) => sum + length, 0)
  );
  return (
    <nav
      ref={navigationRef}
      className="public-web-footer-trial-navigation"
      aria-label={ariaLabel}
      data-measured={measured}
    >
      <div className="public-web-footer-trial-measure" aria-hidden="true">
        {labels.map((label, index) => (
          <span data-footer-measure-label key={index}>{label}</span>
        ))}
        <span data-footer-measure-separator className="public-web-footer-trial-separator">|</span>
      </div>
      {rowLengths.map((length, rowIndex) => {
        const row = labels.slice(rowStarts[rowIndex], rowStarts[rowIndex] + length);
        return (
          <ul className="public-web-footer-trial-row" key={rowIndex}>
            {row.map((label, index) => (
              <li key={`${rowIndex}-${index}`}>
                {index > 0 && (
                  <span className="public-web-footer-trial-separator" aria-hidden="true">|</span>
                )}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </nav>
  );
}
