import { Router } from "express";

const router = Router();

router.post("register", userRegisterController);
export default router;