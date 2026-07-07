import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


//* This consist of Unoptimised thing and optimesed thing
// https://youtu.be/sijpPYDWBg4?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&t=2600
export const authOptions: NextAuthOptions = {
  providers:[
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        //also can add placeholder
        email: { label: "Email", type: "text "},
        password: { label: "Password", type: "password" },
      },

      //TODO: RECHECK
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any): Promise<any> {
        
        try {
          await dbConnect();
          
          const user = await UserModel.findOne({
            $or:[
              {email: credentials.identifier},
              {username: credentials.identifier},
            ]
          })

          if(!user){
            throw new Error("No User Found with this Email")
          }
          
          if(!user.isVerified){
            throw new Error("Werify your account first")
          }


          //* NOW
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if(isPasswordCorrect){
            return user;
          }else{
            throw new Error("incorrect Password")
          }

        //TODO: RECHECK
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
           throw new Error(error);
        }
      },
    })
  ],

  callbacks: {
    async session({ session, token }) {
      if(token){
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session
    },

    async jwt({ token, user }) {
      if(user){
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token
    },
  },

  pages: {
    //overfite of signin
    signIn: '/signin',
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET_KEY,
}
