import express from 'express';
import {signup,signin,googleSignup,updateAccount,deleteAccount,signout,getUser
} from '../controllers/auth.controller.js';
import {tokenVerify} from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post("/google", googleSignup);

router.put("/update-profile", tokenVerify,updateAccount);

router.delete("/delete-account/:id",tokenVerify,deleteAccount);

router.get("/signout",signout);

router.get('/get-user/:id',tokenVerify,getUser);


export default router;