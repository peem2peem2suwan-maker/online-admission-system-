import React from "react";
import logoImg from "../assets/logo.png";

export default function OfficialEmblem({ className = "w-16 h-16", showText = false }) {
  return (
    <div className="inline-flex items-center gap-3">
      <img
        src={logoImg}
        alt="ตราสัญลักษณ์ วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
        className={`${className} object-contain select-none`}
      />
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
