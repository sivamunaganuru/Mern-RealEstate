import { Router } from "express";
import {createListing,getListings,deleteListing,updateListing,fetchListing} from "../controllers/listing.controller.js";
import { tokenVerify } from "../utils/verifyUser.js";
const router = Router();

router.post("/create", tokenVerify,createListing);

router.get("/get-listings/:id", tokenVerify,getListings);

router.delete("/delete-listing/:id", tokenVerify,deleteListing);

router.post("/update-listing/:id", tokenVerify,updateListing);

router.get("/get/:id",fetchListing)

export default router;