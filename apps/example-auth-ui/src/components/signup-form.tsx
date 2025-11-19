"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  signUpAction,
  type AuthActionResult,
  authClient,
  getEnabledProviders,
  type EnabledProviders,
} from "@/lib/auth";

const initialState: AuthActionResult = {
  success: false,
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Signing up..." : "Sign Up"}
    </button>
  );
}

function OAuthButton({
  provider,
  onClick,
  disabled,
}: {
  provider: "github" | "google";
  onClick: () => void;
  disabled: boolean;
}) {
  const providerConfig = {
    github: {
      name: "GitHub",
      icon: "🐙",
      className: "bg-gray-800 hover:bg-gray-900 text-white",
    },
    google: {
      name: "Google",
      icon: "🔍",
      className:
        "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300",
    },
  };

  const config = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${config.className}`}
    >
      <span>{config.icon}</span>
      <span>Continue with {config.name}</span>
    </button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const [providers, setProviders] = useState<EnabledProviders | null>(null);
  const [oAuthLoading, setOAuthLoading] = useState<string | null>(null);

  useEffect(() => {
    getEnabledProviders().then(setProviders);
  }, []);

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setOAuthLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setOAuthLoading(null);
    }
  };

  const hasOAuthProviders = providers?.github || providers?.google;

  return (
    <div className="space-y-4">
      {/* OAuth Providers */}
      {hasOAuthProviders && (
        <div className="space-y-3">
          {providers?.github && (
            <OAuthButton
              provider="github"
              onClick={() => handleOAuthSignIn("github")}
              disabled={oAuthLoading !== null}
            />
          )}
          {providers?.google && (
            <OAuthButton
              provider="google"
              onClick={() => handleOAuthSignIn("google")}
              disabled={oAuthLoading !== null}
            />
          )}
        </div>
      )}

      {/* Divider */}
      {hasOAuthProviders && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>
      )}

      {/* Email/Password Form */}
      <form action={formAction} className="space-y-4">
        {state && !state.success && state.error && (
          <div className="p-3 bg-red-100 text-red-700 rounded" role="alert">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            aria-invalid={
              state && !state.success && state.fieldErrors?.name
                ? "true"
                : "false"
            }
            aria-describedby={
              state && !state.success && state.fieldErrors?.name
                ? "name-error"
                : undefined
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              state && !state.success && state.fieldErrors?.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {state && !state.success && state.fieldErrors?.name && (
            <p
              id="name-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-invalid={
              state && !state.success && state.fieldErrors?.email
                ? "true"
                : "false"
            }
            aria-describedby={
              state && !state.success && state.fieldErrors?.email
                ? "email-error"
                : undefined
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              state && !state.success && state.fieldErrors?.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {state && !state.success && state.fieldErrors?.email && (
            <p
              id="email-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            aria-invalid={
              state && !state.success && state.fieldErrors?.password
                ? "true"
                : "false"
            }
            aria-describedby={
              state && !state.success && state.fieldErrors?.password
                ? "password-error"
                : undefined
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              state && !state.success && state.fieldErrors?.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {state && !state.success && state.fieldErrors?.password && (
            <p
              id="password-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <SubmitButton />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
