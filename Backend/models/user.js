import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"
    },
    
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;