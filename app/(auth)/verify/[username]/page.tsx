"use client";

import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import chalk from "chalk";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
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
    })

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
      console.error(chalk.red("[ERROR]: Error in verification of User"), error);

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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        {/* //NOTE: HEADER FORM */}
        <CardHeader>
          <CardTitle>Verify Your Account</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email.
          </CardDescription>
        </CardHeader>

        {/* //NOTE: Body FORM */}
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* //REMINDER: name is the input associated */}
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
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            {/*
            //NOTE: SEE THIS FIRST .reset()
            */}
            <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
            <Button className="mt-6 w-full" type="submit">
                Verify
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
