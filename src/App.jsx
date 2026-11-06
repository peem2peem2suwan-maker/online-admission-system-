import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StudentRegister from "./components/StudentRegister";
import StudentStatus from "./components/StudentStatus";
import AdminDashboard from "./components/AdminDashboard";
import ApplicantTable from "./components/ApplicantTable";
import OfficialApplicationForm from "./components/OfficialApplicationForm";
import EnrollmentSlip from "./components/EnrollmentSlip";
import LineNotificationModal from "./components/LineNotificationModal";
import {
  getStoredApplicants,
  saveApplicants,
  INITIAL_APPLICANTS,
} from "./data/mockApplicants";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState("register"); // 'register' | 'status' | 'admin'
  const [adminView, setAdminView] = useState("dashboard"); // 'dashboard' | 'table'

  // Modals
  const [officialFormApp, setOfficialFormApp] = useState(null);
  const [enrollmentSlipApp, setEnrollmentSlipApp] = useState(null);
  const [lineModalApp, setLineModalApp] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    const data = getStoredApplicants();
    setApplicants(data);
  }, []);

  // Update applicants state & persist to localStorage
  const updateApplicantsState = (newApplicants) => {
    setApplicants(newApplicants);
    saveApplicants(newApplicants);
  };

  const handleAddApplicant = (newApplicant) => {
    const updated = [newApplicant, ...applicants];
    updateApplicantsState(updated);
  };

  const handleUpdateApplicant = (updatedApplicant) => {
    const updated = applicants.map((app) =>
      app.id === updatedApplicant.id ? updatedApplicant : app
    );
    updateApplicantsState(updated);
  };

  const handleDeleteApplicant = (applicantId) => {
    const updated = applicants.filter((app) => app.id !== applicantId);
    updateApplicantsState(updated);
  };

  const handleResetData = () => {
    if (window.confirm("คุณต้องการรีเซ็ตข้อมูลผู้สมัครกลับเป็นค่าเริ่มต้นตัวอย่างหรือไม่?")) {
      updateApplicantsState(INITIAL_APPLICANTS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        applicantCount={applicants.length}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Tab 1: Student Register Form */}
        {activeTab === "register" && (
          <StudentRegister
            onAddApplicant={handleAddApplicant}
            onViewOfficialForm={(app) => setOfficialFormApp(app)}
          />
        )}

        {/* Tab 2: Check Status Portal */}
        {activeTab === "status" && (
          <StudentStatus
            applicants={applicants}
            onViewOfficialForm={(app) => setOfficialFormApp(app)}
            onViewEnrollmentSlip={(app) => setEnrollmentSlipApp(app)}
            onUpdateApplicant={handleUpdateApplicant}
          />
        )}

        {/* Tab 3: Admin Portal */}
        {activeTab === "admin" && (
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
            
            {/* Admin Header with View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 shadow-md">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-amber-300 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ระบบบริหารจัดการงานรับสมัครและทะเบียนนักเรียน (Admin Portal)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  แดชบอร์ดสรุปสถิติ & จัดการข้อมูลผู้สมัคร
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ • ปีการศึกษา ๒๕๖๘
                </p>
              </div>

              {/* Sub-tabs: Dashboard vs Table */}
              <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700 self-start sm:self-center">
                <button
                  onClick={() => setAdminView("dashboard")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    adminView === "dashboard"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>กราฟและสถิติ</span>
                </button>
                <button
                  onClick={() => setAdminView("table")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    adminView === "table"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>ตารางรายชื่อผู้สมัคร ({applicants.length})</span>
                </button>
              </div>
            </div>

            {/* Admin Subview Render */}
            {adminView === "dashboard" ? (
              <AdminDashboard
                applicants={applicants}
                onSelectFilter={() => setAdminView("table")}
              />
            ) : (
              <ApplicantTable
                applicants={applicants}
                onUpdateApplicant={handleUpdateApplicant}
                onDeleteApplicant={handleDeleteApplicant}
                onViewOfficialForm={(app) => setOfficialFormApp(app)}
                onViewEnrollmentSlip={(app) => setEnrollmentSlipApp(app)}
                onTriggerNotification={(app) => setLineModalApp(app)}
              />
            )}

          </div>
        )}

      </main>

      {/* Official Application Form PDF Modal */}
      {officialFormApp && (
        <OfficialApplicationForm
          applicant={officialFormApp}
          onClose={() => setOfficialFormApp(null)}
        />
      )}

      {/* Enrollment Slip PDF Modal */}
      {enrollmentSlipApp && (
        <EnrollmentSlip
          applicant={enrollmentSlipApp}
          onClose={() => setEnrollmentSlipApp(null)}
        />
      )}

      {/* LINE Notification Simulator Modal */}
      {lineModalApp && (
        <LineNotificationModal
          applicant={lineModalApp}
          onClose={() => setLineModalApp(null)}
        />
      )}

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ • สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)
          </p>
          <p>
            งานรับสมัครและแนะแนวการศึกษา โทร. 036-271-234 | ระบบรับสมัครนักเรียน นักศึกษา ออนไลน์ (โควตา)
          </p>
          <p className="text-[11px] text-slate-400">
            รองรับการพิมพ์ใบสมัคร PDF มาตรฐานทางการ และส่งออกข้อมูลระบบ ศธ.02
          </p>
        </div>
      </footer>
    </div>
  );
}
