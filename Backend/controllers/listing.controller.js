import {errorHandler}  from "../utils/error.js";
import Jwt from "jsonwebtoken";
import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {

    try{
        const {name, description, address, regularPrice, discountedPrice, bedrooms, bathrooms,furnished, parking, type, offer, imageUrls} = req.body;
        const userRef = req.user.id;
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

export const getListings = async (req, res, next) => {
    const id = req.params.id;
    if( id !== req.user.id){
        return next(errorHandler(401,"Unauthorized User, you can only view your own listings"));
    }
    try{
        const listings = await Listing.find({userRef: id});
        return res.status(200).json({
            success: true,
            message: "Listings fetched successfully",
            listings
        });
    }
    catch(err){
        next(err);
    }
}

export const deleteListing = async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        return next(errorHandler(404,"Listing not found"));
    }
    if(listing.userRef.toString() !== req.user.id){
        return next(errorHandler(401,"Unauthorized User, you can only delete your own listings"));
    }
    try{
        await Listing.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Listing deleted successfully",
        });
    }
    catch(err){
        next(err);
    }
}

export const updateListing = async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        return next(errorHandler(404,"Listing not found"));
    }
    if(listing.userRef.toString() !== req.user.id){
        return next(errorHandler(401,"Unauthorized User, you can only update your own listings"));
    }
    try{
        const {name, description, address, regularPrice, discountedPrice, bedrooms, bathrooms,furnished, parking, type, offer, imageUrls} = req.body;
        const updatedListing = await Listing.findByIdAndUpdate(id,{
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
            imageUrls
        },{new: true});
        return res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing: updatedListing
        });
    }
    catch(err){
        next(err);
    }
}

export const fetchListing = async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        return next(errorHandler(404,"Listing not found"));
    }
    try{
        return res.status(200).json({
            success: true,
            message: "Listing fetched successfully",
            listing
        });
    }
    catch(err){
        next(err);
    }

}