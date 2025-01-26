package controllers

import (
	"aastu_lib/data"
	"aastu_lib/models"
	"fmt"
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
		c.JSON(http.StatusOK, gin.H{"error": "Failed to fetch user", "message": err.Error()})
		return
	}

	if user.IsCheckedIn {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User is already checked in"})
		return
	}


	location, _ := time.LoadLocation("Africa/Addis_Ababa")
	checkIn := models.CheckIn{
		StudentID: req.StudentId,
		UserID:    user.ID.Hex(),
		CheckInAt: time.Now().In(location).Format("2006-01-02 15:04"),
	}

	if err := data.CreateCheckInRecord(checkIn); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": "Failed to record check-in"})
		return
	}

	fmt.Println(user)

	user.IsCheckedIn = true
	fmt.Println(user)
	if err := data.UpdateUser(user); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": "Failed to update user status"})
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to fetch user", "message": err.Error()})
		return
	}
	
	fmt.Println("hello before")

	checkIn, err := data.GetCheckInRecord(req.StudentId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Check-in record not found", "message": err.Error()})
		return
	}
	// fmt.Println(user.IsCheckedIn)
	if !user.IsCheckedIn {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User is not checked in"})
		return
	}

	fmt.Println("hello")

	if len(user.BorrowedBooks) > 0 {
		c.JSON(http.StatusOK, gin.H{"error": "Student has not returned all borrowed books", "borrowed_books": user.BorrowedBooks})
		return
	}

	location, _ := time.LoadLocation("Africa/Addis_Ababa")
	checkOutTime := time.Now().In(location).Format("2006-01-02 15:04")
	checkIn.CheckOutAt = checkOutTime
	// if err := data.UpdateCheckOutTime(checkIn, checkOutTime); err != nil {
	// 	c.JSON(http.StatusOK, gin.H{"error": "Failed to record check-out"})
	// 	return
	// }

	if err:= data.UpdateCheckIn(checkIn); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to record check-out"})
		return
	}

	user.IsCheckedIn = false
	if err := data.UpdateUser(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update user status"})
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
// 		c.JSON(http.StatusOK, gin.H{"error": "Failed to analyze library traffic"})
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
		c.JSON(http.StatusOK, gin.H{"error": "Failed to retrieve check-ins"})
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
		c.JSON(http.StatusOK, gin.H{"error": "Failed to retrieve check-ins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student check-ins retrieved successfully", "data": checkIns})
}


func GetDailyCheckIns(c *gin.Context) {
	location, _ := time.LoadLocation("Africa/Addis_Ababa")
	date := time.Now().In(location).Format("2006-01-02")

	checkIns, err := data.GetDailyCheckIns(date)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": "Failed to retrieve check-ins"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Daily check-ins retrieved successfully", "data": checkIns})
}