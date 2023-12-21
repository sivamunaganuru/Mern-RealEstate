import { Router } from "express";
import {createListing,getListing,deleteListing} from "../controllers/listing.controller.js";
import { tokenVerify } from "../utils/verifyUser.js";
const router = Router();

router.post("/create", tokenVerify,createListing);

router.get("/get-listings/:id", tokenVerify,getListing);

router.delete("/delete-listing/:id", tokenVerify,deleteListing);

export default router;