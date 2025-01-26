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
import { CircleCheckBig, Loader } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { studentCheckinAction } from "@/lib/student-actions";

interface CheckinSuccess {
  data: {
    id: string;
    user_id: string;
    student_id: string;
    checkin_at: string;
    checkout_at: string;
  };
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    student_id: string;
    password: string;
    role: string;
    borrowed_books: null;
    sex: string;
    department: string;
    entry_batch: string;
    img_url: string;
  };
}
interface NotCheckedInError {
  error: string;
}

interface NotReturnedBooksError {
  borrowed_books: string[];
  error: string;
}

type CheckinResult =
  | CheckinSuccess
  | NotCheckedInError
  | NotReturnedBooksError
  | null;

const token = localStorage.getItem("token");

export default function CheckInComponent() {
  const [studentId, setStudentId] = useState("");
  const [checkinResult, setCheckinResult] = useState<CheckinResult>(null);

  const {
    mutate: studentCheckin,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      return studentCheckinAction(token, studentId);
    },
    onSuccess: (data) => {
      setCheckinResult(data);
    },
    onError: (error) => {
      if (error instanceof Error) {
        // Handle the error returned from the server action
        setCheckinResult({ error: error.message });
      } else {
        // Handle unexpected errors
        setCheckinResult({ error: "An unexpected error occurred" });
      }
    },
  });

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinResult(null);
    studentCheckin();
  };


  

  const renderResult = (result: CheckinResult) => {
    if (!result) {
      return <p className="text-center">No result</p>;
    }

    if ("data" in result && "message" in result && "user" in result) {
      const { data, message, user } = result as CheckinSuccess;
      return (
        <div className="grid grid-cols-3">
          <div className="p-4">
            <Avatar className="w-48 h-48">
              <AvatarImage src={user.img_url} className="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="col-span-1 px-4 flex gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-lg h-6">Full Name</p>
              <p className="text-muted-foreground h-6">Id Number</p>
              <p className="text-muted-foreground h-6">Sex</p>
              <p className="text-muted-foreground h-6">Department</p>
              <p className="text-muted-foreground h-6">Entry Batch</p>
              <p className="text-muted-foreground h-6">Status</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold h-6">{user.username}</p>
              <p className="h-6">{user.student_id}</p>
              <p className="h-6">{user.sex}</p>
              <p className="h-6">{user.department}</p>
              <p className="h-6">{user.entry_batch}</p>
              <p className="h-6">Active</p>
            </div>
          </div>
          <CardFooter className="flex justify-end items-end">
            <div className="flex items-center">
              <CircleCheckBig className="text-green-500 mr-1" />
              <p className="text-lg p-2">Checked In</p>
            </div>
          </CardFooter>
        </div>
      );
    } else if ("error" in result && "borrowed_books" in result) {
      const { error, borrowed_books } = result as NotReturnedBooksError;
      return (
        <div>
          <p style={{ color: "red" }}>
            <strong>Error:</strong> {error}
          </p>
          <p>
            <strong>Borrowed Books:</strong> {borrowed_books.join(", ")}
          </p>
        </div>
      );
    } else if ("error" in result) {
      const { error } = result as NotCheckedInError;
      return (
        <p style={{ color: "red" }}>
          <strong> Error: Student has not checked out yet or does not exit in database </strong>
        </p>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <CardHeader>
          <form onSubmit={handleCheckin}>
            <Label htmlFor="id" className="text-lg">
              Scan Id
            </Label>
            <div className="flex gap-4">
              <Input
                id="id"
                type="text"
                placeholder="Scan"
                className="w-48 bg-accent"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
              <Button className="w-24" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader className=" w-6 h-6 animate-spin" />
                ) : (
                  "Check In"
                )}
              </Button>
            </div>
          </form>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader></CardHeader>
        <CardContent>{renderResult(checkinResult)}</CardContent>
      </Card>
    </div>
  );
}
