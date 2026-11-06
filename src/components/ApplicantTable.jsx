import React, { useState } from "react";
import { formatIDCard } from "../utils/validation";
import { exportApplicantsToExcel } from "../utils/exportExcel";
import {
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Edit,
  Eye,
  Trash2,
  BellRing,
  Check,
  UserCheck,
  X,
  ExternalLink,
} from "lucide-react";

export default function ApplicantTable({
  applicants,
  onUpdateApplicant,
  onDeleteApplicant,
  onViewOfficialForm,
  onViewEnrollmentSlip,
  onTriggerNotification,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null); // For Review Modal
  const [enrollModalApp, setEnrollModalApp] = useState(null); // For Enrollment Modal

  // Filtering logic
  const filteredApplicants = applicants.filter((app) => {
    // Search
    const cleanSearch = searchTerm.toLowerCase();
    const fullName = `${app.title || ""} ${app.firstName || ""} ${app.lastName || ""}`.toLowerCase();
    const idCard = (app.idCard || "").toLowerCase();
    const school = (app.previousSchool || "").toLowerCase();
    const code = (app.code || "").toLowerCase();
    const matchesSearch =
      fullName.includes(cleanSearch) ||
      idCard.includes(cleanSearch) ||
      school.includes(cleanSearch) ||
      code.includes(cleanSearch);

    // Level Filter
    const matchesLevel = levelFilter === "all" || app.level === levelFilter;

    // Status Filter
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          text: "ผ่านการคัดเลือก",
        };
      case "enrolled":
        return {
          bg: "bg-sky-50 text-sky-700 border-sky-200",
          dot: "bg-sky-600",
          text: "มอบตัวสำเร็จ",
        };
      case "need_fix":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500",
          text: "เอกสารไม่ครบ",
        };
      case "pending":
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          text: "รอตรวจสอบ",
        };
    }
  };

  // Generate random / auto student ID
  const generateStudentId = (app) => {
    const yearPrefix = "68";
    const levelCode = app.level === "pwc" ? "201" : "301";
    const randomSeq = String(Math.floor(1000 + Math.random() * 9000));
    return `${yearPrefix}${levelCode}${randomSeq}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Top Filter and Search Bar */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อ, เลขบัตร ปชช., รหัสใบสมัคร, โรงเรียนเดิม..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Filters and Export buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="all">ทุกระดับชั้น</option>
            <option value="pwc">ปวช.</option>
            <option value="pws_direct">ปวส. (สายตรง)</option>
            <option value="pws_diff">ปวส. (ต่างสาขา)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 outline-none"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="pending">รอตรวจสอบ</option>
            <option value="need_fix">เอกสารไม่ครบ</option>
            <option value="approved">ผ่านการคัดเลือก</option>
            <option value="enrolled">มอบตัวแล้ว</option>
          </select>

          {/* Export to Excel (ศธ.02) */}
          <button
            onClick={() => exportApplicantsToExcel(filteredApplicants)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            title="ส่งออกรายชื่อผู้สมัครเป็นไฟล์ Excel ในรูปแบบมาตรฐาน ศธ.02"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก ศธ.02 (Excel)</span>
          </button>
        </div>
      </div>

      {/* Table Header Summary */}
      <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          พบข้อมูลผู้สมัคร <span className="font-bold text-slate-800">{filteredApplicants.length}</span> รายการ
          {filteredApplicants.length !== applicants.length && ` (จากทั้งหมด ${applicants.length} รายการ)`}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> รอตรวจ: {applicants.filter(a => a.status === "pending").length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ผ่านแล้ว: {applicants.filter(a => a.status === "approved").length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span> มอบตัว: {applicants.filter(a => a.status === "enrolled").length}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-3">ผู้สมัคร & รหัส</th>
              <th className="py-3 px-3">ระดับชั้น & สาขาวิชา</th>
              <th className="py-3 px-3">ข้อมูลเดิม / GPAX</th>
              <th className="py-3 px-3">สถานะ</th>
              <th className="py-3 px-4 text-center">จัดการ & รายงาน PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((app, index) => {
                const badge = getStatusBadge(app.status);
                const fullName = app.fullName || `${app.title || ""} ${app.firstName} ${app.lastName}`;
                return (
                  <tr
                    key={app.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3 px-4 text-center font-mono text-slate-400 text-xs">
                      {index + 1}
                    </td>

                    {/* Applicant & Code */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg border border-slate-300 overflow-hidden bg-slate-100 shrink-0 shadow-2xs">
                          {app.photo ? (
                            <img
                              src={app.photo}
                              alt="รูปถ่าย"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              รูป ๑"
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {fullName}
                          </p>
                          <p className="font-mono text-xs text-slate-500">
                            {formatIDCard(app.idCard)}
                          </p>
                          <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono text-blue-700 font-semibold mt-0.5">
                            {app.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Level & Majors */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">
                        {app.major1 || app.major}
                      </p>
                      <p className="text-xs text-slate-500">
                        {app.levelName || app.level}
                      </p>
                      {app.level === "pwc" && app.major2 && (
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          อันดับ 2: {app.major2}
                        </p>
                      )}
                    </td>

                    {/* School & GPAX */}
                    <td className="py-3 px-3">
                      <p className="text-slate-700 truncate max-w-[200px]" title={app.previousSchool}>
                        {app.previousSchool || "-"}
                      </p>
                      <p className="text-xs text-slate-500">
                        GPAX: <span className="font-bold text-slate-800">{app.gpax || "-"}</span> • จ. {app.schoolProvince || app.province}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        <span>{badge.text}</span>
                      </span>
                      {app.studentId && (
                        <p className="text-[11px] font-mono font-bold text-blue-800 mt-1">
                          ID: {app.studentId}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* 1. Print Official Form PDF */}
                        <button
                          onClick={() => onViewOfficialForm(app)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                          title="ดูและพิมพ์รายงานใบสมัคร (PDF) ตามแบบฟอร์มทางการ"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ใบสมัคร (PDF)</span>
                        </button>

                        {/* 2. Review and change status */}
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="ตรวจสอบเอกสารและปรับเปลี่ยนสถานะ"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* 3. Enrollment Button (if approved) */}
                        {app.status === "approved" && (
                          <button
                            onClick={() => setEnrollModalApp(app)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
                            title="บันทึกข้อมูลการมอบตัว & ออกรหัสนักศึกษา"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>มอบตัว</span>
                          </button>
                        )}

                        {/* 4. Enrollment Slip (if already enrolled) */}
                        {app.status === "enrolled" && (
                          <button
                            onClick={() => onViewEnrollmentSlip(app)}
                            className="p-1.5 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 rounded-lg transition-colors cursor-pointer"
                            title="พิมพ์หลักฐานการมอบตัว"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}

                        {/* 5. Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(`ต้องการลบใบสมัครของ ${fullName} หรือไม่?`)) {
                              onDeleteApplicant(app.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">
                      ไม่พบข้อมูลผู้สมัครที่ตรงกับเงื่อนไข
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      ลองเปลี่ยนคำค้นหาหรือตัวกรองระดับชั้น/สถานะ
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Review & Change Status */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  ตรวจสอบและปรับสถานะผู้สมัคร
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedApplicant.code} • {selectedApplicant.fullName || `${selectedApplicant.firstName} ${selectedApplicant.lastName}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Form */}
            <div className="py-4 space-y-4 text-xs sm:text-sm">
              {/* Applicant Card Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                  {selectedApplicant.photo ? (
                    <img
                      src={selectedApplicant.photo}
                      alt="รูปถ่าย"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                      ไม่มีรูป
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-slate-700">
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedApplicant.title} {selectedApplicant.firstName} {selectedApplicant.lastName}
                  </p>
                  <p>เลขบัตร ปชช.: <span className="font-mono">{formatIDCard(selectedApplicant.idCard)}</span></p>
                  <p>ระดับที่สมัคร: <span className="font-semibold text-blue-700">{selectedApplicant.levelName}</span> ({selectedApplicant.major1})</p>
                  <p>เกรดเฉลี่ย (GPAX): <span className="font-bold">{selectedApplicant.gpax}</span> โรงเรียน: {selectedApplicant.previousSchool}</p>
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  เปลี่ยนสถานะการพิจารณา:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "pending", label: "รอตรวจสอบ", color: "hover:border-amber-400" },
                    { id: "need_fix", label: "เอกสารไม่ครบ", color: "hover:border-rose-400" },
                    { id: "approved", label: "ผ่านการคัดเลือก", color: "hover:border-emerald-400" },
                    { id: "enrolled", label: "มอบตัวแล้ว", color: "hover:border-sky-400" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setSelectedApplicant({ ...selectedApplicant, status: s.id })
                      }
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedApplicant.status === s.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : `bg-white text-slate-700 border-slate-200 ${s.color}`
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Officer Note */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  หมายเหตุ / ข้อความแจ้งผู้สมัคร:
                </label>
                <textarea
                  rows={3}
                  value={selectedApplicant.officerNote || ""}
                  onChange={(e) =>
                    setSelectedApplicant({
                      ...selectedApplicant,
                      officerNote: e.target.value,
                    })
                  }
                  placeholder="เช่น เอกสาร ปพ.1 ชัดเจน ผ่านเกณฑ์ หรือ ระบุเอกสารที่ต้องแนบใหม่..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Student ID (Auto generator) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-800">
                    รหัสประจำตัวนักเรียน/นักศึกษา:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = generateStudentId(selectedApplicant);
                      setSelectedApplicant({
                        ...selectedApplicant,
                        studentId: newId,
                      });
                    }}
                    className="text-xs text-blue-600 hover:underline cursor-pointer font-medium"
                  >
                    + สุ่มสร้างรหัสอัตโนมัติ
                  </button>
                </div>
                <input
                  type="text"
                  value={selectedApplicant.studentId || ""}
                  onChange={(e) =>
                    setSelectedApplicant({
                      ...selectedApplicant,
                      studentId: e.target.value,
                    })
                  }
                  placeholder="เช่น 6820101001"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onTriggerNotification(selectedApplicant);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                title="จำลองส่งการแจ้งเตือนไปยัง LINE ของผู้สมัคร"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>จำลองแจ้งเตือน LINE</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateApplicant(selectedApplicant);
                    setSelectedApplicant(null);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Enrollment & Registration Confirmation */}
      {enrollModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                บันทึกการมอบตัวนักเรียน นักศึกษาใหม่
              </h3>
              <p className="text-xs text-slate-500">
                {enrollModalApp.fullName || `${enrollModalApp.firstName} ${enrollModalApp.lastName}`} ({enrollModalApp.levelName})
              </p>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  กำหนดรหัสประจำตัวนักเรียน/นักศึกษา
                </label>
                <input
                  type="text"
                  value={enrollModalApp.studentId || generateStudentId(enrollModalApp)}
                  onChange={(e) =>
                    setEnrollModalApp({ ...enrollModalApp, studentId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm outline-none font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อผู้ปกครองที่มามอบตัว
                </label>
                <input
                  type="text"
                  value={enrollModalApp.guardianName || enrollModalApp.fatherName || enrollModalApp.motherName || ""}
                  onChange={(e) =>
                    setEnrollModalApp({ ...enrollModalApp, guardianName: e.target.value })
                  }
                  placeholder="เช่น นายสมศักดิ์ สถิตมั่นคง"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ความสัมพันธ์
                  </label>
                  <select
                    value={enrollModalApp.guardianRelation || "บิดา"}
                    onChange={(e) =>
                      setEnrollModalApp({ ...enrollModalApp, guardianRelation: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                  >
                    <option value="บิดา">บิดา</option>
                    <option value="มารดา">มารดา</option>
                    <option value="ผู้ปกครองตามกฎหมาย">ผู้ปกครองตามกฎหมาย</option>
                    <option value="ญาติ">ญาติ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    วันที่มอบตัว
                  </label>
                  <input
                    type="date"
                    value={enrollModalApp.enrollmentDate || new Date().toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setEnrollModalApp({ ...enrollModalApp, enrollmentDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  อาจารย์ผู้รับรายงานตัว / พยาน
                </label>
                <input
                  type="text"
                  value={enrollModalApp.witnessName || "อ.ประดิษฐ์ มีสุข"}
                  onChange={(e) =>
                    setEnrollModalApp({ ...enrollModalApp, witnessName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEnrollModalApp(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = {
                    ...enrollModalApp,
                    status: "enrolled",
                    studentId: enrollModalApp.studentId || generateStudentId(enrollModalApp),
                    enrollmentDate: enrollModalApp.enrollmentDate || new Date().toISOString().slice(0, 10),
                    guardianName: enrollModalApp.guardianName || enrollModalApp.fatherName || "ผู้ปกครอง",
                    witnessName: enrollModalApp.witnessName || "คณะกรรมการรับรายงานตัว",
                  };
                  onUpdateApplicant(updated);
                  setEnrollModalApp(null);
                  onViewEnrollmentSlip(updated);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                ยืนยันการมอบตัว & พิมพ์ใบมอบตัว
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
