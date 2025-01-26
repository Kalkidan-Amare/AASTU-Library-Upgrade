"use server";

export async function studentCheckoutAction(token: string, studentId: string) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + `/checkin/checkout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: studentId }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      // if the server sends a non 2xx code, that means the checkout wasn't successfull
      throw new Error(data.message || data.error || "Student checkout failed");
    }

    return data;
  } catch (error: any) {
    console.error("Error during checkout:", error);
    throw new Error(error.message || "An error occurred during checkout");
  }
}

export async function studentCheckinAction(token: string, studentId: string) {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/checkin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_id: studentId }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Check-in failed");
    }

    return data;
  } catch (error: any) {
    console.error("Error during check-in:", error);
    throw new Error(error.message || "An error occurred during check-in");
  }
}

export async function studentAuthenticateAction(
  token: string,
  studentId: string
) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + `/users/authenticate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: studentId }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Authentication failed");
    }

    return data;
  } catch (error: any) {
    console.error("Error during authentication:", error);
    throw new Error(error.message || "An error occurred during authentication");
  }
}

export async function intervalCheckInsAction(
  token: string | null,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + `/checkin/interval-checkins`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch check-ins");
    }
    return data;
  } catch (error: any) {
    console.error("Error during interval check-in fetch:", error);
    throw new Error(
      error.message || "An error occurred during interval check-in fetch"
    );
  }
}

export async function notReadBooksAction(
  token: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + `/books/not-read-books`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch read books");
    }
    return data;
  } catch (error: any) {
    console.error("Error during read books fetch:", error);
    throw new Error(
      error.message || "An error occurred during read books fetch"
    );
  }
}
export async function readBooksAction(
  token: string | null,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + `/books/read-books`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch read books");
    }
    return data;
  } catch (error: any) {
    console.error("Error during read books fetch:", error);
    throw new Error(
      error.message || "An error occurred during read books fetch"
    );
  }
}

export async function bookHistoryAction(token: string | null, bookId: string) {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/books/history`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: bookId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch read books");
    }
    return data;
  } catch (error: any) {
    console.error("Error during read books fetch:", error);
    throw new Error(
      error.message || "An error occurred during read books fetch"
    );
  }
}
