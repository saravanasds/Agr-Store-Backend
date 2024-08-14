import express from "express";
import { userRegister, getAllUsers } from "../controllers/user.js";

const router = express.Router();

router.post('/register', userRegister);
router.get('/all', getAllUsers);

export default router;
