import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
});
const AUTH = mongoose.model("AUTH", authSchema);
module.exports = AUTH;
