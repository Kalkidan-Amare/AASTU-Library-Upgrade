package controllers

import (
	"aastu_lib/data"
	"aastu_lib/middleware"
	"aastu_lib/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RegisterStudent(c *gin.Context) {
	var stud models.User
	if err := c.ShouldBindJSON(&stud); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	existingUser, _ := data.GetUserByEmail(stud.Email)
	if existingUser.Email != "" {
		c.JSON(http.StatusOK, gin.H{"error": "Email already exists"})
		return
	}

	// Check if username already exists
	existingUser, _ = data.GetUserByUsername(stud.Username)
	if existingUser.Username != "" {
		c.JSON(http.StatusOK, gin.H{"error": "Username already exists"})
		return
	}

	stud.Role = "student"

	// Validate email and password
	if !middleware.ValidateEmail(stud.Email) {
		c.JSON(http.StatusOK, gin.H{"error": "Invalid email"})
		return
	}
	if !middleware.ValidatePassword(stud.Password) {
		c.JSON(http.StatusOK, gin.H{"error": "Password must be at least 8 characters long"})
		return
	}

	// Generate OTP
	otp := middleware.GenerateOTP(6)
	storeOtp := models.OTP{
		Otp:        otp,
		Email:      stud.Email,
		Username:   stud.Username,
		StudentId:  stud.StudentId,
		ExpiresAt:  time.Now().Add(time.Minute * 7),
		Password:   stud.Password,
		Role:       stud.Role,
		Sex:        stud.Sex,
		Department: stud.Department,
		EntryBatch: stud.EntryBatch,
		ImgUrl:     stud.ImgURL,
	}

	// Store OTP in the database
	err := data.StoreOTP(storeOtp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store OTP"})
		return
	}

	// Send OTP via email
	err = middleware.SendOTPEmail(stud.Email, otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func RegisterAdmin(c *gin.Context) {
	var admin models.User
	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	existingUser, _ := data.GetUserByEmail(admin.Email)
	if existingUser.Email != "" {
		c.JSON(http.StatusOK, gin.H{"error": "Email already exists"})
		return
	}

	// Check if username already exists
	existingUser, _ = data.GetUserByUsername(admin.Username)
	if existingUser.Username != "" {
		c.JSON(http.StatusOK, gin.H{"error": "Username already exists"})
		return
	}

	admin.Role = "admin"

	// Validate email and password
	if !middleware.ValidateEmail(admin.Email) {
		c.JSON(http.StatusOK, gin.H{"error": "Invalid email"})
		return
	}
	if !middleware.ValidatePassword(admin.Password) {
		c.JSON(http.StatusOK, gin.H{"error": "Password must be at least 8 characters long"})
		return
	}

	// Generate OTP
	otp := middleware.GenerateOTP(6)
	storeOtp := models.OTP{
		Otp:        otp,
		Email:      admin.Email,
		Username:   admin.Username,
		StudentId:  admin.StudentId,
		ExpiresAt:  time.Now().Add(time.Minute * 7),
		Password:   admin.Password,
		Role:       admin.Role,
		Sex:        admin.Sex,
		Department: admin.Department,
		EntryBatch: admin.EntryBatch,
		ImgUrl:     admin.ImgURL,
	}

	// Store OTP in the database
	err := data.StoreOTP(storeOtp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store OTP"})
		return
	}

	// Send OTP via email
	err = middleware.SendOTPEmail(admin.Email, otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func VerifyOTP(c *gin.Context) {
	var otpRequest models.OTPRequest
	if err := c.ShouldBindJSON(&otpRequest); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": "Invalid input"})
		return
	}

	// Verify the OTP
	storeOtp, err := data.GetOTPByEmail(otpRequest.Email)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "Invalid OTP number", "error": err.Error()})
		return
	}

	if time.Now().After(storeOtp.ExpiresAt) {
		c.JSON(http.StatusOK, gin.H{"error": "OTP expired"})
		return
	}

	if storeOtp.Otp != otpRequest.Otp {
		c.JSON(http.StatusOK, gin.H{"error": "Invalid OTP"})
		return
	}

	// Clean up the used OTP
	if err = data.DeleteOTPByEmail(otpRequest.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't delete OTP"})
		return
	}

	approval := false
	if storeOtp.Role == "student" {
		approval = true // Students are auto-approved
	}

	// Get the user
	user := models.User{
		Username:     storeOtp.Username,
		Email:        storeOtp.Email,
		StudentId:    storeOtp.StudentId,
		Password:     storeOtp.Password,
		Role:         storeOtp.Role,
		BorrowedBooks: []primitive.ObjectID{},
		IsCheckedIn:  false,
		Approved:     approval,
		Sex:          storeOtp.Sex,
		Department:   storeOtp.Department,
		EntryBatch:   storeOtp.EntryBatch,
		ImgURL:       storeOtp.ImgUrl,
	}

	newUser, err := data.RegisterUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "user": newUser})
}


func LoginAdmin(c *gin.Context){
	var admin models.LoginAdmin
	if err := c.ShouldBindJSON(&admin); err != nil{
		c.JSON(http.StatusOK, gin.H{"error":err.Error()})
		return
	}

	existingUser, err := data.AuthenticateUser(admin)
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error":err.Error()})
		return
	}

	if !existingUser.Approved {
		c.JSON(http.StatusForbidden, gin.H{"error": "User not approved"})
		return
	}

	jwtToken, err := middleware.GenerateJWT(existingUser)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message":"User logged in successfully", "token":jwtToken})
}


func AuthenticateUser(c *gin.Context){
	var student models.CheckStudent
	if err := c.ShouldBindJSON(&student); err != nil{
		c.JSON(http.StatusOK, gin.H{"error":err.Error()})
		return
	}

	
	existingUser,err := data.GetUserByStudentID(student.StudentId)
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, existingUser)
}

func GetStaffList(c *gin.Context) {
	claims, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized on controller"})
		return
	}

	userClaims, ok := claims.(*middleware.Claims)
	if !ok || userClaims.Role != "rootadmin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	staffList, err := data.GetStaffList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, staffList)
}

func ApproveStaff(c *gin.Context) {
	claims, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userClaims, ok := claims.(*middleware.Claims)
	if !ok || userClaims.Role != "rootadmin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	var staff models.User
	if err := c.ShouldBindJSON(&staff); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
		return
	}

	staff.Approved = true
	err := data.UpdateUser(staff)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Staff approved successfully"})
}