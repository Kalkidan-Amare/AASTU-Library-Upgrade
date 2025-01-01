// "use client";

// import * as React from "react";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // Sample data for books
// const books: Book[] = [
//   {
//     id: "1",
//     title: "Dynamics 2",
//     author: "F. Scott Fitzgerald",
//     isbn: "9780743273565",
//     status: "available",
//   },
//   {
//     id: "2",
//     title: "College Physics",
//     author: "Harper Lee",
//     isbn: "9780061120084",
//     status: "issued",
//   },
//   {
//     id: "3",
//     title: "Intermediate Mathematics",
//     author: "George Orwell",
//     isbn: "9780451524935",
//     status: "available",
//   },
//   {
//     id: "4",
//     title: "Applied Statistics",
//     author: "Herman Melville",
//     isbn: "9781503280786",
//     status: "issued",
//   },
// ];

// export type Book = {
//   id: string;
//   title: string;
//   author: string;
//   isbn: string;
//   status: "available" | "issued";
// };

// // Column definitions
// export const columns: ColumnDef<Book>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "title",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Title <ArrowUpDown />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="font-medium">{row.getValue("title")}</div>
//     ),
//   },
//   {
//     accessorKey: "author",
//     header: "Author",
//     cell: ({ row }) => <div>{row.getValue("author")}</div>,
//   },
//   {
//     accessorKey: "isbn",
//     header: "ISBN",
//     cell: ({ row }) => <div>{row.getValue("isbn")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div
//         className={`capitalize ${
//           row.getValue("status") === "available"
//             ? "text-green-600"
//             : "text-red-600"
//         }`}
//       >
//         {row.getValue("status")}
//       </div>
//     ),
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const book = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(book.id)}
//             >
//               Copy book ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Edit book</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// export function ViewAllBooks() {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   const table = useReactTable({
//     data: books,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="w-full">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Filter titles..."
//           value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("title")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDown />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => {
//                 return (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     className="capitalize"
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) =>
//                       column.toggleVisibility(!!value)
//                     }
//                   >
//                     {column.id}
//                   </DropdownMenuCheckboxItem>
//                 );
//               })}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
















// "use client";

// import * as React from "react";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, Plus } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // Define the Book type
// export type Book = {
//   id: string;
//   title: string;
//   author: string;
//   isbn: string;
//   status: "available" | "issued";
// };

// // Initial sample data
// const initialBooks: Book[] = [
//   {
//     id: "1",
//     title: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     isbn: "9780743273565",
//     status: "available",
//   },
//   {
//     id: "2",
//     title: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     isbn: "9780061120084",
//     status: "issued",
//   },
//   {
//     id: "3",
//     title: "1984",
//     author: "George Orwell",
//     isbn: "9780451524935",
//     status: "available",
//   },
//   {
//     id: "4",
//     title: "Moby Dick",
//     author: "Herman Melville",
//     isbn: "9781503280786",
//     status: "issued",
//   },
// ];

// // Define the table columns
// const columns: ColumnDef<Book>[] = [
//   {
//     accessorKey: "title",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Title <ArrowUpDown />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="font-medium">{row.getValue("title")}</div>
//     ),
//   },
//   {
//     accessorKey: "author",
//     header: "Author",
//     cell: ({ row }) => <div>{row.getValue("author")}</div>,
//   },
//   {
//     accessorKey: "isbn",
//     header: "ISBN",
//     cell: ({ row }) => <div>{row.getValue("isbn")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div
//         className={`capitalize ${
//           row.getValue("status") === "available"
//             ? "text-green-600"
//             : "text-red-600"
//         }`}
//       >
//         {row.getValue("status")}
//       </div>
//     ),
//   },
// ];

// export function ViewAllBooks() {
//   const [books, setBooks] = React.useState<Book[]>(initialBooks);
//   const [newBook, setNewBook] = React.useState<Book>({
//     id: "",
//     title: "",
//     author: "",
//     isbn: "",
//     status: "available", // Default status
//   });

//   const table = useReactTable({
//     data: books,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const handleAddBook = () => {
//     const updatedBooks = [
//       ...books,
//       { ...newBook, id: `${books.length + 1}` }, // Generate unique ID
//     ];
//     setBooks(updatedBooks);
//     setNewBook({
//       id: "",
//       title: "",
//       author: "",
//       isbn: "",
//       status: "available",
//     }); // Reset form
//   };

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between py-4">
//         <h1 className="text-lg font-semibold">Library Books</h1>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" /> Add Book
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add a New Book</DialogTitle>
//             </DialogHeader>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddBook();
//               }}
//               className="space-y-4"
//             >
//               <div>
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                   id="title"
//                   placeholder="Book Title"
//                   value={newBook.title}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, title: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="author">Author</Label>
//                 <Input
//                   id="author"
//                   placeholder="Author Name"
//                   value={newBook.author}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, author: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="isbn">ISBN</Label>
//                 <Input
//                   id="isbn"
//                   placeholder="ISBN Number"
//                   value={newBook.isbn}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, isbn: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <select
//                   id="status"
//                   value={newBook.status}
//                   onChange={(e) =>
//                     setNewBook({
//                       ...newBook,
//                       status: e.target.value as "available" | "issued",
//                     })
//                   }
//                   className="w-full rounded-md border px-3 py-2"
//                 >
//                   <option value="available">Available</option>
//                   <option value="issued">Issued</option>
//                 </select>
//               </div>
//               <Button type="submit" className="w-full">
//                 Add Book
//               </Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }











