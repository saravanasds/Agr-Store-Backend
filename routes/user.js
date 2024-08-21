import express from "express";
import { userRegister, getAllUsers, UserLogin,  } from "../controllers/user.js";

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', UserLogin);
router.get('/all', getAllUsers);


export default router;
