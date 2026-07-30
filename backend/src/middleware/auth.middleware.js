import { verifyToken } from "../auth.js";
import { db } from "../db.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Потрібна авторизація" });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ error: "Недійсний або прострочений токен" });
  }

  // Перевірка проти БД (не лише токена), щоб бан/kick/зміна ролі діяли миттєво.
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.sub);
  if (!user || user.token_version !== decoded.tokenVersion) {
    return res.status(401).json({ error: "Сесію завершено, увійдіть знову" });
  }
  if (user.banned) {
    return res.status(403).json({ error: "Акаунт заблоковано" });
  }

  req.user = { id: user.id, email: user.email, role: user.role, tokenVersion: user.token_version };
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Потрібні права адміністратора" });
  }
  next();
}
