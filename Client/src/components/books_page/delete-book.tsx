'use client';

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Plus, ChevronDown, Loader } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBookAction, deleteBookAction, getBooksAction, updateBookAction } from "@/lib/actions";

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

const DeleteBookDialogue = ({ onDeleteBook, bookId, children }: { onDeleteBook: () => void, bookId: string, children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = React.useState(false);
  
    const {
      mutate: deleteBook,
      isLoading: isDeleting,
      isError: isAddError,
      error: addError,
    } = useMutation({
      mutationFn: async () => {
        if (!token) {
          throw new Error("No auth token provided");
        }
        return deleteBookAction(token, bookId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["books"] });
        onDeleteBook();
        setIsOpen(false);
      },
    });
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      deleteBook();
    };

    
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p>Are you sure you want to delete this book?</p>
            <Button type="submit" className="w-full" disabled={isDeleting}>
               {isDeleting? <Loader className=" h-4 w-4 animate-spin" />: "Delete Book"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

export default DeleteBookDialogue;