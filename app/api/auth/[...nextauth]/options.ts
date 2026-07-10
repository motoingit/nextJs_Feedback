import "@/utils/logger-init";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

//NOTE 📝: NextAuth options configuration and provider setup
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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
      //REMINDER : Type the credentials parameter strictly if appropriate
      async authorize(credentials: any): Promise<any> {
        console.log(`[AUTH] Authorization request initiated for identifier: "${credentials?.identifier}"`);
        
        try {
          await dbConnect();
          
          //TODO: this is the current logic in signup page also
          //NOTE 📝: Look up user by email or username 
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ]
          });

          //NOTE : if user is not in database
          if (!user) {
            console.warn(`[WARN] User not found for identifier: "${credentials.identifier}"`);
            throw new Error("No User Found with this Email or Username");
          }
          
          //if user is not verified
          if (!user.isVerified) {
            console.warn(`[WARN] User is not verified: "${credentials.identifier}"`);
            throw new Error("Please verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordCorrect) {
            console.info(`[SUCCESS] Successfully authenticated user: "${user.username}" (ID: ${user._id})`);
            return user;
          } else {
            console.warn(`[WARN] Password mismatch for user: "${user.username}"`);
            throw new Error("Incorrect Password");
          }

        } catch (error: any) {
          console.error("[ERROR] Error during authorization process:", error);
          //NOTE 📝: Propagate error message to NextAuth
          throw new Error(error.message || "Authentication error occurred");
        }
      },
    })
  ],

  //NOTE 📝: NextAuth callbacks for custom JWT and Session mutation
  callbacks: {
    /**
     * Session callback that exposes database fields into the client session object.
     */
    async session({ session, token }) {
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
    signIn: '/signin',
  },

  session: {
    // Rely on JSON Web Tokens for session management
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
}
