import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
console.log("GITHUB_APP_CLIENT_ID:", process.env.GITHUB_APP_CLIENT_ID);
console.log("GITHUB_APP_CLIENT_SECRET:", process.env.GITHUB_APP_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
    }),
  ],
};
