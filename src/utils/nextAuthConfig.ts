import {AuthOptions} from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials: any) {
          await connect();
          try {
            const user = await User.findOne({ email: credentials.email });
            if (user) {
              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              );
              if (isPasswordCorrect) {
                return user;
              }
            }
          } catch (err: any) {
            throw new Error(err);
          }
        },
      }),
      
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    callbacks: {
      // async signIn({ user, account }: { user: AuthUser; account: Account }) {
      //   if (account?.provider == "credentials") {
      //     return true;
      //   }
      // },
      // async jwt({ token, account }) {
      //   // Persist the OAuth access_token to the token right after signin
      //   console.log("token ========================== ",token, account);
      //   if (account) {
      //     token.accessToken = account.access_token
      //   }
      //   return token
      // },
      // async session({ session, token, user }) {
      //   console.log("token ========================== --- ",token, session);
      //   // Send properties to the client, like an access_token from a provider.
      //   session.accessToken = token.accessToken
      //   return session
      // }
    },
};