
import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";


export const tokenVerify = async (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token);
    if (!token) {
        return next(errorHandler(401, "Unauthorized User, Please Login"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        // const user = await User.findById(decoded.id);
        
        if (!decoded) {
            return next(errorHandler(404, "Cannot identify : Not a valid token"));
        }
        req.user = decoded;
        // console.log(req.user);
        next();
    } catch (error) {
        return next(errorHandler(500, "Internal Server Error: Failed to verify token"));
    }
}