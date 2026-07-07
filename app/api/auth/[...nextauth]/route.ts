import NextAuth from "next-auth";
import { authOptions } from "./options";


const handler = NextAuth(authOptions);

//* WE does this as thing not work for normal naming
export {handler as GET, handler as POST};
