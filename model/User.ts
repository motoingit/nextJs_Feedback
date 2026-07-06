import mongoose, {Schema, Document} from "mongoose";


// this is what typescipt is making of
// Model for Message
export interface Message extends Document{
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String, //! in mongose String not string
    required: true,
  },

  createdAt:{
    type: Date,
    required: true, //todo: do i need this if i have defualt
    default: Date.now,
  },
});



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

const UserSchema: Schema<User> = new mongoose.Schema({
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
    required: [true, "Verify Code is Required"], 
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "Expiry Date of VERIFYCODE is Required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default:true,
  },

  //* imp
  messages: [MessageSchema],
})


//todo: Know More [https://youtu.be/g1iqZpXklnY?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&t=1192]
//* banahua hai to use use karo ?? nahi tho new banao
const UserModel = (mongoose.models.User as mongoose.Model<User>) 
                ?? mongoose.model<User>("User", UserSchema)

export default UserModel;
