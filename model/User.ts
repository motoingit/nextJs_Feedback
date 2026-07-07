import mongoose, {Schema, Document} from "mongoose";
import {MessageSchema, Message} from "./Message";


// Model for User
export interface User extends Document{
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[]
}

//Implementing UserSchema
const UserSchema: Schema<User> = new mongoose.Schema({
  //* username is Identifier here
  username:{
    type: String,
    required: [true, "Username is Required"],
    trim:true,
    unique:true,
  },

  email: {
    type: String,
    required: [true, "Email is Required"],
    unique:true,
    match: [/.+\@.+\..+/, "Please use a Valid Email Address"], 
  },

  password: {
    type: String,
    required: [true, "Password is Required"], 
  },

  verifyCode: {
    type: String,
    required: [true, "Verification Code (OTP) is Required"], 
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "Expiry Date for OTP is Required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default:true,
  },

  //* Array of type MessageSchema
  messages: [MessageSchema],
})

//* If Already Created at database then use that || Else Create one
const UserModel = (mongoose.models.User as mongoose.Model<User>) 
                ?? mongoose.model<User>("User", UserSchema)
export default UserModel;
