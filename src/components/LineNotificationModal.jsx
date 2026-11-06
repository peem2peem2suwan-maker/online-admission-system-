import React from "react";
import { MessageSquare, X, Send, CheckCheck, Bell } from "lucide-react";

export default function LineNotificationModal({ applicant, onClose }) {
  if (!applicant) return null;

  const nowTime = new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusThai = (status) => {
    switch (status) {
      case "approved":
        return "🎉 ผ่านการคัดเลือกเข้าศึกษาต่อ (โควตา)";
      case "enrolled":
        return "🎓 ขึ้นทะเบียนมอบตัวสำเร็จแล้ว";
      case "need_fix":
        return "⚠️ กรุณาแก้ไขหรือแนบเอกสารเพิ่มเติม";
      default:
        return "📋 ได้รับใบสมัครเรียบร้อยแล้ว อยู่ระหว่างตรวจสอบ";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#06C755] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">LINE OA / Notify Simulator</h3>
              <p className="text-[11px] text-emerald-100">ระบบแจ้งเตือนอัตโนมัติถึงผู้สมัคร</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-lg text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body Mock */}
        <div className="p-4 bg-[#7494C0]/20 min-h-[300px] flex flex-col justify-end space-y-3">
          {/* Notification bubble */}
          <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm border border-slate-200 text-xs text-slate-800 space-y-2 max-w-[90%]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-[#06C755] flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" />
                <span>งานรับสมัคร วท.ท่าหลวงฯ</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{nowTime}</span>
            </div>

            <p className="font-bold text-slate-900 text-sm">
              {getStatusThai(applicant.status)}
            </p>

            <p className="leading-relaxed">
              เรียนคุณ <span className="font-semibold">{applicant.fullName || `${applicant.title} ${applicant.firstName} ${applicant.lastName}`}</span>
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
              <p><span className="text-slate-500">รหัสใบสมัคร:</span> {applicant.code}</p>
              <p><span className="text-slate-500">ระดับ:</span> {applicant.levelName}</p>
              <p><span className="text-slate-500">สาขาวิชา:</span> {applicant.major1}</p>
              {applicant.studentId && (
                <p className="text-blue-700 font-bold"><span className="text-slate-500">รหัสนักศึกษา:</span> {applicant.studentId}</p>
              )}
            </div>

            {applicant.officerNote && (
              <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px]">
                💬 ข้อความจากเจ้าหน้าที่: "{applicant.officerNote}"
              </p>
            )}

            <p className="text-slate-500 text-[11px] pt-1">
              ท่านสามารถตรวจสอบผลและดาวน์โหลดใบสมัคร (PDF) ได้ที่เว็บไซต์รับสมัครออนไลน์
            </p>

            <div className="flex justify-end pt-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <span>อ่านแล้ว</span>
                <CheckCheck className="w-3 h-3 text-[#06C755]" />
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            เชื่อมต่อผ่าน Webhook / LINE Messaging API
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#06C755] hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
          >
            รับทราบ
          </button>
        </div>
      </div>
    </div>
  );
}
