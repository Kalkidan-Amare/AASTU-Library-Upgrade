package controllers

import (
	"aastu_lib/data"
	"aastu_lib/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)


func CheckIn(c *gin.Context) {
	var req struct {
		StudentId string `json:"student_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := data.GetUserByID(req.StudentId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	checkIn := models.CheckIn{
		StudentID: req.StudentId,
		UserID:    user.ID.Hex(),
		CheckInAt: time.Now(),
	}

	if err := data.CreateCheckInRecord(checkIn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record check-in"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Check-in successful", "data": checkIn, "user": user})
}


// ToDO clearing all the checkin once a day, to guarantee 
func CheckOut(c *gin.Context) {
	var req struct {
		StudentId string `json:"student_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := data.GetUserByID(req.StudentId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	// Check if the student is already checked in
	checkIn, err := data.GetCheckInRecord(req.StudentId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Check-in record not found"})
		return
	}

	// Check if the student has returned all the borrowed books
	if len(user.BorrowedBooks) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Student has not returned all borrowed books", "borrowed_books": user.BorrowedBooks})
		return
	}

	// Update the check-out time
	now := time.Now()
	checkIn.CheckOutAt = &now
	if err := data.UpdateCheckOutTime(checkIn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record check-out"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Check-out successful", "data": checkIn, "user": user})
}

func AnalyzeLibraryTraffic(c *gin.Context) {
	var req struct {
		StartTime time.Time `json:"start_time"`
		EndTime   time.Time `json:"end_time"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	count, err := data.GetStudentCheckInsInInterval(req.StartTime, req.EndTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze library traffic"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Library traffic analysis", "count": count})
}


func GetUserCheckIns(c *gin.Context) {
	var req struct {
		StudentID string    `json:"student_id"`  // ToDo one is enough
		Username  string    `json:"username"`
		StartDate time.Time `json:"start_date"`
		EndDate   time.Time `json:"end_date"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	checkIns, err := data.GetUserCheckIns(req.StudentID, req.Username, req.StartDate, req.EndDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve check-ins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User check-ins retrieved successfully", "data": checkIns})
}


func GetStudentCheckInsInInterval(c *gin.Context) {
	var req struct {
		StartTime time.Time `json:"start_time"`
		EndTime   time.Time `json:"end_time"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	checkIns, err := data.GetStudentCheckInsInInterval(req.StartTime, req.EndTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve check-ins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student check-ins retrieved successfully", "data": checkIns})
}