import { Router } from "express";
import createExercise from "../controllers/exerciseController.js";

const router = Router();

router.route("/:_id/exercises").post(createExercise);

export default router;
