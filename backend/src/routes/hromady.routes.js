import { Router } from "express";
import {
  listHromady,
  getHromada,
  createHromada,
  updateHromada,
  deleteHromada,
} from "../controllers/hromady.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const hromadyRouter = Router();

hromadyRouter.get("/", listHromady);
hromadyRouter.get("/:id", getHromada);
hromadyRouter.post("/", requireAuth, createHromada);
hromadyRouter.put("/:id", requireAuth, updateHromada);
hromadyRouter.delete("/:id", requireAuth, deleteHromada);
