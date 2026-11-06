import React from "react";
import OfficialEmblem from "./OfficialEmblem";
import {
  FileEdit,
  Search,
  LayoutDashboard,
  ShieldAlert,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  applicantCount,
  onResetData,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & College Branding */}
          <div
            onClick={() => setActiveTab("register")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="transition-transform group-hover:scale-105">
              <OfficialEmblem className="w-11 h-11" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                  สอศ. • อาชีวศึกษา
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                  รอบโควตา ๒๕๖๘
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ระบบรับสมัครและรายงานตัวนักเรียน นักศึกษา ออนไลน์ (Online Admission)
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Tab 1: Apply */}
            <button
              onClick={() => setActiveTab("register")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span className="hidden sm:inline">สมัครเรียนออนไลน์</span>
              <span className="sm:hidden">ใบสมัคร</span>
            </button>

            {/* Tab 2: Check Status */}
            <button
              onClick={() => setActiveTab("status")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "status"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>ตรวจสอบสถานะ</span>
            </button>

            {/* Tab 3: Admin Portal */}
            <button
              onClick={() => setActiveTab("admin")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>แดชบอร์ดเจ้าหน้าที่</span>
              {applicantCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-500 text-white font-bold">
                  {applicantCount}
                </span>
              )}
            </button>

            {/* Reset data helper */}
            <button
              onClick={onResetData}
              title="รีเซ็ตข้อมูลตัวอย่างเป็นค่าเริ่มต้น"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
