import { PrismaAdapter } from "@auth/prisma-adapter";
import { Prisma } from "@prisma/client";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prisma from "./connect";
import { getServerSession } from "next-auth";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    session: {
        strategy: "database",
    },
    callbacks: {
        async session({ session, token, user }) {
            if (session?.user && user) {
                session.user.id = user.id;
            }
            return session;
        },
        async jwt({ token, account }) {
            return token;
        },
        async signIn({ user, account, profile, email, credentials }) {
            console.log('SignIn callback:', { user: user?.email, account: account?.provider });
            return true;
        },
    },
    pages: {
        signIn: '/blog/login',
        error: '/blog/login', // Redirect errors back to login page
    },
    debug: process.env.NODE_ENV === 'development',
};

export const getAuthSession = () => getServerSession(authOptions);