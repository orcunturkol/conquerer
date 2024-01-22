const validateRegistration = (req, res, next) => {
  const { email, password, fullname } = req.body;

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  // Password length validation
  if (!password || password.length < 8) {
    return res.status(400).send("Password must be at least 8 characters long");
  }

  // Password special character validation
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    return res
      .status(400)
      .send("Password must contain at least one special character");
  }

  // Validate fullname
  if (!fullname) {
    return res.status(400).send("Fullname is required");
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
};
