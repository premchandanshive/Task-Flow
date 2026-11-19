import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or has expired." });
  }
};

export default requireAuth;
