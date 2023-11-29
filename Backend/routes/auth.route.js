import express from 'express';
import {signup,signin,googleSignup,updateAccount,deleteAccount,signout} from '../controllers/auth.controller.js';
import {tokenVerify} from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post("/google", googleSignup);

router.put("/update-profile", tokenVerify,updateAccount);

router.delete("/delete-account/:id",tokenVerify,deleteAccount);

router.get("/signout",signout);

export default router;