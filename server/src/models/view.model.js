import mongoose, { mongo, Mongoose } from "mongoose";
import validator from "validator";

const viewSchema = new mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required:true
    },
    sessionId: {
        type: String,
        required:true
    },
    viewedAt: {
        type: Date,
        default:Date.now
    }
});

export const View = mongoose.model("View", viewSchema);