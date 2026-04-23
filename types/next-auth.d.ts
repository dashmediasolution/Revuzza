import type { DefaultSession, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's role. */
      role: string;
      /** The user's company ID. */
      companyId: string | null;
    } & DefaultSession["user"];
  }

  // The User object is the raw user data from the database
  // You can add properties to it that you want to be available in the `jwt` callback `user` parameter
  interface User {
    role?: string | null;
    companyId?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id. */
    id: string;
    /** The user's role. */
    role: string;
    /** The user's company ID. */
    companyId: string | null;
  }
}