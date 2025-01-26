"use server";

import { revalidatePath } from "next/cache";

// Function to handle login action
export async function loginAction(email: string, password: string) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/users/login-admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed"); // customize error message
    }

    const data = await response.json();
    revalidatePath("/login");
    return data;
  } catch (error: any) {
    console.error("Error during login:", error);
    throw new Error(error.message || "An error occurred during login");
  }
}

export async function signupAction(
  username: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch(process.env.BACKEND_URL + "/users/register-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await response.json();
    revalidatePath("/sign-up");
    return data;
  } catch (error: any) {
    console.error("Error during signup:", error);
    throw new Error(error.message || "An error occurred during signup");
  }
}
export async function resetPasswordAction(
  email: string | null,
  otp: string,
  newpassword: string
) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/users/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email, newpassword }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "reset-password failed");
    }

    const data = await response.json();
    revalidatePath("/reset-password");
    return data;
  } catch (error: any) {
    console.error("Error during reset-password:", error);
    throw new Error(error.message || "An error occurred during reset-password");
  }
}
export async function forgetPasswordAction(email: string) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/users/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Forgot Password failed");
    }

    const data = await response.json();
    revalidatePath("/forgot-password");
    return data;
  } catch (error: any) {
    console.error("Error during Forgot Password:", error);
    throw new Error(
      error.message || "An error occurred during Forgot Password"
    );
  }
}

export async function OTPAction(email: string | null, otp: string) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/users/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "OTP verification failed");
    }

    const data = await response.json();
    revalidatePath("/verify-otp");
    return data;
  } catch (error: any) {
    console.error("Error during OTP verification:", error);
    throw new Error(
      error.message || "An error occurred during OTP verification"
    );
  }
}

export async function getBooksAction(token: string | null) {
  try {
    const response = await fetch(process.env.BACKEND_URL + "/books", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch books");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching books:", error);
    throw new Error(error.message || "An error occurred while fetching books");
  }
}

export async function getStaffsAction(token: string | null) {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/users/staff-list",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch staff list");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching staff list", error);
    throw new Error(
      error.message || "An error occurred while fetching staff list"
    );
  }
}

export async function addBookAction(
  token: string,
  bookData: {
    title: string;
    description: string;
    bar_code: string;
    status: boolean;
    shelf_no: string;
    author: string;
  }
) {
  try {
    const response = await fetch(process.env.BACKEND_URL + "/books", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add book");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error adding book:", error);
    throw new Error(error.message || "An error occurred while adding the book");
  }
}

export async function approveAction(token: string, id: string) {
  try {
    const response = await fetch(process.env.BACKEND_URL + "/users/approve", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to approve");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error approve:", error);
    throw new Error(error.message || "An error occurred while approve");
  }
}

export async function updateBookAction(
  token: string,
  bookId: string,
  bookData: {
    title: string;
    description: string;
    bar_code: string;
    status: boolean;
    shelf_no: string;
    author: string;
  }
) {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/books/${bookId}`, {
      method: "PUT", // Assuming you use PUT for updates
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update book");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error updating book:", error);
    throw new Error(
      error.message || "An error occurred while updating the book"
    );
  }
}

export async function deleteBookAction(token: string, bookId: string) {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/books/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete book");
    }

    // It's common for DELETE endpoints to return a 204 No Content if successful without returning data,
    // but let's return the response as is here for flexibility
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error deleting book:", error);
    console.error("Book id: ", bookId);
    throw new Error(
      error.message || "An error occurred while deleting the book"
    );
  }
}

export async function getBookByIdAction(token: string, bookId: string) {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/books/${bookId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch book");
    }
    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error("Error fetching book by ID:", error);
    throw new Error(
      error.message || "An error occurred while fetching book by ID"
    );
  }
}

export async function borrowBooksAction(
  token: string,
  userId: string,
  bookIds: string[]
) {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/books/borrow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, book_id: bookIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to borrow books");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error during borrowing books:", error);
    throw new Error(
      error.message || "An error occurred during borrowing books"
    );
  }
}
export async function returnBooksAction(
  token: string,
  userId: string,
  bookIds: string[]
) {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/books/return`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, book_id: bookIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to return books");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error during returning books:", error);
    throw new Error(
      error.message || "An error occurred during returning books"
    );
  }
}
