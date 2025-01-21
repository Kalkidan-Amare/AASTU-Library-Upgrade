"use client";

import * as React from "react";

import { BookText, Download, Loader } from "lucide-react";

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
import { useMutation, useQuery } from "@tanstack/react-query";
import { borrowBooksAction, getBookByIdAction } from "@/lib/actions";
import Barcode from "react-barcode";
import HistoryDialogue from "./history_dialogue";

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

const BookDialogue = ({
  children,
  bookId,
}: {
  children: React.ReactNode;
  bookId: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [bookData, setBookData] = React.useState<Book | null>(null);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

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
      setBookData(data);
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

  const handleFetchBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchError(null);
    fetchBook();
  };

  React.useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, []);

  const barcodeRef = React.useRef<HTMLDivElement>(null); // Ref to the div wrapping the barcode

  const downloadBarcode = React.useCallback(() => {
    if (!barcodeRef.current) {
      console.error("Barcode element is not available.");
      return;
    }

    let targetElement: HTMLCanvasElement | SVGSVGElement | null = null;
    const canvasElement = barcodeRef.current.querySelector('canvas');
    if (canvasElement) targetElement = canvasElement;
    const svgElement = barcodeRef.current.querySelector('svg');
    if (svgElement) targetElement = svgElement;

    if (!targetElement) {
      console.error('Could not find canvas or svg element within the Barcode.');
      return;
    }

    let dataUrl = "";
    let fileExtension = "";

    if (targetElement instanceof HTMLCanvasElement) {
        dataUrl = targetElement.toDataURL("image/png");
        fileExtension = "png";
    } else if (targetElement instanceof SVGSVGElement) {
        const svgData = new XMLSerializer().serializeToString(targetElement);
        dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
        fileExtension = "svg";
    }

    let downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `barcode.${fileExtension}`; // Correct file extension
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[50%] min-h-[50%] overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{bookData && bookData.title}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {isBookFetching && <Loader className="h-12 w-12 animate-spin" />}
          {fetchError && <p style={{ color: "red" }}>Error: {fetchError}</p>}
          {bookData && (
            <Card>
              <CardContent className="pt-4">
                <CardDescription>
                  <Label>Author: {bookData.author}</Label>
                </CardDescription>
                <CardDescription>
                  <Label>Description: {bookData.description}</Label>
                </CardDescription>
                <CardDescription>
                  <Label>Bar Code: {bookData.bar_code}</Label>
                </CardDescription>
                <CardDescription>
                  <Label>Shelf No: {bookData.shelf_no}</Label>
                </CardDescription>
                <CardDescription>
                  <Label>ISBN: {bookData.isbn}</Label>
                </CardDescription>
                <CardDescription>
                  <Label>
                    Status: {bookData.status ? "Available" : "Not Available"}
                  </Label>
                </CardDescription>
                <div ref={barcodeRef}>
                  <Barcode value={bookData.id} />
                </div>
                <div onClick={downloadBarcode} className="flex cursor-pointer">
                <Download className="mr-4"/> Download Barcode
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => setIsOpen(false)}>Close</Button>
                <HistoryDialogue bookId={bookId}>
                  <Button>View History</Button>
                </HistoryDialogue>
              </CardFooter>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDialogue;
