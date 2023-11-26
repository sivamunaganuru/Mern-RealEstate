import User from '../models/user.js';
import bcrypt from 'bcrypt';
import {errorHandler} from '../utils/error.js';
const signup = (req, res,next) => {
    
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    console.log(username, email, hashPassword);
    const newUser = new User({ username, email, password: hashPassword });
    newUser.save().then((user) => {
        res.status(200).json("User created Successfully");
    }).catch((err) => {
        next(err);
    })
}

export default signup;