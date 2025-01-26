package controllers

import (
	"aastu_lib/data"
	"log"
	// "aastu_lib/models"
	"net/http"
	// "time"

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

	userObjectID, err := primitive.ObjectIDFromHex(borrowReq.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	for _, bookID := range borrowReq.BookID {
		bookObjectID, err := primitive.ObjectIDFromHex(bookID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
			return
		}
		log.Printf("Book ID: %v", bookObjectID)

		if err := data.BorrowBook(userObjectID, bookObjectID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to borrow book. ", "message": err.Error()})
			return
		}
	}

	user, err := data.GetUserByID(borrowReq.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve student", "message": err.Error()})
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

	// Check if all returned books were actually borrowed
	for _, returnBookID := range bookObjectIDs {
		found := false
		for _, borrowedBookID := range user.BorrowedBooks {
			if borrowedBookID == returnBookID {
				found = true
				break
			}
		}
		if !found {
			c.JSON(http.StatusBadRequest, gin.H{"error": "One or more books were not borrowed by the user"})
			return
		}
	}


	// Update the availability of the books
	for _, bookID := range bookObjectIDs {
		if err := data.ReturnBook(bookID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to return book", "message": err.Error()})
			return
		}
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
	var req struct {
		StartDate string `json:"start_date"`
		StartTime string `json:"start_time"`
		EndDate   string `json:"end_date"`
		EndTime   string `json:"end_time"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	
	startDate := req.StartDate + " " + req.StartTime
	endDate := req.EndDate + " " + req.EndTime

	books, err := data.GetReadBooksBetweenDates(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve read books", "message": err.Error()})
		return
	}

	

	c.JSON(http.StatusOK, books)
}

func GetNotReadBooksBetweenDates(c *gin.Context) {
	var req struct {
		StartDate string `json:"start_date"`
		StartTime string `json:"start_time"`
		EndDate   string `json:"end_date"`
		EndTime   string `json:"end_time"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	
	startDate := req.StartDate + " " + req.StartTime
	endDate := req.EndDate + " " + req.EndTime

	books, err := data.GetNotReadBooksBetweenDates(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve not read books"})
		return
	}

	c.JSON(http.StatusOK, books)
}

func GetHistoryOfBook(c *gin.Context) {
	var bookReq struct {
		BookID primitive.ObjectID `json:"book_id"`
	}

	if err := c.ShouldBindJSON(&bookReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	history, err := data.GetHistoryOfBook(bookReq.BookID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve book history"})
		return
	}

	c.JSON(http.StatusOK, history)
}