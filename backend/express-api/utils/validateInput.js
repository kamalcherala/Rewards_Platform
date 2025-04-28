exports.validateRegisterInput = (name, email, password) => {
  if (!name || !email || !password) {
    return "All fields are required";
  }
  
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  
  return null;
};