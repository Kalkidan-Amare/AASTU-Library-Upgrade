package controllers

import (
	"aastu_lib/data"
	"aastu_lib/middleware"
	"aastu_lib/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)


func ForgotPassword(c *gin.Context) {
	email := models.EmailRequest{}
	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate emai
	if !middleware.ValidateEmail(email.Email) {
		c.JSON(http.StatusOK, gin.H{"error": "Invalid email"})
		return
	}

	
	existingUser, _ := data.GetUserByEmail(email.Email)
	if existingUser.Email == "" {
		c.JSON(http.StatusOK, gin.H{"error": "Email doesn't exists"})
		return
	}

	// Generate OTP
	otp := middleware.GenerateOTP(6)
	storeOtp := models.OTP{
		Otp:       otp,
		Email:     email.Email,
		ExpiresAt: time.Now().Add(time.Minute * 7),
	}

	// Store OTP in the database
	err := data.StoreOTP(storeOtp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store OTP"})
		return
	}

	// Send OTP via email
	err = middleware.SendOTPEmail(existingUser.Email, otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset OTP sent to email"})
}


func ResetPassword(c *gin.Context) {
	var otpRequest models.OTPResetPassword
	if err := c.ShouldBindJSON(&otpRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
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

	// Get the user by email
	existingUser, err := data.GetUserByEmail(otpRequest.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(otpRequest.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	
	user := models.User{
		ID: 	 existingUser.ID,
		Password: string(hashedPassword),
	}

	err = data.UpdateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "err": "could not update the password"})
		return
	}


	authUser := models.LoginAdmin{
		Email: otpRequest.Email,
		Password: otpRequest.Password,
	}

	existingUser,err = data.AuthenticateUser(authUser)
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error":err.Error()})
		return
	}

	jwtToken, err := middleware.GenerateJWT(existingUser)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"reset_message": "Password reset successfully", "message": "User logged in successfully", "token": jwtToken})

}