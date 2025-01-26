interface Book {
    id: string;
    title: string;
    description: string;
    bar_code: string;
    status: boolean;
    shelf_no: string;
    author: string;
  }
  
  export function countAvailableBooks(books: Book[] | null): number {
    if (!books || books.length === 0) {
      return 0;
    }
    return books.reduce((count, book) => (book.status ? count + 1 : count), 0);
  }