import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader); // 🔍 debug

    if (!authHeader) {
      throw new ApiError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token); // 🔍 debug

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); // 🔍 debug

    req.user = {
      email: decoded.email,
      role: "admin"
    };

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message); // 🔥 IMPORTANT
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export default authMiddleware;