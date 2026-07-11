"use client";

import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcn/field";

import { Input } from "@/components/shadcn/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";

/**
 * SignUpForm component - handles new user registration layout and validation.
 */
export default function SignUpForm() {
  //NOTE 📝: Component State definitions
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 600);

  const router = useRouter();

  //NOTE 📝: Form validation initialization using React Hook Form and Zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //NOTE 📝: Effect hook to check if username is unique dynamically after debounce
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  //NOTE 📝: Form submission handler to register the user
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      if (response.data.success) {
        toast.success("Success", {
          description: response.data.message,
        });
        router.replace(`/verify/${data.username}`);
      } else {
        toast.error("Sign up failed", {
          description: response.data.message || "Failed to register user.",
        });
        //TODO
        //WARN ⚠️: Refresh page state on failure
        router.refresh();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Sign up failed", {
        description:
          axiosError.response?.data.message ?? "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border border-border/60 bg-card/80 backdrop-blur-md shadow-xl rounded-2xl relative z-10">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Sign up to start receiving anonymous feedback.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="space-y-4">
              <Controller
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <div className="relative flex flex-col gap-1">
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Enter your username"
                        autoComplete="username"
                        aria-invalid={fieldState.invalid}
                        onChange={(event) => {
                          field.onChange(event);
                          debounced(event.target.value);
                        }}
                      />

                      {isCheckingUsername && (
                        <div className="absolute right-3 top-2 flex items-center">
                          <Loader2 className="animate-spin size-4 text-primary" />
                        </div>
                      )}

                      {usernameMessage && (
                        <p
                          className={`text-xs font-semibold mt-1 px-0.5 ${
                            usernameMessage === "Username is unique"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                    </div>

                    <FieldDescription>
                      This is your public display name.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              className="mt-6 w-full font-bold shadow-lg hover:shadow-primary/10 transition-all duration-300"
              type="submit"
              disabled={isSubmitting || isCheckingUsername}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin size-4" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-primary hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
