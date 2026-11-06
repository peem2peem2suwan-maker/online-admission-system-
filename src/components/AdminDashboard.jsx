import React from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  GraduationCap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#64748b"];

export default function AdminDashboard({ applicants, onSelectFilter }) {
  // Metric counts
  const total = applicants.length;
  const pending = applicants.filter((a) => a.status === "pending").length;
  const approved = applicants.filter((a) => a.status === "approved").length;
  const enrolled = applicants.filter((a) => a.status === "enrolled").length;
  const needFix = applicants.filter((a) => a.status === "need_fix").length;

  // 1. Group by Major (สาขาวิชา)
  const majorCounts = {};
  applicants.forEach((a) => {
    const major = a.major1 || a.major || "ไม่ระบุ";
    majorCounts[major] = (majorCounts[major] || 0) + 1;
  });
  const majorChartData = Object.entries(majorCounts).map(([name, count]) => ({
    name,
    จำนวนผู้สมัคร: count,
  })).sort((a, b) => b.จำนวนผู้สมัคร - a.จำนวนผู้สมัคร);

  // 2. Group by Level (ระดับชั้น: ปวช. / ปวส. สายตรง / ปวส. ม.6)
  const levelCounts = {
    "ปวช.": 0,
    "ปวส. สายตรง": 0,
    "ปวส. ม.๖/ต่างสาขา": 0,
  };
  applicants.forEach((a) => {
    if (a.level === "pwc") levelCounts["ปวช."] += 1;
    else if (a.level === "pws_direct") levelCounts["ปวส. สายตรง"] += 1;
    else if (a.level === "pws_diff") levelCounts["ปวส. ม.๖/ต่างสาขา"] += 1;
    else levelCounts["ปวช."] += 1;
  });
  const levelChartData = Object.entries(levelCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // 3. Group by School (โรงเรียนเดิม)
  const schoolCounts = {};
  applicants.forEach((a) => {
    const school = a.previousSchool ? a.previousSchool.replace("โรงเรียน", "").trim() : "อื่นๆ";
    schoolCounts[school] = (schoolCounts[school] || 0) + 1;
  });
  const schoolChartData = Object.entries(schoolCounts)
    .map(([name, count]) => ({ name, จำนวน: count }))
    .sort((a, b) => b.จำนวน - a.จำนวน)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">ผู้สมัครทั้งหมด</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">{total}</h4>
            <span className="text-[11px] text-emerald-600 font-medium">รอบโควตา ๒๕๖๘</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">รอตรวจสอบเอกสาร</p>
            <h4 className="text-2xl font-bold text-amber-600 mt-1">{pending}</h4>
            <span className="text-[11px] text-slate-400">คิดเป็น {total > 0 ? Math.round((pending / total) * 100) : 0}%</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">ผ่านการคัดเลือก</p>
            <h4 className="text-2xl font-bold text-emerald-600 mt-1">{approved}</h4>
            <span className="text-[11px] text-emerald-600 font-medium">รอรายงานตัว</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Enrolled */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">มอบตัวแล้ว</p>
            <h4 className="text-2xl font-bold text-sky-700 mt-1">{enrolled}</h4>
            <span className="text-[11px] text-sky-600 font-medium">มีรหัสนักศึกษาแล้ว</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Need Fix */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs text-slate-500 font-medium">เอกสารไม่ครบ</p>
            <h4 className="text-2xl font-bold text-rose-600 mt-1">{needFix}</h4>
            <span className="text-[11px] text-rose-500 font-medium">แจ้งเตือนผู้สมัครแล้ว</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Modern Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart: ยอดรับสมัคร แยกตามแผนกวิชา / สาขาวิชา */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>สถิติการรับสมัคร แยกตามแผนกวิชา / สาขาวิชา</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                จำนวนผู้สมัครที่เลือกเป็นอันดับ 1 ในแต่ละสาขาวิชา (ปวช. และ ปวส.)
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
              เรียลไทม์
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={majorChartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: "#475569" }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#475569" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#38bdf8" }}
                />
                <Bar
                  dataKey="จำนวนผู้สมัคร"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                >
                  {majorChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: สัดส่วนแยกตามระดับชั้น (ปวช./ปวส.) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="mb-2 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-indigo-600" />
              <span>สัดส่วนตามระดับชั้น</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ปวช. เทียบกับ ปวส. สายตรง และต่างสาขา
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {levelChartData.map((_, index) => (
                    <Cell
                      key={`pie-${index}`}
                      fill={["#3b82f6", "#10b981", "#8b5cf6"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 text-xs">
            {levelChartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"][i % 3] }}
                  ></span>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">
                  {item.value} คน ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Feeder Schools & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 Schools */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <span>5 อันดับโรงเรียนเดิมที่มีผู้สมัครมากที่สุด</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เพื่อใช้ประโยชน์ในการวางแผนประชาสัมพันธ์และกิจกรรมแนะแนว
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {schoolChartData.map((school, idx) => {
              const pct = total > 0 ? Math.round((school.จำนวน / total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">
                      {idx + 1}. โรงเรียน{school.name}
                    </span>
                    <span className="text-blue-700">
                      {school.จำนวน} คน ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct * 2, 8)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admissions Funnel & Pipeline */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>ความคืบหน้ากระบวนการรับสมัคร (Pipeline)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              อัตราการแปลงจากผู้ยื่นใบสมัคร สู่การผ่านเกณฑ์ และการขึ้นทะเบียนมอบตัว
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800">ส่งใบสมัครในระบบแล้ว</p>
                  <p className="text-slate-500 text-[11px]">ยื่นข้อมูลครบตามแบบฟอร์ม</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-800">{total} คน</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800">เอกสารผ่านการตรวจสอบ & มีสิทธิ์</p>
                  <p className="text-slate-500 text-[11px]">ผ่านเกณฑ์โควตาผลการเรียนดี</p>
                </div>
              </div>
              <span className="text-base font-bold text-emerald-700">{approved + enrolled} คน</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-bold text-blue-900">ขึ้นทะเบียนมอบตัวสำเร็จ</p>
                  <p className="text-blue-700 text-[11px]">พร้อมเปิดภาคเรียน ๑/๒๕๖๘</p>
                </div>
              </div>
              <span className="text-base font-bold text-blue-900">{enrolled} คน</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
