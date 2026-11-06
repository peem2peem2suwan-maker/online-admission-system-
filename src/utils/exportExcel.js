import * as XLSX from "xlsx";

export function exportApplicantsToExcel(applicants, filename = "รายชื่อผู้สมัคร_ศธ02") {
  if (!applicants || applicants.length === 0) {
    alert("ไม่มีข้อมูลสำหรับส่งออก");
    return;
  }

  // Format data for standard Vocational Registration format (ศธ.02)
  const rows = applicants.map((app, index) => ({
    "ลำดับที่": index + 1,
    "เลขที่ใบสมัคร": app.code || `Q68-${String(index + 1).padStart(4, "0")}`,
    "เลขประจำตัวประชาชน": app.idCard || "",
    "คำนำหน้า": app.title || "",
    "ชื่อ": app.firstName || "",
    "นามสกุล": app.lastName || "",
    "ระดับชั้น": app.levelName || app.level || "",
    "สาขาวิชาที่ 1": app.major1 || app.major || "",
    "สาขาวิชาที่ 2": app.major2 || "-",
    "เกรดเฉลี่ย (GPAX)": app.gpax || "",
    "โรงเรียนเดิม": app.previousSchool || "",
    "จังหวัดโรงเรียนเดิม": app.schoolProvince || "",
    "เบอร์โทรศัพท์": app.phone || "",
    "สถานะใบสมัคร": getStatusLabel(app.status),
    "รหัสนักศึกษา (ถ้ามอบตัว)": app.studentId || "-",
    "วันที่บันทึกข้อมูล": app.createdAt ? new Date(app.createdAt).toLocaleDateString("th-TH") : "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  const colWidths = [
    { wch: 8 },  // ลำดับ
    { wch: 16 }, // เลขที่ใบสมัคร
    { wch: 18 }, // เลขบัตร ปชช.
    { wch: 10 }, // คำนำหน้า
    { wch: 15 }, // ชื่อ
    { wch: 18 }, // นามสกุล
    { wch: 22 }, // ระดับชั้น
    { wch: 22 }, // สาขาวิชา 1
    { wch: 20 }, // สาขาวิชา 2
    { wch: 12 }, // GPAX
    { wch: 25 }, // โรงเรียนเดิม
    { wch: 15 }, // จังหวัด
    { wch: 14 }, // เบอร์โทร
    { wch: 16 }, // สถานะ
    { wch: 16 }, // รหัสนักศึกษา
    { wch: 14 }, // วันที่บันทึก
  ];
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ข้อมูลผู้สมัคร");

  // Generate file and trigger download
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function getStatusLabel(status) {
  switch (status) {
    case "pending":
      return "รอตรวจสอบ";
    case "need_fix":
      return "เอกสารไม่ครบถ้วน";
    case "approved":
      return "ผ่านการคัดเลือก";
    case "enrolled":
      return "มอบตัวแล้ว";
    default:
      return status || "รอตรวจสอบ";
  }
}
