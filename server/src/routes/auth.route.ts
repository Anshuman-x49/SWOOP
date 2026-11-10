import { Router } from "express";
import { userRegisterValidator } from "../validators/auth.validator.js";
import { userRegisterController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userRegisterValidator, userRegisterController);

export default router;
