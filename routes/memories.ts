import express, { Request, Response } from "express";
import mongoose from "mongoose";
const MemoryRouter = express.Router();
import auth from "../Middlewares/auth";
const validationMemory = require("../Middlewares/memoriesMiddleware");
const memoryValSchema = require("../Validations/memoryValidation");
const Memories = require("../models/memories.model");

MemoryRouter.route("").get(async (req: Request, res: Response) => {
    const { page } = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Memories.countDocuments({});
        const memories = await Memories.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);

        res.status(200).json({
            data: memories,
            currentPage: Number(page),
            numberOfPage: Math.ceil(total / LIMIT),
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
MemoryRouter.route("/memory/:id").get(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await Memories.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
MemoryRouter.route("/add").post(
    auth,
    validationMemory(memoryValSchema),

    async (req: Request, res: Response) => {
        req.body.viewcount = 0;
        const memory = req.body;
        const { userId }: any = req;
        const newMemory = new Memories({
            ...memory,
            creater: userId,
            createdAt: new Date().toISOString(),
        });
        newMemory
            .save()
            .then(() => res.json(newMemory))
            .catch((err: string) => res.status(400).json({ "Error: ": err }));
    }
);
MemoryRouter.route("/:id/commentMemory").post(
    auth,
    async (req: any, res: Response) => {
        const { id } = req.params;
        const { value } = req.body;

        const memory = await Memories.findById(id);

        memory.comments.push(value);

        const updatedMemories = await Memories.findByIdAndUpdate(id, memory, {
            new: true,
        });

        res.json(updatedMemories);
    }
);
MemoryRouter.route("/updateViewer").patch(
    async (req: Request, res: Response) => {
        const { memoryId } = req.body;
        const memory = await Memories.findById(memoryId);
        await Memories.findByIdAndUpdate(
            memoryId,
            {
                viewcount: memory.viewcount + 1,
            },
            {
                useFindAndModify: false,
            }
        );
        res.status(202).json({ message: "View Updated" });
    }
);
MemoryRouter.route("/updateMemory/:id").patch(
    auth,
    validationMemory(memoryValSchema),
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const {
            title,
            description,
            memorytype,
            selectedFile,
            tags,
            likes,
            viewcount,
            createdAt,
        } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No Memory with id: ${id}`);
        const updatedMemory = {
            title,
            description,
            memorytype,
            tags,
            selectedFile,
            likes,
            viewcount,
            createdAt,
            _id: id,
        };

        await Memories.findByIdAndUpdate(id, updatedMemory, { new: false });

        res.json(updatedMemory);
    }
);
MemoryRouter.route("/deleteMemory/:id").delete(
    auth,
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No memory with id: ${id}`);

        await Memories.findByIdAndRemove(id);

        res.json({ message: "Memory deleted successfully." });
    }
);

MemoryRouter.route("/:id/likeMemory").patch(
    auth,
    async (req: any, res: Response) => {
        const { id } = req.params;

        if (!req.userId) {
            return res.json({ message: "Unauthenticated" });
        }
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No memory with id: ${id}`);

        const memory = await Memories.findById(id);

        const index = memory.likes.findIndex(
            (id: string) => id === String(req.userId)
        );

        if (index === -1) {
            memory.likes.push(req.userId);
        } else {
            memory.likes = memory.likes.filter(
                (id: string) => id !== String(req.userId)
            );
        }
        const updatedMemory = await Memories.findByIdAndUpdate(id, memory, {
            new: true,
        });
        res.status(200).json(updatedMemory);
    }
);

MemoryRouter.route("/search").get(async (req, res) => {
    const { searchQuery, category }: any = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        let memories = [{}];
        if (category != "ALL")
            memories = await Memories.find({
                $and: [{ title }, { memorytype: category }],
            });
        else {
            memories = await Memories.find({
                $or: [{ title }, { memorytype: category }],
            });
        }
        res.json({ data: memories });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
module.exports = MemoryRouter;
