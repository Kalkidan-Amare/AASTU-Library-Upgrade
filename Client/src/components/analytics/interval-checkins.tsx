"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { intervalCheckInsAction } from "@/lib/student-actions";

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

type IntervalCheckinsResult = IntervalCheckinsSuccess | null;

const token = localStorage.getItem("token");

export default function IntervalCheckins() {
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
      return intervalCheckInsAction(
        token,
        startDate,
        startTime,
        endDate,
        endTime
      );
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

  const handleFetchCheckins = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinResult(null);
    fetchCheckins();
  };
  const renderResult = (result: IntervalCheckinsResult) => {
    if (!result) return null;
    return (
      <div>
        <p>
          <strong>Message:</strong> {result.message}
        </p>
        <ul>
          {result.data && result.data.map((checkin) => (
            <li key={checkin.id}>
              <p>
                <strong>Student ID:</strong> {checkin.student_id}
              </p>
              <p>
                <strong>Check-in Time:</strong> {checkin.checkin_at}
              </p>
              <p>
                <strong>Check-out Time:</strong> {checkin.checkout_at}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>Interval Check-ins</h2>
      <form onSubmit={handleFetchCheckins}>
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="time"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="time"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          Fetch Check-ins
        </button>
        {isError && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
      {renderResult(checkinResult)}
    </div>
  );
}
