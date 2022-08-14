import { Router } from "express";
import getLog from "../controllers/logController.js";

const router = Router();

router.route("/:_id/logs").get(getLog);

export default router;
