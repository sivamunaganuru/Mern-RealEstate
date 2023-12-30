import { Router } from "express";
import {createListing,getListings,deleteListing,updateListing,fetchListing,getAllListings} from "../controllers/listing.controller.js";
import { tokenVerify } from "../utils/verifyUser.js";
const router = Router();

router.post("/create", tokenVerify,createListing);

router.get("/get-listings/:id", tokenVerify,getListings);

router.delete("/delete-listing/:id", tokenVerify,deleteListing);

router.post("/update-listing/:id", tokenVerify,updateListing);

router.get("/get/:id",fetchListing);

router.get("/get-listings",getAllListings);

export default router;