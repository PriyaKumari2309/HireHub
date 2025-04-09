import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;
    req.userType = decode.userType; // 👈 Attach userType from token

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authentication error",
      success: false,
      error: error.message, // Log the error message
    });
  }
};
export default isAuthenticated;
