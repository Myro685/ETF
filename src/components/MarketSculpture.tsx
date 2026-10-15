import { useEffect, useRef } from "react";
import { funds } from "../data/etfs";

// A bounded isometric preview keeps depth visible before WebGL is ready.
function SculpturePreview() {
  const groups = [
    { x: 30, rows: 3, columns: 2, step: 29, height: 42, colors: ["#304e41", "#203a30", "#192f27"] },
    { x: 250, rows: 4, columns: 3, step: 22, height: 23, colors: ["#e0e8e1", "#bdcbbf", "#a8b9ac"] },
    { x: 485, rows: 3, columns: 3, step: 26, height: 31, colors: ["#4d8b70", "#39725a", "#2c5b47"] },
  ];
  return (
    <svg className="cl-sculpture-preview" viewBox="0 0 720 220" preserveAspectRatio="xMidYMid meet">
      {groups.map((group, index) => (
        <g key={index}>
          {Array.from({ length: group.rows * group.columns }, (_, tile) => {
            const row = Math.floor(tile / group.columns);
            const column = tile % group.columns;
            if (index === 2 && (row + column) % 2 !== 0) return null;
            const x = group.x + 75 + (column - row) * group.step;
            const y = 65 + (column + row) * group.step * 0.45;
            const w = group.step - 3;
            const d = w * 0.45;
            const h = group.height;
            return (
              <g key={tile}>
                <path fill={group.colors[0]} d={`M${x},${y} l${w},${d} l${-w},${d} l${-w},${-d} Z`} />
                <path fill={group.colors[1]} d={`M${x - w},${y + d} l${w},${d} v${h} l${-w},${-d} Z`} />
                <path fill={group.colors[2]} d={`M${x},${y + 2 * d} l${w},${-d} v${h} l${-w},${d} Z`} />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

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
      </div>
      <div className="cl-sculpture-canvas" ref={host} aria-hidden="true">
        <div className="cl-sculpture-fallback">
          <SculpturePreview />
        </div>
      </div>
      <div className="cl-sculpture-labels">
        {funds.map((fund, index) => (
          <span key={fund.ticker}>
            <b>
              {fund.ticker}
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
