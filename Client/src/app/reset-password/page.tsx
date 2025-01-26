import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@/components/mode-toggle";
import { SignupForm } from "@/components/signup-form";
import { SignupOTPForm } from "@/components/signup-otp-form";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div>
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            <PanelsTopLeft className="w-6 h-6 mr-3" />
            <span className="font-bold">Library</span>
            <span className="sr-only">Library</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </nav>
        </div>
      </header>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
