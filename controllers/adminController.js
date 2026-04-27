import jwt from "jsonwebtoken";

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  // ENV se check
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
};