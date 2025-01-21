"use client";

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
import {
  ArrowUpDown,
  Plus,
  ChevronDown,
  Loader,
  Pencil,
  Trash2,
  ListMinus,
} from "lucide-react";

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
import { addBookAction, getBooksAction } from "@/lib/actions";
import UpdateBookDialog from "./update-book";
import DeleteBookDialogue from "./delete-book";
import { Textarea } from "../ui/textarea";
import BookDialogue from "./book_dialogue";

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

// Initial sample data
const initialBooks: Book[] = [];

// Define the table columns
const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => <div>{row.getValue("author")}</div>,
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
    cell: ({ row }) => <div>{row.getValue("isbn")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`capitalize ${
          row.getValue("status") === true ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.getValue("status") ? "Available" : "Issued"}
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="text-primary cursor-pointer">
        <UpdateBookDialog onUpdateBook={() => {}} bookData={row.original}>
          <Pencil />
        </UpdateBookDialog>
      </div>
    ),
  },
];

const token = localStorage.getItem("token");

// Reusable Add Book Dialog Component
const AddBookDialog = ({ onAddBook }: { onAddBook: () => void }) => {
  const queryClient = useQueryClient();
  const [newBook, setNewBook] = React.useState<Book>({
    id: "",
    title: "",
    author: "",
    description: "",
    bar_code: "",
    shelf_no: "",
    isbn: "",
    status: true,
  });

  const {
    mutate: addBook,
    isLoading: isAdding,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      return addBookAction(token, newBook);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setNewBook({
        id: "",
        title: "",
        author: "",
        description: "",
        bar_code: "",
        shelf_no: "",
        isbn: "",
        status: true,
      });
      onAddBook();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBook();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Book
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
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
              onChange={(e) =>
                setNewBook({ ...newBook, shelf_no: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="bar_code">Bar Code</Label>
            <Input
              id="bar_code"
              placeholder="Bar Code"
              value={newBook.bar_code}
              onChange={(e) =>
                setNewBook({ ...newBook, bar_code: e.target.value })
              }
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
                  status: e.target.value == "available" ? true : false,
                })
              }
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="issued">Issued</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isAdding}>
            {isAdding ? (
              <Loader className=" h-4 w-4 animate-spin" />
            ) : (
              "Add Book"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export function ViewAllBooks() {
  const [books, setBooks] = React.useState<Book[]>(initialBooks);

  const { data, isLoading, isError, error, isFetched, refetch, isRefetching } =
    useQuery({
      queryKey: ["books"],
      queryFn: async () => {
        return getBooksAction(token);
      },
      enabled: !!token,
      staleTime: 0,
    });

  React.useEffect(() => {
    if (isFetched && !isRefetching) {
      setBooks(data);
      console.log(data);
    }
  }, [isFetched, isRefetching]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: books,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddBook = () => {
    refetch();
  };

  return (
    <div className="w-full p-4">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 py-4">
        {/* Filter Input */}
        <div className="w-full md:w-auto">
          <Input
            placeholder="Filter books by title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="w-full md:w-[300px]"
          />
        </div>

        {/* Columns Dropdown and Add Book Button */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddBookDialog onAddBook={handleAddBook} />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                  <BookDialogue bookId={row.original.id}>
                  <ListMinus className="cursor-pointer"/>
                  </BookDialogue>

                  </TableCell>
                  <DeleteBookDialogue
                    onDeleteBook={() => refetch()}
                    bookId={row.original.id}
                  >
                    <Trash2 className="text-red-500 cursor-pointer" />
                  </DeleteBookDialogue>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center flex justify-center items-center"
                >
                  {isLoading ? (
                    <Loader className="h-6 w-6 animate-spin" />
                  ) : (
                    "No results"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
