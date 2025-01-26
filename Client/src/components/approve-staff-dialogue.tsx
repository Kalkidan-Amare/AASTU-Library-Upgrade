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
import { addBookAction, approveAction, getBooksAction, updateBookAction } from "@/lib/actions";

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

export type Staff = {
    id: string;
    username: string;
    email: string;
    student_id: string;
    password: string;
    role: string;
    borrowed_books: string[];
    is_checked_in: boolean;
    approved: boolean;
  };

const token = localStorage.getItem("token");

const ApproveStaffDialog = ({ onUpdateBook, bookData, children }: { onUpdateBook: () => void, bookData: any, children: React.ReactNode }) => {
    const queryClient = useQueryClient();
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
        return approveAction(token, bookData.id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["staffs"] });
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
            <DialogTitle>Approve Staff</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">This user will be accepted to the system after approval</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isAdding}>
               {isAdding? <Loader className=" h-4 w-4 animate-spin" />: "Approve"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

export default ApproveStaffDialog;