import { Router } from "express";
import createExercise from "../controllers/exerciseController.js";

const router = Router();

router.post("/", createExercise);

export default router;
