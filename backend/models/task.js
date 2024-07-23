import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'medium'},
    start: {type: String, required: true},
    end: {type: String, required: true},
    date: {type: String, required: true},

},{timestamps: true})

export const Task = mongoose.model('Task', taskSchema);