import User from '../models/user.js';
import bcrypt from 'bcrypt';
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

const signup = (req, res,next) => {
    
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    console.log(username, email, hashPassword);
    const newUser = new User({ username, email, password: hashPassword });
    newUser.save().then((user) => {
        res.status(200).json(`${username} Logged In Successfully`);
    }).catch((err) => {
        next(err);
    })
}

const signin = (req, res,next) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                return next(errorHandler(404,"User not found"));
            }
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return next(errorHandler(401,"Incorrect Password"));
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password:confidential, ...others } = user._doc;
            res
            .cookie("access_token", token, { httpOnly: true,expires:new Date(Date.now()+86400000)})
            .status(200)
            .json(others);
        })
    }
    catch (error) {
        next(errorHandler(500,"Internal Server Error: Cannot Login"));
    }

}

const googleSignup = async (req, res,next) => {
    const { username, email,photo } = req.body;
    try{
        const userdata = await User.findOne({email:email});
        if(userdata){
            const token = jwt.sign({ id: userdata._id }, process.env.JWT_SECRET);
            const { password:confidential, ...others } = userdata._doc;
            res
            .cookie("access_token", token, { httpOnly: true,expires:new Date(Date.now()+86400000)})
            .status(200)
            .json(others);
        }else{
            const googlePassword = Math.random().toString(36).slice(-8);
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(googlePassword, salt);
            const generateUsername = username.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-8);
            const newUser = new User({ username:generateUsername, email, password: hashPassword,avatar:photo });
            const user = await newUser.save();
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password:confidential, ...others } = user._doc;
            res
            .cookie("access_token", token, { httpOnly: true,expires:new Date(Date.now()+86400000)})
            .status(200)
            .json(others);
        }

    }catch(error){
        next(errorHandler(500,"Internal Server Error: Cannot Login with Google"));
    }
}

const deleteAccount = async (req, res,next) => {
    const { id } = req.params;
    if( id !== req.user.id){
        return next(errorHandler(401,"Unauthorized User trying to Delete,  Please Login Again"));
    }
    console.log(req.params);
    try{
        const userdata = await User.findByIdAndDelete(id);
        res.clearCookie("access_token");
        res.status(200).json(`${userdata.username} Deleted Successfully`)
            
    }
    catch(error){
        next(errorHandler(500,"Cannot Delete Account, Please Try Again"));
    }
}

const updateAccount = async (req, res,next) => {
    const { id,username,email,password,avatar } = req.body;
    if( id !== req.user.id){
        return next(errorHandler(401,"Unauthorized User, Please Login Again"));
    }
    // console.log(req.user);
    try{
        const userdata = await User.findById(id);
        if(userdata){
            userdata.username = username;
            userdata.email = email;
            if (password) {
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(password, salt);
                userdata.password = hashPassword;
            }
            userdata.avatar = avatar;
            const updatedUser = await userdata.save();
            const { password:confidential, ...others } = updatedUser._doc;
            res.status(200).json(others);
            
        }else{
            return next(errorHandler(404,"User not found"));
        }
    }
    catch(error){
        console.log(error);
        next(errorHandler(500,"Internal Server Error: Cannot Update Account"));
    }
}

const signout = async (req, res,next) => {
    try{
        res.clearCookie("access_token");
        res.status(200).json("Logged Out Successfully");
    }
    catch(error){
        next(errorHandler(500,"Internal Server Error: Cannot Logout"));
    }
}

const getUser = async (req, res,next) => {
    const { id } = req.params;
    try{
        const userdata = await User.findById(id);
        if(userdata){
            const { password:confidential, ...others } = userdata._doc;
            res.status(200).json(others);
            
        }else{
            return next(errorHandler(404,"User not found"));
        }
    }
    catch(error){
        next(errorHandler(500,"Internal Server Error: Cannot Get User"));
    }
}
export { signup, signin,googleSignup,deleteAccount,updateAccount,signout,getUser };