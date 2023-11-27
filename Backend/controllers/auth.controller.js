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
        next(errorHandler(500,"Internal Server Error"));
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
        next(errorHandler(500,"Internal Server Error"));
    }
}
export { signup, signin,googleSignup };