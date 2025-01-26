interface BorrowedBook {
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
    user: {
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
  }
  
  
  interface ChartData {
    date: string;
    day: number;
    night: number;
  }
  
  export function transformBorrowedBooksData(
    borrowedBooksData: BorrowedBook[] | null
  ): ChartData[] {
      if (!borrowedBooksData || borrowedBooksData.length === 0) {
          return [];
        }
  
    const groupedData: { [date: string]: { day: number; night: number } } = {};
  
    borrowedBooksData.forEach((borrowedBook) => {
      const borrowTime = borrowedBook.borrow.borrow_time;
        const borrowDate = borrowTime.split(" ")[0];
        const borrowTimePortion = borrowTime.split(" ")[1]
      if (!groupedData[borrowDate]) {
        groupedData[borrowDate] = { day: 0, night: 0 };
          }
        const borrowHour = parseInt(borrowTimePortion.split(":")[0]);
  
      if (borrowHour >= 6 && borrowHour < 18) {
        groupedData[borrowDate].day++;
      } else {
          groupedData[borrowDate].night++;
      }
    });
  
      const chartData: ChartData[] = Object.entries(groupedData).map(
        ([date, counts]) => ({
          date,
          day: counts.day,
          night: counts.night,
        })
      );
  
  
      return chartData
  }