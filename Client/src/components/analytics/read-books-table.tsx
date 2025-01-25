"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "../ui/textarea";
import { readBooksAction } from "@/lib/student-actions";

// Define the Book type
export type ReadBook = {
  book: {
    id: string;
    title: string;
    description: string;
    bar_code: string;
    status: boolean;
    shelf_no: string;
    author: string;
  };
  borrow: {
    id: string;
    borrow_time: string;
    return_time: string;
    book_id: string;
    user_id: string;
  };
  student_id: string;
};

type IntervalCheckinsResult = ReadBook[] | null;

// Initial sample data
const initialRecord: ReadBook[] = [];

// Define the table columns
const columns: ColumnDef<ReadBook>[] = [
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
      <div className="font-medium">{row.original.book.title}</div>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => <div>{row.original.book.author}</div>,
  },
  {
    accessorKey: "borrow_time",
    header: "Borrow Time",
    cell: ({ row }) => <div>{row.original.borrow.borrow_time}</div>,
  },
  {
    accessorKey: "student_id",
    header: "Student ID",
    cell: ({ row }) => <div>{row.getValue('student_id')}</div>,
  },
];

const token = localStorage.getItem("token");

export default function ReadBooksTable() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkinResult, setCheckinResult] =
    useState<IntervalCheckinsResult | null>(null);

  const {
    mutate: fetchCheckins,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No auth token provided");
      }
      return readBooksAction(token, startDate, startTime, endDate, endTime);
    },
    onSuccess: (data) => {
      setCheckinResult(data);
      console.log(data);
      setErrorMessage("");
    },
    onError: (error) => {
      setCheckinResult(null);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    },
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: checkinResult ?? initialRecord,
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

  const handleFetchCheckins = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinResult(null);
    fetchCheckins();
  };
  const renderResult = (result: IntervalCheckinsResult) => {
    if (!result) return null;
    return (
      <div>
        <div className="w-full p-4">
          {/* Header Section */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 py-4">
            {/* Filter Input */}
            <div className="w-full md:w-auto flex gap-4">
              <Input
                placeholder="Filter record by Student Id..."
                value={
                  (table.getColumn("student_id")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("student_id")?.setFilterValue(event.target.value)
                }
                className="w-full md:w-[300px]"
              />
              <Label className="text-lg">Total: {result?.length}</Label>
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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleFetchCheckins} className="flex gap-4">
        <div className="">
          <Input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
          <Label className="h-16">Start Date</Label>
        </div>
        <div>
          <Input
            type="time"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-40"
          />
          <Label className="h-16"> Start Time</Label>
        </div>
        <div>
          <Input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
          <Label className="h-16"> End Date</Label>
        </div>
        <div>
          <Input
            type="time"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-40"
          />
          <Label className="h-16"> End Time</Label>
        </div>
        <Button type="submit" disabled={isLoading} className="w-40">
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            "Get read books"
          )}
        </Button>
        {isError && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
      {renderResult(checkinResult)}
    </div>
  );
}
