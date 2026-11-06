import React from "react";

export default function OfficialEmblem({ className = "w-16 h-16", showText = false }) {
  return (
    <div className="inline-flex items-center gap-3">
      <svg
        viewBox="0 0 160 160"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Ring */}
        <circle cx="80" cy="80" r="76" stroke="#1e293b" strokeWidth="4" fill="#ffffff" />
        <circle cx="80" cy="80" r="69" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="80" cy="80" r="54" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="50" stroke="#1e293b" strokeWidth="1" />

        {/* Circular Text Path for สำนักงานคณะกรรมการการอาชีวศึกษา */}
        <path
          id="textRingPath"
          d="M 17,80 A 63,63 0 1,1 143,80 A 63,63 0 1,1 17,80"
          fill="none"
        />
        <text fontSize="9.5" fontWeight="bold" fill="#0f172a" letterSpacing="0.8">
          <textPath href="#textRingPath" startOffset="50%" textAnchor="middle">
            สำนักงานคณะกรรมการการอาชีวศึกษา • สอศ. •
          </textPath>
        </text>

        {/* Inner Emblem: Vocational Gear & Traditional Motif */}
        <g transform="translate(80, 82)">
          {/* Central Gear Cog */}
          <circle cx="0" cy="0" r="30" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
          
          {/* Gear teeth */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <rect
              key={i}
              x="-3.5"
              y="-35"
              width="7"
              height="8"
              rx="1.5"
              fill="#1e293b"
              transform={`rotate(${deg})`}
            />
          ))}

          {/* Central Flame / Crown / Lotus motif representing Technical Arts (Phra Wisanukam) */}
          <path
            d="M 0 -22 C -8 -10 -14 0 -14 12 C -14 20 -8 24 0 24 C 8 24 14 20 14 12 C 14 0 8 -10 0 -22 Z"
            fill="#334155"
          />
          <path
            d="M 0 -18 C -5 -8 -8 0 -8 10 C -8 16 -4 19 0 19 C 4 19 8 16 8 10 C 8 0 5 -8 0 -18 Z"
            fill="#f8fafc"
          />
          <circle cx="0" cy="3" r="5" fill="#1e293b" />
          <path d="M -8 14 L 8 14 L 0 -10 Z" fill="#e2e8f0" opacity="0.6" />
        </g>
      </svg>
      {showText && (
        <div className="text-left">
          <p className="text-xs uppercase tracking-wider font-semibold text-sky-700">
            สำนักงานคณะกรรมการการอาชีวศึกษา
          </p>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">
            วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
          </h1>
          <p className="text-xs text-slate-500">
            ระบบรับสมัครนักเรียน นักศึกษา ออนไลน์ (โควตา)
          </p>
        </div>
      )}
    </div>
  );
}
