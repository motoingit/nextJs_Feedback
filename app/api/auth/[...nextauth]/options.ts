import "@/utils/logger-init";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { comparePassword } from "@/utils/passwordManager";

interface UserCredentials {
  identifier?: string;
  password?: string;
}

//NOTE 📝: NextAuth options configuration and provider setup
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      //todo hardcoded
      id: "credentials",
      name: "Credentials",
      credentials: {
        //identifer map for dev
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Authorization callback that validates the user's credentials.
       *
       * @param credentials - User credentials passed from the sign-in form.
       * @returns The user object if authentication succeeds, otherwise throws an error.
       */
      //todo: check for crential.json for better type
      async authorize(credentials: any): Promise<any> {
        console.log(
          `AUTH; Authorization request initiated for identifier: "${credentials?.identifier}"`,
        );

        try {
          await dbConnect();

          //NOTE: this is the current logic in signup page also
          //NOTE 📝: Look up user by email or username

          const identifier = credentials.identifier;

          const user = identifier.includes("@")
            ? await UserModel.findOne({ email: identifier })
            : await UserModel.findOne({ username: identifier });

          //NOTE : if user is not in database
          if (!user) {
            console.warn(
              `WARN; User not found for identifier: "${credentials.identifier}"`,
            );
            throw new Error("No User Found with this Email or Username");
          }

          //if user is not verified
          if (!user.isVerified) {
            console.warn(
              `WARN; User is not verified: "${credentials.identifier}"`,
            );
            throw new Error("Please verify your account first");
          }

          console.log(`mongodb= ${user.password}`)
          console.log(`local= ${credentials.password}`)
          const isPasswordCorrect = await comparePassword(credentials.password, user.password);

          if (isPasswordCorrect) {
            console.info(
              `SUCCESS; Successfully authenticated user: "${user.username}" (ID: ${user._id})`,
            );
            return user;
          } else {
            console.warn(
              `WARN; Password mismatch for user: "${user.username}"`,
            );
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          console.error("ERROR; Error during authorization process:", error);
          //NOTE 📝: Propagate error message to NextAuth
          throw new Error(error.message || "Authentication error occurred");
        }
      },
    }),
  ],

  //NOTE 📝: NextAuth callbacks for custom JWT and Session mutation
  callbacks: {
    /**
     * Session callback that exposes database fields into the client session object.
     */
    async session({ session, token }) {
      console.log("Im Session");
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },

    /**
     * JWT callback that persists database user details into the token object.
     */
    async jwt({ token, user }) {
      console.log("Im JWWT");
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
  },

  pages: {
    // Custom login page redirection target
    signIn: "/signin",
  },

  session: {
    // Rely on JSON Web Tokens for session management
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
