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
import { addBookAction, getBooksAction, updateBookAction } from "@/lib/actions";
import { Textarea } from "../ui/textarea";

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

const UpdateBookDialog = ({ onUpdateBook, bookData, children }: { onUpdateBook: () => void, bookData: any, children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const [newBook, setNewBook] = React.useState<Book>(bookData);
    const [isOpen, setIsOpen] = React.useState(false);
  
    const {
      mutate: updateBook,
      isLoading: isAdding,
      isError: isAddError,
      error: addError,
    } = useMutation({
      mutationFn: async () => {
        if (!token) {
          throw new Error("No auth token provided");
        }
        return updateBookAction(token, bookData.id, newBook);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["books"] });
        onUpdateBook();
        setIsOpen(false);
      },
    });
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateBook();
    };

    
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Book Title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Book Description"
                value={newBook.description}
                onChange={(e) =>
                  setNewBook({ ...newBook, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Author Name"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="shelf_no">Shelf No</Label>
              <Input
                id="shelf_no"
                placeholder="Shelf Number"
                value={newBook.shelf_no}
                onChange={(e) => setNewBook({ ...newBook, shelf_no: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="bar_code">Bar Code</Label>
              <Input
                id="bar_code"
                placeholder="Bar Code"
                value={newBook.bar_code}
                onChange={(e) => setNewBook({ ...newBook, bar_code: e.target.value })}
                required
              />
            </div>
            {/* <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                placeholder="ISBN Number"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                required
              />
            </div> */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={newBook.status ? "available" : "issued"}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    status: e.target.value == "available"? true: false,
                  })
                }
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="issued">Issued</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={isAdding}>
               {isAdding? <Loader className=" h-4 w-4 animate-spin" />: "Update Book"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

export default UpdateBookDialog;