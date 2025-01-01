"use client";

import { BooksBorrowedChart } from "../charts/books-borrowed-chart";
import { StudentAttendanceChart } from "../charts/student-attendance-chart";
import DashboardCards from "./dashboard-cards";

export default function Dashboard() {
  return (
    <div className="pt-4 flex flex-col gap-4">
      <DashboardCards />
      <StudentAttendanceChart />
      <BooksBorrowedChart />
    </div>
  );
}
