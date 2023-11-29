import { Router } from "express";
import {createListing} from "../controllers/listing.controller.js";
import { tokenVerify } from "../utils/verifyUser.js";
const router = Router();

router.post("/create", tokenVerify,createListing);

export default router;