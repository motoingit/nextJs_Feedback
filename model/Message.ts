import mongoose, { Schema, Document } from "mongoose";

// defining the Message Type its schema
export interface Message extends Document {
  senderId?: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

// Implementing the MessageSchema
export const MessageSchema: Schema<Message> = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  content: {
    //* in Mongoose String , in TS string . . .
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
