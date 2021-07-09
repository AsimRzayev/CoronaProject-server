import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
    },
    memorytype: {
        type: String,
    },
    creater: {
        type: String,
    },
    viewcount: {
        type: Number,
    },
    selectedFile: String,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
const Memories = mongoose.model("Memories", memorySchema);
module.exports = Memories;
