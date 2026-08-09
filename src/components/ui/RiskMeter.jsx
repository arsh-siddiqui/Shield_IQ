import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getRiskColor(score) {
  if (score >= 70) return "#EF4444";
  if (score >= 40) return "#F59E0B";
  if (score >= 15) return "#14B8A6";
  return "#22C55E";
}

function getRiskLabel(score) {
  if (score >= 70) return "High Risk";
  if (score >= 40) return "Medium Risk";
  if (score >= 15) return "Low Risk";
  return "Safe";
}

export default function RiskMeter({ score = 0, size = 200, strokeWidth = 16 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // half circle
  const color = getRiskColor(score);

  useEffect(() => {
    let frame;
    let start;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplayScore(Math.round(progress * score));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + strokeWidth / 2} viewBox={`0 0 ${size} ${size / 2 + strokeWidth / 2}`}>
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke 0.4s ease" }}
        />
      </svg>
      <div className="-mt-8 text-center">
        <div className="text-4xl font-extrabold" style={{ color }}>
          {displayScore}
        </div>
        <div className="text-sm font-semibold text-ink-light mt-1">{getRiskLabel(score)}</div>
      </div>
    </div>
  );
}
