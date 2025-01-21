package controllers

import (
	"aastu_lib/data"
	"aastu_lib/models"
	// "fmt"
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

	user, err := data.GetUserByStudentID(req.StudentId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user", "message": err.Error()})
		return
	}

	location, _ := time.LoadLocation("Africa/Addis_Ababa")
	checkIn := models.CheckIn{
		StudentID: req.StudentId,
		UserID:    user.ID.Hex(),
		CheckInAt: time.Now().In(location).Format("2006-01-02 15:04"),
	}

	if err := data.CreateCheckInRecord(checkIn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record check-in"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Check-in successful", "data": checkIn, "user": user})
}

func CheckOut(c *gin.Context) {
	var req struct {
		StudentId string `json:"student_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := data.GetUserByStudentID(req.StudentId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	checkIn, err := data.GetCheckInRecord(req.StudentId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Check-in record not found", "message": err.Error()})
		return
	}

	if len(user.BorrowedBooks) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Student has not returned all borrowed books", "borrowed_books": user.BorrowedBooks})
		return
	}

	location, _ := time.LoadLocation("Africa/Addis_Ababa")
	checkOutTime := time.Now().In(location).Format("2006-01-02 15:04")
	if err := data.UpdateCheckOutTime(checkIn, checkOutTime); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record check-out"})
		return
	}

	// fmt.Printf("Check-out time: %s\n", checkOutTime)

	c.JSON(http.StatusOK, gin.H{"message": "Check-out successful", "data": checkIn, "user": user})
}

// func AnalyzeLibraryTraffic(c *gin.Context) {
// 	var req struct {
// 		StartDate string `json:"start_date"`
// 		StartTime string `json:"start_time"`
// 		EndDate   string `json:"end_date"`
// 		EndTime   string `json:"end_time"`
// 	}

// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
// 		return
// 	}


// 	startDateTime := req.StartDate + " " + req.StartTime
// 	endDateTime := req.EndDate + " " + req.EndTime

// 	count, err := data.GetStudentCheckInsInInterval(startDateTime, endDateTime)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze library traffic"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Library traffic analysis", "count": count})
// }

func GetUserCheckIns(c *gin.Context) {
	var req struct {
		StudentID string `json:"student_id"`
		StartDate string `json:"start_date"`
		StartTime string `json:"start_time"`
		EndDate   string `json:"end_date"`
		EndTime   string `json:"end_time"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	
	startDateTime := req.StartDate + " " + req.StartTime
	endDateTime := req.EndDate + " " + req.EndTime


	checkIns, err := data.GetUserCheckIns(req.StudentID, startDateTime, endDateTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve check-ins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User check-ins retrieved successfully", "data": checkIns})
}

func GetStudentCheckInsInInterval(c *gin.Context) {
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

	startDateTime := req.StartDate + " " + req.StartTime
	endDateTime := req.EndDate + " " + req.EndTime

	checkIns, err := data.GetStudentCheckInsInInterval(startDateTime, endDateTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve check-ins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student check-ins retrieved successfully", "data": checkIns})
}
