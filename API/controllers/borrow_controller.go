package controllers

import (
	"aastu_lib/data"
	// "aastu_lib/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func BorrowBook(c *gin.Context) {
	var borrowReq struct {
		UserID string   `json:"user_id"`
		BookID []string `json:"book_id"`
	}

	if err := c.ShouldBindJSON(&borrowReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	for _, bookID := range borrowReq.BookID {
		if err := data.BorrowBook(borrowReq.UserID, bookID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to borrow book"})
			return
		}
	}

	user, err := data.GetUserByID(borrowReq.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	var bookObjectIDs []primitive.ObjectID
	for _, bookID := range borrowReq.BookID {
		bookObjectID, err := primitive.ObjectIDFromHex(bookID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
			return
		}
		bookObjectIDs = append(bookObjectIDs, bookObjectID)
	}

	NewBorrowedBooksList := append(user.BorrowedBooks, bookObjectIDs...)   // might be incorrect, try updating the user.borrowbooks instead

	if _,err := data.UpdateUserBorrowedBooks(borrowReq.UserID, NewBorrowedBooksList); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Books borrowed successfully"})
}

func ReturnBook(c *gin.Context) {
	var returnReq struct {
		UserID string   `json:"user_id"`
		BookID []string `json:"book_id"`
	}

	if err := c.ShouldBindJSON(&returnReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := data.GetUserByID(returnReq.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	var bookObjectIDs []primitive.ObjectID
	for _, bookID := range returnReq.BookID {
		bookObjectID, err := primitive.ObjectIDFromHex(bookID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
			return
		}
		bookObjectIDs = append(bookObjectIDs, bookObjectID)
	}

	// Remove the returned books from the user's borrowed books list
	var updatedBorrowedBooks []primitive.ObjectID
	for _, borrowedBookID := range user.BorrowedBooks {
		found := false
		for _, returnBookID := range bookObjectIDs {
			if borrowedBookID == returnBookID {
				found = true
				break
			}
		}
		if !found {
			updatedBorrowedBooks = append(updatedBorrowedBooks, borrowedBookID)
		}
	}

	if _, err := data.UpdateUserBorrowedBooks(returnReq.UserID, updatedBorrowedBooks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	// Update the return time for the borrowed books
	for _, bookID := range bookObjectIDs {
		userID, err := primitive.ObjectIDFromHex(returnReq.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}
		if err := data.UpdateBorrowedBookReturnTime(userID, bookID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update return time"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Books returned successfully"})
}

func GetReadBooksBetweenDates(c *gin.Context) {
	var dateRange struct {
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
	}

	if err := c.ShouldBindJSON(&dateRange); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	startDate, err := time.Parse(time.RFC3339, dateRange.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date"})
		return
	}

	endDate, err := time.Parse(time.RFC3339, dateRange.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date"})
		return
	}

	books, err := data.GetReadBooksBetweenDates(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve read books"})
		return
	}

	c.JSON(http.StatusOK, books)
}


func GetNotReadBooksBetweenDates(c *gin.Context) {
	var dateRange struct {
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
	}

	if err := c.ShouldBindJSON(&dateRange); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	startDate, err := time.Parse(time.RFC3339, dateRange.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date"})
		return
	}

	endDate, err := time.Parse(time.RFC3339, dateRange.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date"})
		return
	}

	books, err := data.GetNotReadBooksBetweenDates(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve not read books"})
		return
	}

	c.JSON(http.StatusOK, books)
}

func GetHistoryOfBook(c *gin.Context) {
	var bookReq struct {
		Title  string `json:"title"`
		BookID string `json:"book_id"`
	}

	if err := c.ShouldBindJSON(&bookReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	history, err := data.GetHistoryOfBook(bookReq.Title, bookReq.BookID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve book history"})
		return
	}

	c.JSON(http.StatusOK, history)
}