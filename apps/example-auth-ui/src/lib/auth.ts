import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Re-export server-side utilities
export { getServerSession } from "./auth.server";

// Re-export server actions
export { signInAction } from "./signin";
export { signUpAction } from "./signup";
export { signOutAction } from "./signout";

// Re-export types
export type { AuthActionResult } from "./auth.types";

// OAuth providers
export type OAuthProvider = "github" | "google";

export interface EnabledProviders {
  emailPassword: boolean;
  github: boolean;
  google: boolean;
}

/**
 * Fetch enabled OAuth providers from the authentication service
 */
export async function getEnabledProviders(): Promise<EnabledProviders> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${apiUrl}/api/auth/providers`, {
      cache: "no-store", // Always fetch fresh to detect env var changes
    });

    if (!response.ok) {
      console.error("Failed to fetch providers:", response.statusText);
      return { emailPassword: true, github: false, google: false };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching providers:", error);
    return { emailPassword: true, github: false, google: false };
  }
}
