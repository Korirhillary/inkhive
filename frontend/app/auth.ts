import { signInSchema } from "@/lib/zod";
import NextAuth, { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError } from "zod";

const isDev = process.env.ENV === "local" || process.env.ENV === "dev";
const isLive = process.env.ENV === "stage" || process.env.ENV === "prod";

export const authOptions: NextAuthConfig = {
  debug: isDev,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        try {
          const { username, password } = await signInSchema.parseAsync(
            credentials
          );

          const response = await fetch(`${process.env.API_URL}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body: `username=${username}&password=${password}`,
          });

          const data = await response.json();

          if (!response.ok || !data.user) {
            console.log("failed to login", data);
            return null;
          }

          return {
            id: data.user.id,
            ...data.user,
            accessToken: data.access_token,
          };
        } catch (error) {
          if (isDev) {
            console.error("Auth error:", error);
          }
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        delete user.accessToken;
        token.user = user;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: isLive
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isLive,
      },
    },
  },
};

export default NextAuth(authOptions);

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
