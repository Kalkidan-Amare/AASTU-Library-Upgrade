package controllers

import (
	"net/http"
	"aastu_lib/data"
	"aastu_lib/middleware"
	"aastu_lib/models"

	"github.com/gin-gonic/gin"
)

func RegisterStudent(c *gin.Context){
	var admin models.User
	if err := c.ShouldBindJSON(&admin); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}
	admin.Role = "admin"

	newUser,err := data.RegisterUser(admin)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, newUser)
}	

func RegisterAdmin(c *gin.Context){
	var admin models.User
	if err := c.ShouldBindJSON(&admin); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}
	admin.Role = "admin"

	newUser,err := data.RegisterUser(admin)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, newUser)
}


func LoginAdmin(c *gin.Context){
	// 
	var admin models.LoginAdmin
	if err := c.ShouldBindJSON(&admin); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}

	existingUser,err := data.AuthenticateUser(admin)
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error":err.Error()})
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
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}

	
	existingUser,err := data.GetUserByStudentID(student.StudentId)
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, existingUser)
}