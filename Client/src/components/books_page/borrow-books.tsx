"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookText, CircleCheckBig, Loader } from "lucide-react";
import BorrowDialogue from "./borrow-dialogue";
import { cn } from "@/lib/utils";
import ReturnDialogue from "./return-dialogue";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { studentAuthenticateAction } from "@/lib/student-actions";

interface AuthenticationSuccess {
  id: string;
  username: string;
  email: string;
  student_id: string;
  password: string;
  role: string;
  borrowed_books: null | string[];
}

type AuthenticationResult = AuthenticationSuccess | null;
const token = localStorage.getItem("token");

export default function BorrowBooks() {
  const [studentId, setStudentId] = useState("");
  const [authenticationResult, setAuthenticationResult] =
    useState<AuthenticationResult>(null);

  const {
    mutate: authenticateStudent,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      return studentAuthenticateAction(token, studentId);
    },
    onSuccess: (data) => {
      setAuthenticationResult(data);
    },
    onError: () => {
      setAuthenticationResult(null);
    },
  });

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticationResult(null);
    authenticateStudent();
  };
  const renderResult = (result: AuthenticationResult) => {
    if (!result) return null;
    return (
      <Card>
        <CardHeader className={cn(" gap-4 flex-row items-center space-y-0")}>
          <BorrowDialogue userId={result.id}>
            <Button className="w-24">Borrow</Button>
          </BorrowDialogue>
          <ReturnDialogue userId={result.id}>
            <Button className="w-24">Return</Button>
          </ReturnDialogue>
        </CardHeader>
        <CardContent className="grid grid-cols-3">
          <div className="p-4">
            <Avatar className="w-48 h-48">
              <AvatarImage src="https://github.com/shadcn.png" className="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="col-span-2 px-4 flex gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-lg h-6">Full Name</p>
              <p className="text-muted-foreground h-6">Id Number</p>
              <p className="text-muted-foreground h-6">Sex</p>
              <p className="text-muted-foreground h-6">Department</p>
              <p className="text-muted-foreground h-6">Entry Batch</p>
              <p className="text-muted-foreground h-6">Status</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold h-6">Kalkidan Amare</p>
              <p className="h-6">{result.student_id}</p>
              <p className="h-6">Male</p>
              <p className="h-6">Software Engineering</p>
              <p className="h-6">2014</p>
              <p className="h-6">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <CardHeader>
          <form onSubmit={handleAuthenticate}>
            <Label htmlFor="id" className="text-lg">
              Scan Id
            </Label>
            <div className="flex gap-4">
              <Input
                id="id"
                type="text"
                placeholder="Student Id"
                className="w-48 bg-accent"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
              <Button className="w-24" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </form>
        </CardHeader>
      </Card>
      {renderResult(authenticationResult)}
    </div>
  );
}
