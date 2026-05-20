'use client';

interface Props {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
  formatLabel: (v: number) => string;
}

export default function DualRangeSlider({
  min, max, step = 1, valueMin, valueMax, onChangeMin, onChangeMax, formatLabel,
}: Props) {
  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;
  // Bring min thumb forward when it's in the upper half (avoids getting stuck under max)
  const minOnTop = pctMin > 50;

  return (
    <div className="dr-root">
      <div className="dr-slider-area">
        <div className="dr-track">
          <div className="dr-fill" style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }} />
        </div>
        <input
          type="range" className="dr-input" style={{ zIndex: minOnTop ? 4 : 3 }}
          min={min} max={max} step={step} value={valueMin}
          onChange={e => { const v = +e.target.value; if (v <= valueMax) onChangeMin(v); }}
        />
        <input
          type="range" className="dr-input" style={{ zIndex: minOnTop ? 3 : 4 }}
          min={min} max={max} step={step} value={valueMax}
          onChange={e => { const v = +e.target.value; if (v >= valueMin) onChangeMax(v); }}
        />
      </div>
      <div className="dr-labels">
        <span>{formatLabel(valueMin)}</span>
        <span>{formatLabel(valueMax)}</span>
      </div>
    </div>
  );
}
