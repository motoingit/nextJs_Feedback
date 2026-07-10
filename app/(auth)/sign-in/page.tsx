"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to continue to True Feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="identifier"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email/Username</FieldLabel>
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

            <Button className="mt-6 w-full" type="submit">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Not a member yet?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
