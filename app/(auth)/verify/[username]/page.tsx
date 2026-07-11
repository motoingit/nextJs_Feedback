"use client";

import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { verifySchema } from "@/schemas/verifyCodeSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

export default function VerifyAccount() {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    //log for
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });

    try {
      const res = await axios.post(`/api/verify-code`, {
        username,
        code: data.code,
      });

      toast.success("Success", {
        description: res.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("ERROR; Error in verification of User", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const description =
        axiosError.response?.data.messages
          ?.map((message) => message.content)
          .join(", ") ??
        axiosError.response?.data.message ??
        "Verification failed";

      toast.error("Error", {
        description,
      });
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
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Enter the verification code sent to your email.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Verification Code
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter your verification code"
                      aria-invalid={fieldState.invalid}
                      autoComplete="one-time-code"
                      inputMode="numeric"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex items-center gap-3 pb-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              className="flex-[2] font-bold shadow-lg hover:shadow-primary/10 transition-all duration-300"
              type="submit"
            >
              Verify
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
