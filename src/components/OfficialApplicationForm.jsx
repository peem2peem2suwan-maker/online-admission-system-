import React, { useRef } from "react";
import OfficialEmblem from "./OfficialEmblem";
import { toThaiNumerals } from "../utils/validation";
import { Printer, Download, X, CheckSquare, Square } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function OfficialApplicationForm({ applicant, onClose }) {
  const printRef = useRef(null);

  if (!applicant) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin: [10, 15, 10, 15],
      filename: `ใบสมัคร_${applicant.fullName || (applicant.firstName + "_" + applicant.lastName)}_${applicant.code || "โควตา"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // Level checkboxes check logic
  const isPwsDirect = applicant.level === "pws_direct";
  const isPwsDiff = applicant.level === "pws_diff";
  const isPwc = applicant.level === "pwc";

  // Parse or format applicant name
  const studentFullName = applicant.fullName || `${applicant.title || ""} ${applicant.firstName || ""} ${applicant.lastName || ""}`.trim();

  // Academic year in Thai numerals
  const academicYearThai = toThaiNumerals(applicant.academicYear || "2568");

  // Registration Date
  const applyDate = applicant.createdAt ? new Date(applicant.createdAt) : new Date();
  const applyDayThai = toThaiNumerals(applyDate.getDate());
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const applyMonthThai = thaiMonths[applyDate.getMonth()];
  const applyYearThai = toThaiNumerals(applyDate.getFullYear() + 543);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed-none">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">
                ตัวอย่างรายงานใบสมัคร (แบบฟอร์มทางการ)
              </h3>
              <p className="text-xs text-slate-400">
                รหัสใบสมัคร: <span className="font-mono text-amber-300 font-bold">{applicant.code || "QUOTA-68"}</span> • {studentFullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
              title="พิมพ์เอกสารออกเครื่องพิมพ์หรือบันทึกเป็น PDF ของบราวเซอร์"
            >
              <Printer className="w-4 h-4" />
              <span>สั่งพิมพ์ (Print)</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
              title="สร้างและดาวน์โหลดไฟล์ PDF โดยตรง"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document (A4 Ratio) */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div
            ref={printRef}
            className="w-[210mm] min-h-[297mm] bg-white text-black p-[15mm_18mm_15mm_18mm] shadow-lg print:shadow-none print:w-full print:min-h-0 print:p-0 font-sarabun text-[15px] leading-[1.65] relative border border-slate-200 print:border-none box-border"
          >
            {/* Header Layout */}
            <div className="relative mb-6 pb-2 min-h-[120px]">
              {/* Top Left Logo (สอศ.) */}
              <div className="absolute top-0 left-0">
                <OfficialEmblem className="w-24 h-24" />
              </div>

              {/* Top Right Photo Box (ขนาด 1 นิ้ว) */}
              <div className="absolute top-0 right-0 w-[30mm] h-[38mm] border border-black flex flex-col items-center justify-center text-center p-1 bg-white overflow-hidden">
                {applicant.photo ? (
                  <img
                    src={applicant.photo}
                    alt="รูปถ่ายผู้สมัคร"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[13px] leading-tight text-slate-700 flex flex-col items-center justify-center h-full">
                    <span>รูปถ่าย</span>
                    <span className="mt-1">ขนาด ๑ นิ้ว</span>
                  </div>
                )}
              </div>

              {/* Center Title */}
              <div className="text-center pt-2 px-28">
                <h1 className="text-[17px] font-bold text-black tracking-wide">
                  ใบสมัครเข้ารับคัดเลือกเพื่อศึกษาต่อเป็นกรณีพิเศษ (โควตา)
                </h1>
                <h2 className="text-[16px] font-bold text-black mt-1">
                  วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ ประจำปีการศึกษา {academicYearThai}
                </h2>
              </div>
            </div>

            {/* Level Checkboxes (3 options matching official sheet) */}
            <div className="flex flex-col gap-1.5 ml-48 mb-5 text-[15px]">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border border-black text-center leading-[14px] text-xs font-bold">
                  {isPwsDirect ? "✓" : ""}
                </span>
                <span>ระดับ ปวส. ( สายตรง )</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border border-black text-center leading-[14px] text-xs font-bold">
                  {isPwsDiff ? "✓" : ""}
                </span>
                <span>ระดับ ปวส. ( ม.๖/ปวช. ต่างสาขา )</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border border-black text-center leading-[14px] text-xs font-bold">
                  {isPwc ? "✓" : ""}
                </span>
                <span>ระดับ ปวช.</span>
              </div>
            </div>

            {/* Application Data Fields */}
            <div className="space-y-2 text-[15px]">
              {/* ข้อ ๑ */}
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="font-semibold">๑. ชื่อ-นามสกุล</span>
                <span className="border-b border-dotted border-black px-2 font-medium min-w-[240px] text-slate-900">
                  {studentFullName || "..........................................................."}
                </span>
                <span className="font-semibold ml-2">เกิดวันที่</span>
                <span className="border-b border-dotted border-black px-2 min-w-[45px] text-center font-medium">
                  {toThaiNumerals(applicant.birthDay) || "...."}
                </span>
                <span className="font-semibold">เดือน</span>
                <span className="border-b border-dotted border-black px-2 min-w-[90px] text-center font-medium">
                  {applicant.birthMonth || "...................."}
                </span>
                <span className="font-semibold">พ.ศ.</span>
                <span className="border-b border-dotted border-black px-2 min-w-[60px] text-center font-medium">
                  {toThaiNumerals(applicant.birthYear) || "........"}
                </span>
              </div>

              {/* ข้อ ๒ */}
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="font-semibold">๒. ชื่อ-สกุลบิดา</span>
                <span className="border-b border-dotted border-black px-2 font-medium min-w-[280px]">
                  {applicant.fatherName || "..........................................................."}
                </span>
                <span className="font-semibold ml-2">อายุ</span>
                <span className="border-b border-dotted border-black px-2 min-w-[45px] text-center font-medium">
                  {toThaiNumerals(applicant.fatherAge) || "...."}
                </span>
                <span>ปี</span>
                <span className="font-semibold ml-2">อาชีพ</span>
                <span className="border-b border-dotted border-black px-2 min-w-[170px] font-medium flex-1">
                  {applicant.fatherJob || "...................................."}
                </span>
              </div>

              {/* ข้อ ๓ */}
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="font-semibold">๓. ชื่อ-สกุลมารดา</span>
                <span className="border-b border-dotted border-black px-2 font-medium min-w-[270px]">
                  {applicant.motherName || "..........................................................."}
                </span>
                <span className="font-semibold ml-2">อายุ</span>
                <span className="border-b border-dotted border-black px-2 min-w-[45px] text-center font-medium">
                  {toThaiNumerals(applicant.motherAge) || "...."}
                </span>
                <span>ปี</span>
                <span className="font-semibold ml-2">อาชีพ</span>
                <span className="border-b border-dotted border-black px-2 min-w-[170px] font-medium flex-1">
                  {applicant.motherJob || "...................................."}
                </span>
              </div>

              {/* ข้อ ๔ */}
              <div>
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="font-semibold">๔. ที่อยู่ปัจจุบันที่สามารถติดต่อได้</span>
                  <span className="ml-1">บ้านเลขที่</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[70px] text-center font-medium">
                    {toThaiNumerals(applicant.addressNo) || ".........."}
                  </span>
                  <span>หมู่</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[45px] text-center font-medium">
                    {toThaiNumerals(applicant.moo) || "...."}
                  </span>
                  <span>ซอย</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[110px] text-center font-medium">
                    {applicant.soi || "................"}
                  </span>
                  <span>ถนน</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[120px] text-center font-medium flex-1">
                    {applicant.road || "................"}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-1 mt-1 pl-4">
                  <span>ตำบล</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[130px] text-center font-medium">
                    {applicant.subdistrict || "...................."}
                  </span>
                  <span>อำเภอ</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[130px] text-center font-medium">
                    {applicant.district || "...................."}
                  </span>
                  <span>จังหวัด</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[140px] text-center font-medium flex-1">
                    {applicant.province || "...................."}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-1 mt-1 pl-4">
                  <span>รหัสไปรษณีย์</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[90px] text-center font-medium">
                    {toThaiNumerals(applicant.zipcode) || ".........."}
                  </span>
                  <span className="ml-3">หมายเลขโทรศัพท์</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[200px] text-center font-medium flex-1">
                    {toThaiNumerals(applicant.phone) || "...................................."}
                  </span>
                </div>
              </div>

              {/* ข้อ ๕ */}
              <div className="pt-1">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="font-semibold">๕. กำลังศึกษาอยู่ในระดับชั้น</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[140px] text-center font-medium">
                    {applicant.currentGradLevel || "........................"}
                  </span>
                  <span className="font-semibold ml-2">โรงเรียน</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[210px] text-center font-medium flex-1">
                    {applicant.previousSchool || "...................................................."}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-1 mt-1 pl-4">
                  <span>ตั้งอยู่เลขที่</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[65px] text-center font-medium">
                    {toThaiNumerals(applicant.schoolAddressNo) || ".........."}
                  </span>
                  <span>ตำบล</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[110px] text-center font-medium">
                    {applicant.schoolSubdistrict || "................"}
                  </span>
                  <span>อำเภอ</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[110px] text-center font-medium">
                    {applicant.schoolDistrict || "................"}
                  </span>
                  <span>จังหวัด</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[120px] text-center font-medium flex-1">
                    {applicant.schoolProvince || "................"}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-1 mt-1 pl-4">
                  <span>ผลการเรียนเฉลี่ยสะสม</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[80px] text-center font-bold">
                    {toThaiNumerals(applicant.gpax) || "........"}
                  </span>
                  <span className="ml-3">สาขาวิชา</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[230px] font-medium flex-1">
                    {applicant.previousMajor || "...................................................."}
                  </span>
                </div>
              </div>

              {/* ข้อ ๖ */}
              <div className="pt-1 space-y-1">
                <div className="flex items-baseline">
                  <span className="font-semibold">๖. ต้องการสมัครเข้าเรียน</span>
                </div>
                
                {/* For PWS */}
                <div className="flex items-baseline pl-12">
                  <span className="w-40 font-medium">ระดับ ปวส. สาขาวิชา</span>
                  <span className="border-b border-dotted border-black px-3 font-semibold flex-1">
                    {(isPwsDirect || isPwsDiff) ? (applicant.major1 || applicant.major) : "...................................................................................."}
                  </span>
                </div>

                {/* For PWC choice 1 & 2 */}
                <div className="flex items-baseline pl-12">
                  <span className="w-52 font-medium">ระดับ ปวช. สาขาวิชาลำดับที่ ๑.</span>
                  <span className="border-b border-dotted border-black px-3 font-semibold flex-1">
                    {isPwc ? (applicant.major1 || applicant.major) : "................................................................................"}
                  </span>
                </div>
                <div className="flex items-baseline pl-24">
                  <span className="w-40 font-medium">สาขาวิชาลำดับที่ ๒.</span>
                  <span className="border-b border-dotted border-black px-3 font-medium flex-1">
                    {isPwc ? (applicant.major2 || "-") : "................................................................................"}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist of required documents */}
            <div className="mt-6 pt-2 border-t border-slate-300">
              <p className="font-semibold mb-1">หลักฐานประกอบการสมัคร</p>
              <ul className="space-y-1 pl-6 list-none text-[14px]">
                <li className="flex items-baseline gap-2">
                  <span>๑.</span>
                  <span>เอกสารแสดงผลการเรียนเฉลี่ยสะสม ๕ ภาคเรียน จำนวน ๑ ฉบับ</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span>๒.</span>
                  <span>สำเนาบัตรประชาชน / สำเนาทะเบียนบ้าน จำนวน ๑ ฉบับ</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span>๓.</span>
                  <span>สำเนาเกียรติบัตร/ใบรับรองความสามารถพิเศษ/ใบประกาศ (ถ้ามี)</span>
                </li>
              </ul>
            </div>

            {/* Signature Section at bottom */}
            <div className="mt-10 mr-12 flex flex-col items-end">
              <div className="w-72 text-center space-y-1.5">
                <div className="flex items-baseline justify-center">
                  <span>ลงชื่อ</span>
                  <span className="border-b border-dotted border-black px-3 font-medium min-w-[170px] text-center">
                    {studentFullName}
                  </span>
                  <span>ผู้สมัคร</span>
                </div>
                <div className="text-center text-slate-800">
                  ( <span className="px-2">{studentFullName || "..................................................."}</span> )
                </div>
                <div className="flex items-baseline justify-center text-[14px]">
                  <span>วันที่</span>
                  <span className="border-b border-dotted border-black px-1.5 min-w-[35px] text-center">
                    {applyDayThai}
                  </span>
                  <span>เดือน</span>
                  <span className="border-b border-dotted border-black px-2 min-w-[80px] text-center">
                    {applyMonthThai}
                  </span>
                  <span>พ.ศ.</span>
                  <span className="border-b border-dotted border-black px-1.5 min-w-[45px] text-center">
                    {applyYearThai}
                  </span>
                </div>
              </div>
            </div>

            {/* Document footer meta note */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <div>
                <span>ระบบรับสมัครนักเรียนนักศึกษาออนไลน์ • วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์</span>
              </div>
              <div>
                <span>รหัสตรวจสอบ: <span className="font-mono font-bold text-slate-700">{applicant.code || "REG-ONLINE"}</span></span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
