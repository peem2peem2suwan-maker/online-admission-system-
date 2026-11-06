import React, { useRef } from "react";
import OfficialEmblem from "./OfficialEmblem";
import { toThaiNumerals, formatIDCard } from "../utils/validation";
import { Printer, Download, X, Award, CheckCircle2 } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function EnrollmentSlip({ applicant, onClose }) {
  const printRef = useRef(null);

  if (!applicant) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin: [10, 15, 10, 15],
      filename: `ใบมอบตัว_${applicant.studentId || applicant.code}_${applicant.firstName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const studentFullName = applicant.fullName || `${applicant.title || ""} ${applicant.firstName || ""} ${applicant.lastName || ""}`.trim();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed-none">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Toolbar */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">
                หลักฐานยืนยันสิทธิ์และใบมอบตัวเป็นนักเรียน/นักศึกษา
              </h3>
              <p className="text-xs text-slate-400">
                รหัสนักศึกษา: <span className="text-amber-300 font-mono font-bold">{applicant.studentId || "รอออกรหัส"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
