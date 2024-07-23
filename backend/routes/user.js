import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/signup",async(req,res,next) => {
    const {username,email,password,role,profileImage,imagePos}= req.body
    try {
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser= new User({
            username,
            email,
            password:hashedPassword,
            role,
        })

        if (profileImage) {
            newUser.profileImage = profileImage;
        }
        if (imagePos) {
            newUser.imagePos = imagePos;
        }

        await newUser.save();

        res.status(201).json({message:'user created successfully', user:newUser})
    
        } catch (error) {
            res.status(500).json({message:'error while creating user', error:error.message})
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Error fetching users', error: error.message});
    }
})

export default router;