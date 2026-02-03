import { Notification } from "../models/notification.model.js";

const createNotification = async ({ user, type, message, link })=>{
    try {
        await Notification.create({
            user,
            type,
            message,
            link
        })
    } catch (error) {
        throw new Error("Failed to create notification")
    }
};

export default createNotification