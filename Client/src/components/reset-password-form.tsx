"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { resetPasswordAction } from "@/lib/actions";


export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [newpassword, setNewpassword] = useState("");
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async () => {
      return resetPasswordAction(localStorage.getItem("email"), value, newpassword);
    },
    onSuccess: (data) => {
      console.log("OTP verification successfull");
      localStorage.setItem("token", data.token);
      toast({
        title: "Password Reset Successfull",
        variant: "success",
      });
      router.push("/dashboard");
      //do whatever you want on successfull signup
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof Error) {
        // Handle the error returned from the server action
        if (error?.message) setErrorMessage(error.message);
      } else {
        // Handle unexpected errors
        setErrorMessage("An unexpected error occurred");
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    mutate();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome to AASTU Library</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your OTP send to your email and your new password
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="">OTP</Label>
                </div>
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={(value) => setValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">New Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : "Submit"}
              </Button>
              {(isError || errorMessage) && (
                <p className="text-red-500 text-sm italic">{errorMessage}</p>
              )}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground"></span>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/images/Auth_bg.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
