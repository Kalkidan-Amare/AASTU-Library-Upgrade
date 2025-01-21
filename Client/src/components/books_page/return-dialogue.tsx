"use client";

import * as React from "react";

import { BookText, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { getBookByIdAction, returnBooksAction } from "@/lib/actions";
import { toast, useToast } from "@/hooks/use-toast"

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

const ReturnDialogue = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [books, setBooks] = React.useState<Book[]>([]);
  const [bookId, setBookId] = React.useState("");
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [borrowedBookIds, setBorrowedBookIds] = React.useState<string[]>([]);
  const [borrowError, setBorrowError] = React.useState<string | null>(null);

  const {
    mutate: fetchBook,
    isLoading: isBookFetching,
    isError: isBookFetchError,
    error: bookFetchError,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      if (!bookId) {
        throw new Error("Book id is required");
      }
      return getBookByIdAction(token, bookId);
    },
    onSuccess: (data) => {
      setBooks((prev) => [...prev, data]);
      setBorrowedBookIds((prev) => [...prev, data.id]);
      setBookId("");
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

  const {
    mutate: borrowBooks,
    isLoading: isBorrowing,
    isError: isBorrowError,
    error: borrowErrorMsg,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      if (!userId) {
        throw new Error("User id is required");
      }
      if (borrowedBookIds.length === 0) {
        throw new Error("Please select books to borrow");
      }
      return returnBooksAction(token, userId, borrowedBookIds);
    },
    onSuccess: () => {
      setBorrowError(null);
      setBorrowedBookIds([]);
      setBooks([]);
      toast({
        variant: "success",
        title: "Books returned successfully",
      })
      setIsOpen(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        setBorrowError(error.message);
        toast({
          variant: "destructive",
          title: error.message,
        })
      } else {
        setBorrowError("An error occurred while borrowing books");
      }
    },
  });

  const handleFetchBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchError(null);
    fetchBook();
  };

  const handleBorrowBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    setBorrowError(null);
    borrowBooks();
  };

  const handleSelectBook = (bookId: string, checked: boolean) => {
    if (checked) {
      setBorrowedBookIds((prev) => [...prev, bookId]);
    } else {
      setBorrowedBookIds((prev) => prev.filter((id) => id !== bookId));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[80%] min-h-[80%] overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Return Books</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFetchBook}>
          <Card>
            <CardHeader>
              <Label htmlFor="bookId" className="text-lg">
                Scan Book Id
              </Label>
              <div className="flex gap-4">
                <Input
                  id="bookId"
                  type="text"
                  placeholder="Scan"
                  className="w-48 bg-accent"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  required
                />
                <Button
                  className="w-24"
                  type="submit"
                  disabled={isBookFetching}
                >
                  {isBookFetching ? (
                    <Loader className="h-6 w-6 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardFooter>
              {fetchError && (
                <p style={{ color: "red" }}>Error: {fetchError}</p>
              )}
            </CardFooter>
          </Card>
        </form>
        <form onSubmit={handleBorrowBooks} className="space-y-4">
          {books.map((book) => (
            <Card key={book.id}>
              <CardHeader></CardHeader>
              <CardContent className="flex items-center gap-4 pt-4 justify-between">
                <div className="flex items-center gap-4">
                  <BookText className="w-32 h-28 text-primary" />
                  <div className="">
                    <CardTitle>{book.title}</CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                    <CardDescription>Shelf No: {book.shelf_no}</CardDescription>
                    {/* <CardDescription>ISBN: {book.isbn}</CardDescription> */}
                    <CardDescription>{book.description}</CardDescription>
                  </div>
                </div>
                <Input
                  type="checkbox"
                  checked={borrowedBookIds.includes(book.id)}
                  onChange={(e) => handleSelectBook(book.id, e.target.checked)}
                  className="w-32 cursor-pointer"
                />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          ))}
          <Button type="submit" className="w-full" disabled={isBorrowing}>
            {isBorrowing ? (
              <Loader className=" h-4 w-4 animate-spin" />
            ) : (
              "Return"
            )}
          </Button>
        </form>
        {borrowError && <p style={{ color: "red" }}>Error: {borrowError}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default ReturnDialogue;
