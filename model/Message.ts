import mongoose, { Schema, Document } from "mongoose";

// defining the Message Type its schema
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// Implementing the MessageSchema
export const MessageSchema: Schema<Message> = new mongoose.Schema({
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

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ??
  mongoose.model<Message>("Message", MessageSchema);
export default MessageModel;