// "use client";

// import * as React from "react";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   useReactTable,
//   SortingState,
//   ColumnFiltersState,
//   VisibilityState,
// } from "@tanstack/react-table";
// import { ArrowUpDown, Plus, ChevronDown } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // Define the Book type
// export type Book = {
//   id: string;
//   title: string;
//   author: string;
//   isbn: string;
//   status: "available" | "issued";
// };

// // Initial sample data
// const initialBooks: Book[] = [
//   {
//     id: "1",
//     title: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     isbn: "9780743273565",
//     status: "available",
//   },
//   {
//     id: "2",
//     title: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     isbn: "9780061120084",
//     status: "issued",
//   },
//   {
//     id: "3",
//     title: "1984",
//     author: "George Orwell",
//     isbn: "9780451524935",
//     status: "available",
//   },
//   {
//     id: "4",
//     title: "Moby Dick",
//     author: "Herman Melville",
//     isbn: "9781503280786",
//     status: "issued",
//   },
// ];

// // Define the table columns
// const columns: ColumnDef<Book>[] = [
//   {
//     accessorKey: "title",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Title <ArrowUpDown />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="font-medium">{row.getValue("title")}</div>
//     ),
//   },
//   {
//     accessorKey: "author",
//     header: "Author",
//     cell: ({ row }) => <div>{row.getValue("author")}</div>,
//   },
//   {
//     accessorKey: "isbn",
//     header: "ISBN",
//     cell: ({ row }) => <div>{row.getValue("isbn")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div
//         className={`capitalize ${
//           row.getValue("status") === "available"
//             ? "text-green-600"
//             : "text-red-600"
//         }`}
//       >
//         {row.getValue("status")}
//       </div>
//     ),
//   },
// ];

// export function ViewAllBooks() {
//   const [books, setBooks] = React.useState<Book[]>(initialBooks);
//   const [newBook, setNewBook] = React.useState<Book>({
//     id: "",
//     title: "",
//     author: "",
//     isbn: "",
//     status: "available", // Default status
//   });

//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   const table = useReactTable({
//     data: books,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   const handleAddBook = () => {
//     const updatedBooks = [
//       ...books,
//       { ...newBook, id: `${books.length + 1}` }, // Generate unique ID
//     ];
//     setBooks(updatedBooks);
//     setNewBook({
//       id: "",
//       title: "",
//       author: "",
//       isbn: "",
//       status: "available",
//     }); // Reset form
//   };

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between py-4">
//         <Input
//           placeholder="Filter books by title..."
//           value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("title")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDown />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table.getAllColumns().map((column) => (
//               <DropdownMenuCheckboxItem
//                 key={column.id}
//                 className="capitalize"
//                 checked={column.getIsVisible()}
//                 onCheckedChange={(value) => column.toggleVisibility(!!value)}
//               >
//                 {column.id}
//               </DropdownMenuCheckboxItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" /> Add Book
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add a New Book</DialogTitle>
//             </DialogHeader>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddBook();
//               }}
//               className="space-y-4"
//             >
//               <div>
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                   id="title"
//                   placeholder="Book Title"
//                   value={newBook.title}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, title: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="author">Author</Label>
//                 <Input
//                   id="author"
//                   placeholder="Author Name"
//                   value={newBook.author}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, author: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="isbn">ISBN</Label>
//                 <Input
//                   id="isbn"
//                   placeholder="ISBN Number"
//                   value={newBook.isbn}
//                   onChange={(e) =>
//                     setNewBook({ ...newBook, isbn: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <select
//                   id="status"
//                   value={newBook.status}
//                   onChange={(e) =>
//                     setNewBook({
//                       ...newBook,
//                       status: e.target.value as "available" | "issued",
//                     })
//                   }
//                   className="w-full rounded-md border px-3 py-2"
//                 >
//                   <option value="available">Available</option>
//                   <option value="issued">Issued</option>
//                 </select>
//               </div>
//               <Button type="submit" className="w-full">
//                 Add Book
//               </Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }













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
import { ArrowUpDown, Plus, ChevronDown } from "lucide-react";

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

// Define the Book type
export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: "available" | "issued";
};

// Initial sample data
const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    status: "available",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    status: "issued",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    status: "available",
  },
  {
    id: "4",
    title: "Moby Dick",
    author: "Herman Melville",
    isbn: "9781503280786",
    status: "issued",
  },
];

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
          row.getValue("status") === "available"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {row.getValue("status")}
      </div>
    ),
  },
];

// Reusable Add Book Dialog Component
const AddBookDialog = ({ onAddBook }: { onAddBook: (book: Book) => void }) => {
  const [newBook, setNewBook] = React.useState<Book>({
    id: "",
    title: "",
    author: "",
    isbn: "",
    status: "available",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBook({ ...newBook, id: `${Math.random().toString(36).substr(2, 9)}` });
    setNewBook({
      id: "",
      title: "",
      author: "",
      isbn: "",
      status: "available",
    });
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
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              placeholder="ISBN Number"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={newBook.status}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  status: e.target.value as "available" | "issued",
                })
              }
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="issued">Issued</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            Add Book
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export function ViewAllBooks() {
  const [books, setBooks] = React.useState<Book[]>(initialBooks);
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

  const handleAddBook = (book: Book) => {
    setBooks([...books, book]);
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
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