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
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { studentCheckoutAction } from "@/lib/student-actions";
import { getBookByIdAction } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

interface CheckoutSuccess {
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

type CheckoutResult =
  | CheckoutSuccess
  | NotCheckedInError
  | NotReturnedBooksError
  | null;

// Define the Book type
export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  bar_code: string;
  shelf_no: string;
  isbn: string;
  status: boolean;
};

const token = localStorage.getItem("token");

export default function CheckOutComponent() {
  const [studentId, setStudentId] = useState("");
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult>(null);
  const [bookIds, setBookIds] = useState([] as string[]);

  const {
    mutate: studentCheckout,
    isLoading,
    isError,
    error,
    isSuccess: isDone,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      return studentCheckoutAction(token, studentId);
    },
    onSuccess: (data) => {
      setCheckoutResult(data);
      if ("borrowed_books" in data) {
        setBookIds(data.borrowed_books);
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        // Handle the error returned from the server action
        setCheckoutResult({ error: error.message });
      } else {
        // Handle unexpected errors
        setCheckoutResult({ error: "An unexpected error occurred" });
      }
    },
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutResult(null);
    studentCheckout();
  };

  const [books, setBooks] = useState<Book[]>([]);
  const [fetchError, setFetchError] = useState<string | null>("");
  let bookId = "";
  const [bookIndex, setBookIndex] = useState(0);

  const {
    mutate: fetchBook,
    isLoading: isBookFetching,
    isError: isBookFetchError,
    error: bookFetchError,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      return getBookByIdAction(token, bookId);
    },
    onSuccess: (data) => {
      setBooks((prev) => [...prev, data]);
      setFetchError(null);
    },
    onError: (error) => {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("An error occurred while fetching book");
      }
    },
  });

  useEffect(() => {
    if (bookIds.length > bookIndex) {
      bookId = bookIds[bookIndex];
      setBookIndex((prev) => prev + 1);
      fetchBook();
    }
    toast({ title: "Book fetched successfully" });
  }, [isSuccess, isDone]);

  const renderResult = (result: CheckoutResult) => {
    if (!result) {
      return <p className="text-center">No result</p>;
    }

    if ("data" in result && "message" in result && "user" in result) {
      const { data, message, user } = result as CheckoutSuccess;
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
              <p className="text-lg p-2">Checked Out</p>
            </div>
          </CardFooter>
        </div>
      );
    } else if ("error" in result && "borrowed_books" in result) {
      const { error, borrowed_books } = result as NotReturnedBooksError;

      return (
        <div>
          <p style={{ color: "red" }}>
            <strong>Error: </strong> {error}
          </p>
          <p className="flex flex-col gap-6">
            <strong>Borrowed Books: </strong>
            {books?.length != 0 &&
              books.map((book) => (
                <Card key={book.id}>
                  <CardHeader></CardHeader>
                  <CardContent className="flex items-center gap-4 pt-4 justify-between">
                    <div className="flex items-center gap-4">
                      <BookText className="w-32 h-28 text-primary" />
                      <div className="">
                        <CardTitle>{book.title}</CardTitle>
                        <CardDescription>{book.author}</CardDescription>
                        <CardDescription>
                          Shelf No: {book.shelf_no}
                        </CardDescription>
                        {/* <CardDescription>ISBN: {book.isbn}</CardDescription> */}
                        <CardDescription>{book.description}</CardDescription>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              ))}
            {isBookFetching && (
              <p>
                <Loader className="animate-spin" />
              </p>
            )}
          </p>
        </div>
      );
    } else if ("error" in result) {
      const { error } = result as NotCheckedInError;
      return (
        <p style={{ color: "red" }}>
          <strong>
            Error: Student has not checked in yet or does not exit in database
          </strong>
        </p>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <CardHeader>
          <form onSubmit={handleCheckout}>
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
                  "Check Out"
                )}
              </Button>
            </div>
          </form>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader></CardHeader>
        <CardContent>{renderResult(checkoutResult)}</CardContent>
      </Card>
    </div>
  );
}
