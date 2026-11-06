import React, { useState } from "react";
import { formatIDCard } from "../utils/validation";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Upload,
} from "lucide-react";

export default function StudentStatus({
  applicants,
  onViewOfficialForm,
  onViewEnrollmentSlip,
  onUpdateApplicant,
}) {
  const [searchId, setSearchId] = useState("");
  const [searchedResult, setSearchedResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [reuploadSuccess, setReuploadSuccess] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    const cleanId = searchId.replace(/\D/g, "");
    if (!cleanId) return;

    const found = applicants.find(
      (a) => a.idCard.replace(/\D/g, "") === cleanId
    );
    setSearchedResult(found || null);
    setHasSearched(true);
    setReuploadSuccess(false);
  };

  const handleQuickSearch = (idCard) => {
    setSearchId(idCard);
    const cleanId = idCard.replace(/\D/g, "");
    const found = applicants.find(
      (a) => a.idCard.replace(/\D/g, "") === cleanId
    );
    setSearchedResult(found || null);
    setHasSearched(true);
    setReuploadSuccess(false);
  };

  const handleFixUpload = () => {
    if (!searchedResult) return;
    const updated = {
      ...searchedResult,
      status: "pending",
      officerNote: "ผู้สมัครได้แนบเอกสารเพิ่มเติมแล้ว รอนายทะเบียนตรวจสอบซ้ำ",
      documents: {
        ...searchedResult.documents,
        transcript: true,
        idCardCopy: true,
      },
    };
    onUpdateApplicant(updated);
    setSearchedResult(updated);
    setReuploadSuccess(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle2,
          color: "bg-emerald-100 text-emerald-800 border-emerald-300",
          label: "ผ่านการคัดเลือก (โควตา)",
          dot: "bg-emerald-500",
        };
      case "enrolled":
        return {
          icon: Award,
          color: "bg-blue-100 text-blue-800 border-blue-300",
          label: "มอบตัวและขึ้นทะเบียนแล้ว",
          dot: "bg-blue-500",
        };
      case "need_fix":
        return {
          icon: AlertTriangle,
          color: "bg-rose-100 text-rose-800 border-rose-300",
          label: "เอกสารไม่ครบถ้วน / ต้องแก้ไข",
          dot: "bg-rose-500",
        };
      case "pending":
      default:
        return {
          icon: Clock,
          color: "bg-amber-100 text-amber-800 border-amber-300",
          label: "รอเจ้าหน้าที่ตรวจสอบเอกสาร",
          dot: "bg-amber-500",
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Search Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>ระบบตรวจสอบสถานะใบสมัครออนไลน์</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            ตรวจสอบผลการสมัครและพิมพ์เอกสาร
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            กรอกเลขประจำตัวประชาชน 13 หลักของผู้สมัคร เพื่อเช็กสถานะการพิจารณา และดาวน์โหลดใบสมัคร (PDF)
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                maxLength={17}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="กรอกเลขประจำตัวประชาชน 13 หลัก"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-mono tracking-wider focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
            >
              ค้นหาข้อมูล
            </button>
          </div>
        </form>

        {/* Demo Quick Chips */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400">คลิกทดสอบเลขตัวอย่าง:</span>
          {applicants.slice(0, 4).map((a) => (
            <button
              key={a.id}
              onClick={() => handleQuickSearch(a.idCard)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-600 transition-colors cursor-pointer border border-slate-200"
            >
              {a.firstName} ({a.status === "enrolled" ? "มอบตัวแล้ว" : a.status === "approved" ? "ผ่านแล้ว" : a.status === "need_fix" ? "เอกสารไม่ครบ" : "รอตรวจ"})
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {hasSearched && (
        <div>
          {searchedResult ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Header Status Bar */}
              {(() => {
                const badge = getStatusBadge(searchedResult.status);
                const Icon = badge.icon;
                return (
                  <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full ${badge.dot} animate-pulse`}></span>
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                          สถานะการสมัคร
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mt-1 flex items-center gap-2">
                        <span>{searchedResult.fullName || `${searchedResult.title} ${searchedResult.firstName} ${searchedResult.lastName}`}</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        เลขบัตร ปชช: {formatIDCard(searchedResult.idCard)} • รหัสใบสมัคร: {searchedResult.code}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 self-start sm:self-center">
                      <Icon className="w-5 h-5 text-amber-300" />
                      <span className="font-semibold text-sm">{badge.label}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Status Details & Actions */}
              <div className="p-6 sm:p-8 space-y-6">

                {/* If Need Fix */}
                {searchedResult.status === "need_fix" && (
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">
                          แจ้งเตือน: เจ้าหน้าที่พบข้อผิดพลาดหรือเอกสารไม่ครบถ้วน
                        </h4>
                        <p className="text-xs mt-1 text-rose-800 leading-relaxed font-medium">
                          ข้อความจากเจ้าหน้าที่: "{searchedResult.officerNote}"
                        </p>
                      </div>
                    </div>

                    {reuploadSuccess ? (
                      <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>อัปโหลดเอกสารใหม่เรียบร้อยแล้ว สถานะเปลี่ยนเป็นรอเจ้าหน้าที่ตรวจสอบซ้ำ</span>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={handleFixUpload}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <Upload className="w-4 h-4" />
                          <span>อัปโหลดเอกสารที่แก้ไข (จำลองส่งใหม่)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* If Approved or Enrolled */}
                {(searchedResult.status === "approved" || searchedResult.status === "enrolled") && (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">
                        ขอแสดงความยินดี! คุณผ่านการคัดเลือกเข้าศึกษาต่อ (โควตาพิเศษ)
                      </h4>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        สาขาวิชา: <span className="font-bold">{searchedResult.major1}</span> ({searchedResult.levelName})
                        {searchedResult.studentId && (
                          <span className="block mt-1 font-semibold text-blue-900">
                            รหัสประจำตัวนักเรียน/นักศึกษา: <span className="font-mono text-sm underline">{searchedResult.studentId}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 block">ระดับชั้นที่สมัคร:</span>
                    <span className="font-semibold text-slate-800">{searchedResult.levelName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">สาขาวิชาลำดับที่ 1:</span>
                    <span className="font-semibold text-blue-700">{searchedResult.major1}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">สาขาวิชาลำดับที่ 2:</span>
                    <span className="font-semibold text-slate-800">{searchedResult.major2 || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">เกรดเฉลี่ยสะสม (GPAX):</span>
                    <span className="font-semibold text-slate-800">{searchedResult.gpax || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">โรงเรียนเดิม:</span>
                    <span className="font-semibold text-slate-800">{searchedResult.previousSchool || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">เบอร์โทรศัพท์ติดต่อ:</span>
                    <span className="font-semibold text-slate-800 font-mono">{searchedResult.phone || "-"}</span>
                  </div>
                </div>

                {/* Action Buttons: Print Forms */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onViewOfficialForm(searchedResult)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>พิมพ์ / ดาวน์โหลดรายงานใบสมัคร (PDF)</span>
                  </button>

                  {(searchedResult.status === "enrolled" || searchedResult.status === "approved") && (
                    <button
                      onClick={() => onViewEnrollmentSlip(searchedResult)}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>พิมพ์หลักฐานการมอบตัว / ทะเบียนนักศึกษา</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                ไม่พบข้อมูลใบสมัครจากเลขประจำตัวประชาชนนี้
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                โปรดตรวจสอบความถูกต้องของเลข 13 หลัก หรือหากยังไม่ได้กรอกใบสมัคร สามารถไปที่แท็บ "สมัครเรียนออนไลน์" เพื่อเริ่มกรอกข้อมูล
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
