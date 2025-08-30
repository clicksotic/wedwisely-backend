const validateProfileInput = (data) => {
    const errors = {};
  
    // Date of birth
    if (!data.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required.";
    } else if (isNaN(Date.parse(data.dateOfBirth))) {
      errors.dateOfBirth = "Invalid date format.";
    }
  
    // Gender
    const allowedGenders = ["male", "female", "other"];
    if (!data.gender) {
      errors.gender = "Gender is required.";
    } else if (!allowedGenders.includes(data.gender.toLowerCase())) {
      errors.gender = "Gender must be male, female, or other.";
    }
  
    // Age
    if (data.age === undefined || data.age === null) {
      errors.age = "Age is required.";
    } else if (typeof data.age !== "number" || data.age <= 0 || data.age > 120) {
      errors.age = "Age must be a number between 1 and 120.";
    }
  
    // Phone number
    if (!data.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\+?[0-9]{7,15}$/.test(data.phoneNumber)) {
      errors.phoneNumber = "Phone number must be valid (7–15 digits, optional +).";
    }
  
    // Location
    if (!data.location) {
      errors.location = "Location is required.";
    } else if (typeof data.location !== "string" || data.location.trim().length < 2) {
      errors.location = "Location must be a valid string.";
    }
  
    // Pincode
    if (!data.pincode) {
      errors.pincode = "Pincode is required.";
    } else if (!/^[0-9]{4,10}$/.test(data.pincode)) {
      errors.pincode = "Pincode must be 4–10 digits.";
    }
  
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };
  
  module.exports = {
    validateProfileInput,
  };
  