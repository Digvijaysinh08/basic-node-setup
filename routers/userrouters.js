import express from "express";
import UserController from "../controllers/usercontroller.js";

const router = express.Router();

router.get("/test", UserController.testUser);

export default router;
