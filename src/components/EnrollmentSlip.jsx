import React, { useRef } from "react";
import OfficialEmblem from "./OfficialEmblem";
import { toThaiNumerals, formatIDCard } from "../utils/validation";
import { Printer, X, Award, Info, FileText } from "lucide-react";

export default function EnrollmentSlip({ applicant, onClose }) {
  const printRef = useRef(null);

  if (!applicant) return null;

  const handlePrint = () => {
    window.print();
  };

  const studentFullName = applicant.fullName || `${applicant.title || ""} ${applicant.firstName || ""} ${applicant.lastName || ""}`.trim();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed-none">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Toolbar */}
        <div className="no-print bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base leading-tight">
                หลักฐานยืนยันสิทธิ์และใบมอบตัวเป็นนักศึกษา
              </h3>
              <p className="text-xs text-slate-400">
                รหัสนักศึกษา: <span className="text-amber-300 font-mono font-bold">{applicant.studentId || "รอออกรหัส"}</span> • {studentFullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
              title="ปิดหน้าต่าง (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tip Banner */}
        <div className="no-print bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-950 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>วิธีบันทึกเป็นไฟล์ PDF:</strong> กดปุ่มสีเขียว <strong>"พิมพ์ / บันทึกเป็น PDF"</strong> แล้วตรงช่อง <em>"เครื่องพิมพ์"</em> ให้เลือกเป็น <strong>"บันทึกเป็น PDF (Save as PDF)"</strong> จะได้ไฟล์คมชัดทันที
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer ml-2"
          >
            ปิดหน้าต่าง
          </button>
        </div>

        {/* Paper */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          <div
            ref={printRef}
            className="w-[210mm] min-h-[260mm] bg-white text-black p-[15mm_20mm] shadow-lg print:shadow-none print:w-full print:p-0 font-sarabun text-[15px] leading-relaxed relative border border-slate-200 print:border-none box-border"
          >
            <div className="text-center relative mb-6">
              <div className="flex justify-center mb-2">
                <OfficialEmblem className="w-20 h-20" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                ใบรายงานตัวและมอบตัวเข้าเป็นนักเรียน นักศึกษาใหม่
              </h1>
              <h2 className="text-base font-semibold text-slate-800 mt-1">
                วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ ประจำปีการศึกษา {toThaiNumerals(applicant.academicYear || "2568")}
              </h2>
              <div className="mt-3 inline-block bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold px-4 py-1 rounded-full">
                สถานะ: ผ่านการคัดเลือกและขึ้นทะเบียนมอบตัวเรียบร้อยแล้ว
              </div>
            </div>

            {/* Student ID Card Banner */}
            <div className="border-2 border-slate-800 rounded-xl p-4 my-6 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 uppercase">Student Registration ID</p>
                <p className="text-2xl font-bold font-mono text-blue-900 tracking-wider">
                  {applicant.studentId || "PENDING"}
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  ชื่อ-สกุล: <span className="text-slate-900">{studentFullName}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600">เลขบัตรประชาชน</p>
                <p className="font-mono text-sm font-bold text-slate-800">
                  {formatIDCard(applicant.idCard)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  รหัสใบสมัคร: {applicant.code}
                </p>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3 border-t border-b border-slate-300 py-4 text-[15px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-700">ระดับการศึกษา:</span>{" "}
                  <span>{applicant.levelName || applicant.level}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">สาขาวิชาที่ได้รับการคัดเลือก:</span>{" "}
                  <span className="font-bold text-blue-900">{applicant.major1 || applicant.major}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-700">โรงเรียนเดิม:</span>{" "}
                  <span>{applicant.previousSchool || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">เกรดเฉลี่ยสะสม (GPAX):</span>{" "}
                  <span className="font-bold">{applicant.gpax || "-"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-700">เบอร์โทรศัพท์ติดต่อ:</span>{" "}
                  <span>{applicant.phone || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">วันที่ขึ้นทะเบียนมอบตัว:</span>{" "}
                  <span>{applicant.enrollmentDate ? new Date(applicant.enrollmentDate).toLocaleDateString("th-TH") : "วันมอบตัวตามกำหนดการ"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-700">ผู้ปกครองที่มามอบตัว:</span>{" "}
                  <span>{applicant.guardianName || applicant.fatherName || applicant.motherName || "-"} ({applicant.guardianRelation || "ผู้ปกครอง"})</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">อาจารย์ผู้รับมอบตัว:</span>{" "}
                  <span>{applicant.witnessName || "คณะกรรมการรับรายงานตัว"}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-sm space-y-1 text-slate-800">
              <p className="font-bold text-blue-950">คำแนะนำสำหรับนักเรียน นักศึกษาใหม่:</p>
              <p>๑. โปรดเก็บเอกสารฉบับนี้ไว้เป็นหลักฐานเพื่อใช้รับชุดนักเรียน อุปกรณ์การเรียน และทำบัตรประจำตัวนักศึกษา</p>
              <p>๒. กำหนดการเปิดภาคเรียนและการปฐมนิเทศ ติดตามประกาศได้ทางเว็บไซต์วิทยาลัย หรือเพจประชาสัมพันธ์</p>
              <p>๓. หากมีข้อสงสัย ติดต่องานทะเบียนและวัดผล โทร. 036-271-234</p>
            </div>

            {/* Signatures */}
            <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
              <div className="space-y-1">
                <p>ลงชื่อ..........................................................</p>
                <p>( {studentFullName} )</p>
                <p className="text-slate-600">นักเรียน/นักศึกษาใหม่</p>
              </div>
              <div className="space-y-1">
                <p>ลงชื่อ..........................................................</p>
                <p>( {applicant.witnessName || "...................................................."} )</p>
                <p className="text-slate-600">นายทะเบียน / เจ้าหน้าที่รับรายงานตัว</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
