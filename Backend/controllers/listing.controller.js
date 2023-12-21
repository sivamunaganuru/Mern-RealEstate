import {errorHandler}  from "../utils/error.js";
import Jwt from "jsonwebtoken";
import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {

    try{
        const {name, description, address, regularPrice, discountedPrice, bedrooms, bathrooms,furnished, parking, type, offer, imageUrls} = req.body;
        const userRef = req.user._id;
        const listing = new Listing({
            name,
            description,
            address,
            regularPrice,
            discountedPrice,
            bedrooms,
            bathrooms,
            furnished,
            parking,
            type,
            offer,
            imageUrls,
            userRef
        });
        await listing.save();
        return res.status(201).json({
            success: true,
            message: "Listing created successfully",
            listing
        });
    }
    catch(err){
        next(err);
    }
};