package controllers

import (
	"net/http"
	"aastu_lib/data"
	"aastu_lib/middleware"
	"aastu_lib/models"

	"github.com/gin-gonic/gin"
)

func RegisterStudent(c *gin.Context){
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}
	user.Role = "user"

	newUser,err := data.RegisterUser(user)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, newUser)
}	

func RegisterAdmin(c *gin.Context){
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}
	user.Role = "admin"

	newUser,err := data.RegisterUser(user)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, newUser)
}


func LoginAdmin(c *gin.Context){
	// 
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}

	existingUser,err := data.AuthenticateUser(user)
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
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}

	existingUser,err := data.AuthenticateUser(user)
	if err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error":err.Error()})
		return
	}
	c.JSON(http.StatusOK, existingUser)
}