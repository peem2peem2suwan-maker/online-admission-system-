// Validate Thai National ID (13 digits with checksum)
export function validateThaiID(id) {
  if (!id) return { valid: false, message: "กรุณากรอกเลขประจำตัวประชาชน" };
  const cleanId = id.toString().replace(/\D/g, "");
  
  if (cleanId.length !== 13) {
    return { valid: false, message: "เลขบัตรประชาชนต้องครบ 13 หลัก" };
  }

  // Checksum calculation (Standard Thai ID Mod 11)
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanId.charAt(i), 10) * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  const isValidChecksum = checkDigit === parseInt(cleanId.charAt(12), 10);

  // In test environments some demo IDs might be used, but we validate strictly
  if (!isValidChecksum) {
    return { valid: false, message: "รูปแบบเลขบัตรประชาชนไม่ถูกต้องตามหลักการคำนวณ" };
  }

  return { valid: true, message: "" };
}

// Validate Thai Phone Number (10 digits starting with 0)
export function validatePhone(phone) {
  if (!phone) return { valid: false, message: "กรุณากรอกหมายเลขโทรศัพท์" };
  const cleanPhone = phone.toString().replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    return { valid: false, message: "หมายเลขโทรศัพท์ต้องครบ 10 หลัก" };
  }
  if (!cleanPhone.startsWith("0")) {
    return { valid: false, message: "หมายเลขโทรศัพท์ต้องขึ้นต้นด้วยเลข 0" };
  }
  return { valid: true, message: "" };
}

// Convert Arabic digits to Thai digits
export function toThaiNumerals(num) {
  if (num === undefined || num === null) return "";
  const thaiDigits = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  return num.toString().replace(/[0-9]/g, (digit) => thaiDigits[parseInt(digit, 10)]);
}

// Format Phone display (08x-xxx-xxxx)
export function formatPhone(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Format ID Card display (x-xxxx-xxxxx-xx-x)
export function formatIDCard(id) {
  if (!id) return "";
  const cleaned = id.replace(/\D/g, "");
  if (cleaned.length === 13) {
    return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5, 10)}-${cleaned.slice(10, 12)}-${cleaned.slice(12)}`;
  }
  return id;
}
