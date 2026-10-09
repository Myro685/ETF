import { useEffect, useRef } from "react";
import { funds } from "../data/etfs";

// The illustration describes three approaches, not holdings or performance.
export function MarketSculpture() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let active = true;
    let started = false;
    let dispose: (() => void) | undefined;

    async function loadScene() {
      if (started) return;
      started = true;
      try {
        const { createMarketScene } = await import("./marketScene");
        if (active) dispose = createMarketScene(element!);
      } catch {
        // The lightweight schematic remains visible if WebGL or loading fails.
        if (active) element!.dataset.rendered = "false";
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void loadScene();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => {
      active = false;
      observer.disconnect();
      dispose?.();
    };
  }, []);

  return (
    <figure className="cl-sculpture">
      <div className="cl-sculpture-head">
        <span>Tři pohledy na americký trh</span>
        <span>Studie 01—03</span>
      </div>
      <div className="cl-sculpture-canvas" ref={host} aria-hidden="true">
        <div className="cl-sculpture-fallback">
          {[6, 12, 5].map((count, index) => (
            <div className={`cl-study cl-study-${index + 1}`} key={index}>
              {Array.from({ length: count }, (_, tile) => (
                <i key={tile} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="cl-sculpture-labels">
        {funds.map((fund, index) => (
          <span key={fund.ticker}>
            <b>
              0{index + 1} / {fund.ticker}
            </b>
            {index === 2 ? "Dividendový výběr" : fund.short}
          </span>
        ))}
      </div>
      <figcaption>
        Schematická ilustrace. Počet a velikost dílků nepředstavují složení
        fondů ani jejich výnos.
      </figcaption>
    </figure>
  );
}
