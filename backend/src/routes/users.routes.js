import { Router } from "express";
import {
  listUsers,
  overview,
  banUser,
  unbanUser,
  kickUser,
  setUserRole,
  deleteUser,
} from "../controllers/users.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

export const usersRouter = Router();

usersRouter.use(requireAuth, requireAdmin);

usersRouter.get("/overview", overview);
usersRouter.get("/users", listUsers);
usersRouter.patch("/users/:id/ban", banUser);
usersRouter.patch("/users/:id/unban", unbanUser);
usersRouter.patch("/users/:id/kick", kickUser);
usersRouter.patch("/users/:id/role", setUserRole);
usersRouter.delete("/users/:id", deleteUser);
