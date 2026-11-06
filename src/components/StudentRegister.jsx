import React, { useState } from "react";
import {
  LEVELS,
  MAJORS_PWC,
  MAJORS_PWS,
  THAI_MONTHS,
  PROVINCES_POPULAR,
  ACADEMIC_YEAR,
} from "../data/majors";
import { validateThaiID, validatePhone } from "../utils/validation";
import confetti from "canvas-confetti";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Home,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Camera,
  FileCheck,
} from "lucide-react";

export default function StudentRegister({ onAddApplicant, onViewOfficialForm }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedApplicant, setSubmittedApplicant] = useState(null);

  // Form State initialized with defaults
  const [formData, setFormData] = useState({
    academicYear: ACADEMIC_YEAR,
    level: "pwc", // pwc, pws_direct, pws_diff
    levelName: "ระดับ ปวช.",
    major1: "ช่างยนต์",
    major2: "ช่างกลโรงงาน",
    title: "นาย",
    firstName: "",
    lastName: "",
    idCard: "",
    birthDay: "1",
    birthMonth: "มกราคม",
    birthYear: "2552",
    fatherName: "",
    fatherAge: "",
    fatherJob: "",
    motherName: "",
    motherAge: "",
    motherJob: "",
    addressNo: "",
    moo: "",
    soi: "",
    road: "",
    subdistrict: "",
    district: "",
    province: "สระบุรี",
    zipcode: "",
    phone: "",
    currentGradLevel: "มัธยมศึกษาปีที่ 3",
    previousSchool: "",
    schoolAddressNo: "",
    schoolSubdistrict: "",
    schoolDistrict: "",
    schoolProvince: "สระบุรี",
    gpax: "",
    previousMajor: "มัธยมศึกษาตอนต้น",
    photo: null,
    photoFileName: "",
    transcriptDoc: false,
    transcriptFileName: "",
    idCardCopyDoc: false,
    idCardCopyFileName: "",
    certDoc: false,
    certFileName: "",
  });

  const [errors, setErrors] = useState({});

  const availableMajors = formData.level === "pwc" ? MAJORS_PWC : MAJORS_PWS;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLevelChange = (levelId) => {
    const levelObj = LEVELS.find((l) => l.id === levelId);
    const majors = levelId === "pwc" ? MAJORS_PWC : MAJORS_PWS;
    setFormData((prev) => ({
      ...prev,
      level: levelId,
      levelName: levelObj ? levelObj.name : "ระดับ ปวช.",
      major1: majors[0]?.name || "",
      major2: majors[1]?.name || "",
      currentGradLevel: levelId === "pwc" ? "มัธยมศึกษาปีที่ 3" : "ประกาศนียบัตรวิชาชีพ (ปวช.3)",
      previousMajor: levelId === "pwc" ? "มัธยมศึกษาตอนต้น" : "ช่างอุตสาหกรรม",
    }));
  };

  // Image Upload handler for 1-inch photo
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ (JPG, PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์รูปถ่ายต้องไม่เกิน 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        photo: event.target.result,
        photoFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Mock document attachments handler
  const handleDocUpload = (docField, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("ขนาดไฟล์เอกสารต้องไม่เกิน 10 MB");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [`${docField}Doc`]: true,
      [`${docField}FileName`]: file.name,
    }));
  };

  // Step Validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.major1) newErrors.major1 = "กรุณาเลือกสาขาวิชาลำดับที่ 1";
      if (formData.level === "pwc" && !formData.major2) {
        newErrors.major2 = "กรุณาเลือกสาขาวิชาลำดับที่ 2";
      }
    }

    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อ";
      if (!formData.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";

      // Validate ID Card
      const idVal = validateThaiID(formData.idCard);
      if (!idVal.valid) {
        newErrors.idCard = idVal.message;
      }

      if (!formData.fatherName.trim()) newErrors.fatherName = "กรุณากรอกชื่อ-สกุลบิดา";
      if (!formData.fatherAge) newErrors.fatherAge = "กรุณากรอกอายุบิดา";
      if (!formData.fatherJob.trim()) newErrors.fatherJob = "กรุณากรอกอาชีพบิดา";

      if (!formData.motherName.trim()) newErrors.motherName = "กรุณากรอกชื่อ-สกุลมารดา";
      if (!formData.motherAge) newErrors.motherAge = "กรุณากรอกอายุมารดา";
      if (!formData.motherJob.trim()) newErrors.motherJob = "กรุณากรอกอาชีพมารดา";
    }

    if (step === 3) {
      if (!formData.addressNo.trim()) newErrors.addressNo = "กรุณากรอกบ้านเลขที่";
      if (!formData.subdistrict.trim()) newErrors.subdistrict = "กรุณากรอกตำบล";
      if (!formData.district.trim()) newErrors.district = "กรุณากรอกอำเภอ";
      if (!formData.province.trim()) newErrors.province = "กรุณาเลือกจังหวัด";
      if (!formData.zipcode.trim()) newErrors.zipcode = "กรุณากรอกรหัสไปรษณีย์";

      // Validate Phone
      const phoneVal = validatePhone(formData.phone);
      if (!phoneVal.valid) {
        newErrors.phone = phoneVal.message;
      }

      if (!formData.previousSchool.trim()) newErrors.previousSchool = "กรุณากรอกชื่อโรงเรียนเดิม";
      if (!formData.gpax || isNaN(formData.gpax) || Number(formData.gpax) < 0 || Number(formData.gpax) > 4.0) {
        newErrors.gpax = "กรุณากรอกเกรดเฉลี่ย (0.00 - 4.00)";
      }
    }

    if (step === 4) {
      if (!formData.photo) {
        newErrors.photo = "กรุณาอัปโหลดรูปถ่ายหน้าตรงขนาด 1 นิ้ว สำหรับติดใบสมัคร";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newApplicant = {
      ...formData,
      id: `app-${Date.now()}`,
      code: `QUOTA-68-${randomSuffix}`,
      fullName: `${formData.title}${formData.firstName} ${formData.lastName}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      officerNote: "รอเจ้าหน้าที่งานทะเบียนตรวจสอบเอกสาร",
      documents: {
        photo: !!formData.photo,
        transcript: formData.transcriptDoc,
        idCardCopy: formData.idCardCopyDoc,
        certificate: formData.certDoc,
      },
    };

    onAddApplicant(newApplicant);
    setSubmittedApplicant(newApplicant);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Banner / Title Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-blue-200 mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>เปิดรับสมัครรอบโควตาพิเศษ ประจำปีการศึกษา {ACADEMIC_YEAR}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ระบบรับสมัครเข้าศึกษาต่อออนไลน์
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ • กรอกข้อมูล ตรวจสอบความถูกต้อง
            และสร้างรายงานใบสมัครแบบฟอร์มทางการเป็นไฟล์ PDF อัตโนมัติ
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { num: 1, label: "ระดับชั้น & สาขาวิชา", icon: GraduationCap },
            { num: 2, label: "ข้อมูลผู้สมัคร & บิดามารดา", icon: User },
            { num: 3, label: "ที่อยู่ & การศึกษาเดิม", icon: Home },
            { num: 4, label: "อัปโหลดเอกสารหลักฐาน", icon: Upload },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-white/20 text-white font-semibold ring-1 ring-white/30"
                    : isCompleted
                    ? "text-blue-200"
                    : "text-blue-300/60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isActive
                      ? "bg-amber-400 text-slate-900 shadow-md"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {isCompleted ? "✓" : s.num}
                </div>
                <span className="truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
        
        {/* STEP 1: Level and Majors */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>ขั้นตอนที่ 1: เลือกระดับชั้นและสาขาวิชาที่ต้องการสมัคร</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                โปรดเลือกระดับชั้นการศึกษาที่ต้องการเข้าเรียน และเลือกสาขาวิชาตามความสนใจ
              </p>
            </div>

            {/* Level Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {LEVELS.map((lvl) => {
                const isSelected = formData.level === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleLevelChange(lvl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-slate-800">
                        {lvl.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {lvl.fullName}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Major Selection */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <h4 className="font-semibold text-sm text-slate-700">
                เลือกสาขาวิชา ({formData.levelName})
              </h4>

              {formData.level === "pwc" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      สาขาวิชาลำดับที่ 1 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="major1"
                      value={formData.major1}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      {MAJORS_PWC.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.dept})
                        </option>
                      ))}
                    </select>
                    {errors.major1 && (
                      <p className="text-rose-500 text-xs mt-1">{errors.major1}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      สาขาวิชาลำดับที่ 2 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="major2"
                      value={formData.major2}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      {MAJORS_PWC.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.dept})
                        </option>
                      ))}
                    </select>
                    {errors.major2 && (
                      <p className="text-rose-500 text-xs mt-1">{errors.major2}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    สาขาวิชาที่ต้องการเข้าเรียน (ปวส.) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="major1"
                    value={formData.major1}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {MAJORS_PWS.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.dept})
                      </option>
                    ))}
                  </select>
                  {errors.major1 && (
                    <p className="text-rose-500 text-xs mt-1">{errors.major1}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Personal & Parents Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>ขั้นตอนที่ 2: ข้อมูลส่วนตัวผู้สมัคร และข้อมูลบิดา-มารดา</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                กรอกตามข้อมูลจริงในบัตรประจำตัวประชาชน เพื่อใช้ออกเอกสารทางการ
              </p>
            </div>

            {/* ๑. ข้อมูลผู้สมัคร */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <h4 className="font-semibold text-sm text-slate-700 border-b border-slate-200 pb-2">
                ๑. ข้อมูลผู้สมัคร
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    คำนำหน้าชื่อ <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="เด็กชาย">เด็กชาย</option>
                    <option value="เด็กหญิง">เด็กหญิง</option>
                  </select>
                </div>

                <div className="sm:col-span-1.5">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="เช่น กิตติพงษ์"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.firstName && (
                    <p className="text-rose-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div className="sm:col-span-1.5">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    นามสกุล <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="เช่น สถิตมั่นคง"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.lastName && (
                    <p className="text-rose-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* ID Card 13 digits with validation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  เลขประจำตัวประชาชน 13 หลัก <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={13}
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleInputChange}
                    placeholder="เลข 13 หลักตามบัตร ปชช. เช่น 1103702589412"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-mono tracking-wider outline-none ${
                      errors.idCard
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {errors.idCard ? (
                  <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.idCard}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    ระบบจะใช้เลขนี้ในการค้นหาและตรวจสอบสถานะการสมัคร
                  </p>
                )}
              </div>

              {/* Birth Date (Day, Month, Year พ.ศ.) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  วันเดือนปีเกิด (พ.ศ.) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        วันที่ {d}
                      </option>
                    ))}
                  </select>

                  <select
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  >
                    {THAI_MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  >
                    {Array.from({ length: 30 }, (_, i) => 2555 - i).map((y) => (
                      <option key={y} value={y}>
                        พ.ศ. {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ๒. ข้อมูลบิดา */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <h4 className="font-semibold text-sm text-slate-700 border-b border-slate-200 pb-2">
                ๒. ข้อมูลบิดา
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อ-สกุลบิดา <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="เช่น นายสมศักดิ์ สถิตมั่นคง"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fatherName && (
                    <p className="text-rose-500 text-xs mt-1">{errors.fatherName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    อายุ (ปี) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="fatherAge"
                    value={formData.fatherAge}
                    onChange={handleInputChange}
                    placeholder="เช่น 48"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fatherAge && (
                    <p className="text-rose-500 text-xs mt-1">{errors.fatherAge}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    อาชีพ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherJob"
                    value={formData.fatherJob}
                    onChange={handleInputChange}
                    placeholder="เช่น รับจ้าง / ค้าขาย"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fatherJob && (
                    <p className="text-rose-500 text-xs mt-1">{errors.fatherJob}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ๓. ข้อมูลมารดา */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <h4 className="font-semibold text-sm text-slate-700 border-b border-slate-200 pb-2">
                ๓. ข้อมูลมารดา
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อ-สกุลมารดา <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder="เช่น นางสมศรี สถิตมั่นคง"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.motherName && (
                    <p className="text-rose-500 text-xs mt-1">{errors.motherName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    อายุ (ปี) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="motherAge"
                    value={formData.motherAge}
                    onChange={handleInputChange}
                    placeholder="เช่น 45"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.motherAge && (
                    <p className="text-rose-500 text-xs mt-1">{errors.motherAge}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    อาชีพ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherJob"
                    value={formData.motherJob}
                    onChange={handleInputChange}
                    placeholder="เช่น ค้าขาย / รับจ้าง"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.motherJob && (
                    <p className="text-rose-500 text-xs mt-1">{errors.motherJob}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Address & Previous Education */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                <span>ขั้นตอนที่ 3: ที่อยู่ปัจจุบันและการศึกษาเดิม</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ระบุที่อยู่ที่สามารถติดต่อได้สะดวก และข้อมูลผลการเรียนสะสม (GPAX)
              </p>
            </div>

            {/* ๔. ที่อยู่ปัจจุบัน */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <h4 className="font-semibold text-sm text-slate-700 border-b border-slate-200 pb-2">
                ๔. ที่อยู่ปัจจุบันที่สามารถติดต่อได้
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    บ้านเลขที่ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressNo"
                    value={formData.addressNo}
                    onChange={handleInputChange}
                    placeholder="เช่น 45/2"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.addressNo && (
                    <p className="text-rose-500 text-xs mt-1">{errors.addressNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    หมู่
                  </label>
                  <input
                    type="text"
                    name="moo"
                    value={formData.moo}
                    onChange={handleInputChange}
                    placeholder="เช่น 3"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ซอย
                  </label>
                  <input
                    type="text"
                    name="soi"
                    value={formData.soi}
                    onChange={handleInputChange}
                    placeholder="เช่น เทศบาล 4"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ถนน
                  </label>
                  <input
                    type="text"
                    name="road"
                    value={formData.road}
                    onChange={handleInputChange}
                    placeholder="เช่น สุวรรณศร"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ตำบล / แขวง <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subdistrict"
                    value={formData.subdistrict}
                    onChange={handleInputChange}
                    placeholder="เช่น บ้านหมอ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.subdistrict && (
                    <p className="text-rose-500 text-xs mt-1">{errors.subdistrict}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    อำเภอ / เขต <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="เช่น บ้านหมอ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.district && (
                    <p className="text-rose-500 text-xs mt-1">{errors.district}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    จังหวัด <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PROVINCES_POPULAR.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    รหัสไปรษณีย์ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    placeholder="เช่น 18130"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.zipcode && (
                    <p className="text-rose-500 text-xs mt-1">{errors.zipcode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    หมายเลขโทรศัพท์ติดต่อ (10 หลัก) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="เช่น 0812345678"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ๕. การศึกษาเดิม */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <h4 className="font-semibold text-sm text-slate-700 border-b border-slate-200 pb-2">
                ๕. ข้อมูลการศึกษาเดิม
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    กำลังศึกษาอยู่ในระดับชั้น <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="currentGradLevel"
                    value={formData.currentGradLevel}
                    onChange={handleInputChange}
                    placeholder="เช่น มัธยมศึกษาปีที่ 3"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อโรงเรียนเดิม <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleInputChange}
                    placeholder="เช่น โรงเรียนบ้านหมอ 'พัฒนานุกูล'"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.previousSchool && (
                    <p className="text-rose-500 text-xs mt-1">{errors.previousSchool}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ตั้งอยู่เลขที่
                  </label>
                  <input
                    type="text"
                    name="schoolAddressNo"
                    value={formData.schoolAddressNo}
                    onChange={handleInputChange}
                    placeholder="เช่น 99"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ตำบล
                  </label>
                  <input
                    type="text"
                    name="schoolSubdistrict"
                    value={formData.schoolSubdistrict}
                    onChange={handleInputChange}
                    placeholder="เช่น บ้านหมอ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    อำเภอ
                  </label>
                  <input
                    type="text"
                    name="schoolDistrict"
                    value={formData.schoolDistrict}
                    onChange={handleInputChange}
                    placeholder="เช่น บ้านหมอ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    จังหวัด
                  </label>
                  <select
                    name="schoolProvince"
                    value={formData.schoolProvince}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  >
                    {PROVINCES_POPULAR.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ผลการเรียนเฉลี่ยสะสม (GPAX) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    name="gpax"
                    value={formData.gpax}
                    onChange={handleInputChange}
                    placeholder="เช่น 3.45"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.gpax && (
                    <p className="text-rose-500 text-xs mt-1">{errors.gpax}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    สาขาวิชาเดิม (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    name="previousMajor"
                    value={formData.previousMajor}
                    onChange={handleInputChange}
                    placeholder="เช่น มัธยมศึกษาตอนต้น / วิทย์-คณิต"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Documents Upload */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>ขั้นตอนที่ 4: อัปโหลดเอกสารหลักฐานประกอบการสมัคร</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                รูปถ่ายขนาด 1 นิ้วจะถูกจัดวางลงในแบบฟอร์มใบสมัครอัตโนมัติ (รองรับไฟล์ JPG, PNG, PDF ขนาดไม่เกิน 5-10MB)
              </p>
            </div>

            {/* 1-Inch Photo Upload Card */}
            <div className={`p-5 rounded-2xl border-2 transition-all ${
              errors.photo ? "border-rose-400 bg-rose-50/40" : "border-dashed border-blue-300 bg-blue-50/40"
            }`}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-28 h-36 border-2 border-slate-400 rounded-xl bg-white flex flex-col items-center justify-center overflow-hidden shadow-xs shrink-0">
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="รูปถ่ายติดใบสมัคร"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <Camera className="w-7 h-7 mx-auto mb-1 text-slate-400" />
                      <span className="text-[11px] font-medium leading-tight block">
                        รูปถ่าย<br />ขนาด ๑ นิ้ว
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm">
                    รูปถ่ายหน้าตรงขนาด ๑ นิ้ว (สวมชุดนักเรียน/นักศึกษา) <span className="text-rose-500">*</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    ภาพถ่ายหน้าตรง หน้าตรงไม่สวมหมวก ไม่ใส่แว่นตาดำ ถ่ายไว้ไม่เกิน 6 เดือน
                  </p>
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs active:scale-95 transition-all">
                      <Camera className="w-4 h-4" />
                      <span>{formData.photo ? "เปลี่ยนรูปถ่าย" : "เลือกไฟล์รูปถ่าย"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.photoFileName && (
                      <span className="ml-3 text-xs text-emerald-700 font-medium inline-flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{formData.photoFileName}</span>
                      </span>
                    )}
                  </div>
                  {errors.photo && (
                    <p className="text-rose-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.photo}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Other Documents */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                เอกสารแนบเพิ่มเติม (ตามที่ระบุในแบบฟอร์มใบสมัคร)
              </h4>

              {/* Doc 1: Transcript */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ๑
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      เอกสารแสดงผลการเรียนเฉลี่ยสะสม ๕ ภาคเรียน (ปพ.๑ / รบ.)
                    </p>
                    <p className="text-xs text-slate-500">
                      จำนวน ๑ ฉบับ (ไฟล์ PDF หรือรูปถ่ายชัดเจน)
                    </p>
                  </div>
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 rounded-xl text-xs font-medium cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{formData.transcriptDoc ? "แนบแล้ว" : "แนบไฟล์"}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleDocUpload("transcript", e)}
                      className="hidden"
                    />
                  </label>
                  {formData.transcriptFileName && (
                    <p className="text-[10px] text-emerald-600 truncate max-w-[120px] text-right mt-0.5">
                      {formData.transcriptFileName}
                    </p>
                  )}
                </div>
              </div>

              {/* Doc 2: ID & House Reg */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ๒
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      สำเนาบัตรประจำตัวประชาชน / สำเนาทะเบียนบ้าน
                    </p>
                    <p className="text-xs text-slate-500">
                      จำนวน ๑ ฉบับ พร้อมลงลายมือชื่อรับรองสำเนาถูกต้อง
                    </p>
                  </div>
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 rounded-xl text-xs font-medium cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{formData.idCardCopyDoc ? "แนบแล้ว" : "แนบไฟล์"}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleDocUpload("idCardCopy", e)}
                      className="hidden"
                    />
                  </label>
                  {formData.idCardCopyFileName && (
                    <p className="text-[10px] text-emerald-600 truncate max-w-[120px] text-right mt-0.5">
                      {formData.idCardCopyFileName}
                    </p>
                  )}
                </div>
              </div>

              {/* Doc 3: Certificate */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ๓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      สำเนาเกียรติบัตร / ใบรับรองความสามารถพิเศษ / ใบประกาศ (ถ้ามี)
                    </p>
                    <p className="text-xs text-slate-500">
                      เอกสารรับรองด้านกีฬา วิชาการ ศิลปะ หรือกิจกรรมเพื่อประกอบการพิจารณาโควตา
                    </p>
                  </div>
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 rounded-xl text-xs font-medium cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{formData.certDoc ? "แนบแล้ว" : "แนบไฟล์"}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleDocUpload("cert", e)}
                      className="hidden"
                    />
                  </label>
                  {formData.certFileName && (
                    <p className="text-[10px] text-emerald-600 truncate max-w-[120px] text-right mt-0.5">
                      {formData.certFileName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Confirmation Note */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">คำรับรองของผู้สมัคร:</p>
                <p className="mt-0.5 leading-relaxed">
                  ข้าพเจ้าขอรับรองว่าข้อความและเอกสารหลักฐานทั้งหมดที่ได้กรอกและอัปโหลดในระบบนี้
                  เป็นความจริงทุกประการ หากตรวจพบว่ามีข้อความหรือหลักฐานเป็นเท็จ
                  ข้าพเจ้ายินยอมให้ตัดสิทธิ์การเข้าศึกษาต่อทันที
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons / Navigation Actions */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>บันทึกข้อมูลและส่งใบสมัคร</span>
            </button>
          )}
        </div>

      </div>

      {/* Success Modal upon Submission */}
      {submittedApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              บันทึกการสมัครเรียนสำเร็จเรียบร้อย!
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              ระบบได้รับข้อมูลใบสมัครของคุณ <span className="font-semibold text-slate-900">{submittedApplicant.fullName}</span> เรียบร้อยแล้ว
            </p>

            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">รหัสใบสมัคร:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {submittedApplicant.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ระดับชั้น:</span>
                <span className="font-semibold text-slate-800">
                  {submittedApplicant.levelName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">สาขาวิชา:</span>
                <span className="font-semibold text-slate-800">
                  {submittedApplicant.major1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">สถานะปัจจุบัน:</span>
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                  รอตรวจสอบเอกสาร
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  onViewOfficialForm(submittedApplicant);
                  setSubmittedApplicant(null);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>พิมพ์ / ดาวน์โหลดรายงานใบสมัคร (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmittedApplicant(null)}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors cursor-pointer"
              >
                ปิดหน้าต่างนี้
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
