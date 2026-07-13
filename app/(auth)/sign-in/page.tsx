"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { signInSchema } from "@/schemas/signInSchema";

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    //todo hardcoded
    const result = await signIn("credentials", {
      redirect: false, //note: app mat karo redirect hum karlege
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("Sign in failed", {
        description: result.error,
      });
      return;
    }

    toast.success("Success", {
      description: "You have signed in successfully.",
    });

    router.replace("/dashboard");
  };

  /*    //if next auth was not above here then onSubmit look like

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  setIsSubmitting(true);

  try {
    const response = await axios.post<ApiResponse>(
      "/api/sign-up",
      data
    );

    toast({
      title: "Success",
      description: response.data.message,
    });

    router.replace(`/verify/${username}`);
  } catch (error) {
    console.error("Error in signup of user", error);

    const axiosError = error as AxiosError<ApiResponse>;

    toast({
      title: "Signup failed",
      description:
        axiosError.response?.data.message ?? "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
  
  */

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border border-border/60 bg-card/80 backdrop-blur-md shadow-xl rounded-2xl relative z-10">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Sign in to continue to True Feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="space-y-4">
              <Controller
                control={form.control}
                name="identifier"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email/UserName</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter your email or username"
                      aria-invalid={fieldState.invalid}
                      autoComplete="username"
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
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
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
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            Not a member yet?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-primary hover:underline transition-all"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
