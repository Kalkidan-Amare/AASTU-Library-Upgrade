"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { getBooksAction } from "@/lib/actions";
import { countAvailableBooks } from "@/lib/countAvailableBooks";

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


export default function AvailableBooksCount() {


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["availableBooks"],
    queryFn: async () => {
      if (!localStorage.getItem("token")) {
        throw new Error("No auth token provided");
      }
      return getBooksAction(localStorage.getItem("token"));
    },
    enabled: !!localStorage.getItem("token"),
  });

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  if (isError) {
    return <p style={{ color: "red" }}></p>;
  }

  return <div>{countAvailableBooks(data) || 0}</div>;
}
