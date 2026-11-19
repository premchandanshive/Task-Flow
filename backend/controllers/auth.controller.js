import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../config/token.js";

const cookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const publicUser = (user) => ({
  id: user._id,
  firstname: user.firstname,
  lastname: user.lastname,
  username: user.username,
  email: user.email,
});

export const signup = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (![firstname, lastname, username, email, password].every(
      (value) => typeof value === "string" && value.trim()
    )) {
      return res.status(400).json({ message: "Please complete all required fields." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must contain at least 8 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      const field = existingUser.email === normalizedEmail ? "email" : "username";
      return res.status(409).json({ message: `An account with this ${field} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions());

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email or username is already in use." });
    }

    console.error("Signup error:", error.message);
    return res.status(500).json({ message: "Unable to create your account right now." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions());

    return res.status(200).json({
      message: "Logged in successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Unable to log in right now." });
  }
};

export const logout = (req, res) => {
  const { maxAge, ...options } = cookieOptions();
  res.clearCookie("token", options);
  return res.status(200).json({ message: "Logged out successfully." });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Account not found." });
    }

    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    console.error("Current user error:", error.message);
    return res.status(500).json({ message: "Unable to verify your session." });
  }
};
