import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/check-email",
  },
  providers: [
    CredentialsProvider({
      id: "magic-link",
      name: "Magic Link",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) {
          throw new Error("Missing token");
        }

        // Find user with this magic link token
        const user = await prisma.user.findFirst({
          where: {
            magicLinkToken: credentials.token,
            magicLinkExpires: {
              gt: new Date(),
            },
          },
        });

        if (!user) {
          throw new Error("Invalid or expired login link");
        }

        // Clear the magic link token (one-time use)
        await prisma.user.update({
          where: { id: user.id },
          data: {
            magicLinkToken: null,
            magicLinkExpires: null,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
