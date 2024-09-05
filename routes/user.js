import express from "express";
import {
    userRegister,
    getAllUsers,
    UserLogin,
    forgotPassword,
    resetpassword,
    getSingleUser
} from "../controllers/user.js";

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', UserLogin);
router.get('/all', getAllUsers);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:randomString", resetpassword);
router.get('/getSingleUser/:email', getSingleUser);


export default router;
