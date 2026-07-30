import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { signToken } from "../auth.js";

export function login(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res.status(400).json({ error: "Email і пароль обов'язкові" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Невірний email або пароль" });
  }

  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}

export function me(req, res) {
  res.json({ user: req.user });
}
