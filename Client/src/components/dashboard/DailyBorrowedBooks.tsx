"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { intervalCheckInsAction, readBooksAction } from "@/lib/student-actions";
import { Loader } from "lucide-react";

interface Checkin {
  id: string;
  user_id: string;
  student_id: string;
  checkin_at: string;
  checkout_at: string;
}

interface IntervalCheckinsSuccess {
  data: Checkin[];
  message: string;
}


export default function DailyBorrowedBooks() {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    setCurrentDate(formattedDate);
    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentTime(formattedTime);
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dailyborrowedbooks", currentDate, currentTime],
    queryFn: async () => {
      if (!localStorage.getItem("token")) {
        throw new Error("No auth token provided");
      }
      return readBooksAction(
        localStorage.getItem("token"),
        currentDate,
        "00:00",
        currentDate,
        currentTime
      );
    },
    enabled: !!localStorage.getItem("token") && !!currentDate && !!currentTime,
  });

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  if (isError) {
    return <p style={{ color: "red" }}></p>;
  }

  return <div>{data?.length || 0}</div>;
}
