import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


//* This consist of Unoptimised thing and optimesed thing
// https://youtu.be/sijpPYDWBg4?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&t=2600

/** NextAuth configuration.
 *
 * Handles:
 * - Credentials authentication
 * - JWT generation
 * - Session customization
 * - Custom authentication pages
*/
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        // Maps the credentials fields. 'identifier' can be email or username
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      /** Authorization callback that validates the user's credentials.
       * 
       * @param credentials - User credentials passed from the sign-in form.
       * @returns The user object if authentication succeeds, otherwise throws an error.
       */
      async authorize(credentials: any): Promise<any> {
        console.log(`[status-log]: LogString > 🔐 [Auth Flow] Authorization request initiated for identifier: "${credentials?.identifier}"`);
        
        try {
          // Connect to the database before querying the user
          await dbConnect();
          
          //* Look up user by email or username - Future Proff
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ]
          });

          if (!user) {
            console.warn(`[status-log]: LogString > ⚠️ [Auth Flow] User not found for identifier: "${credentials.identifier}"`);
            throw new Error("No User Found with this Email or Username");
          }
          
          // Verify email verification status
          if (!user.isVerified) {
            console.warn(`[status-log]: LogString > ⚠️ [Auth Flow] User is not verified: "${credentials.identifier}"`);
            throw new Error("Please verify your account first");
          }

          // Compare the candidate password with the stored hash
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordCorrect) {
            console.log(`[info-log]: LogString > ✅ [Auth Flow] Successfully authenticated user: "${user.username}" (ID: ${user._id})`);
            return user;
          } else {
            console.warn(`[warning-log]: LogString > ⚠️ [Auth Flow] Password mismatch for user: "${user.username}"`);
            throw new Error("Incorrect Password");
          }

        } catch (error: any) {
          console.error(`[error-log]: LogString > ❌ [Auth Flow] Error during authorization process:`, error);
          // Throw the error message directly so NextAuth displays it correctly
          throw new Error(error.message || "Authentication error occurred");
        }
      },
    })
  ],

  //! abhi tho maine callbaks mai jugad kara hai copy-copy
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

  secret: process.env.NEXTAUTH_SECRET_KEY,
}
