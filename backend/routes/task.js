import express from "express";
import { Task } from "../models/task.js";
// import bcrypt from "bcrypt";
const router = express.Router();

router.post("/addtask",async(req,res,next) => {
    const {title,description,priority,start,end,date}= req.body
    try {
        // const hashedPassword = await bcrypt.hash(password,10)
        const newTask= new Task({
            title,
            description,
            priority,
            start,
            end,
            date,
        })

        await newTask.save();

        res.status(201).json({message:'New Task created successfully', user:newTask})
    
        } catch (error) {
            res.status(500).json({message:'error while creating task', error:error.message})
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Error fetching tasks', error: error.message});
    }
})

export default router;