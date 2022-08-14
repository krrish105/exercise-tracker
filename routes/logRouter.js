import { Router } from "express";
import getLog from "../controllers/logController.js";

const router = Router();

router.get("/", getLog);

export default router;
