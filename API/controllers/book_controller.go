package controllers

import (
	"net/http"
	"aastu_lib/data"
	"aastu_lib/models"
	// "aastu_lib/middleware"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func  GetBooks(c *gin.Context){
	all,err := data.GetAllBooks()
	if err != nil{
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(200, all)
}

func GetBook(c *gin.Context){  // should be updated to get by Title
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid book ID"})
        return
    }

	book,err := data.GetBookByID(id)
	if err != nil{
		c.JSON(http.StatusNotFound, err.Error())
		return
	}
	c.JSON(http.StatusOK, book)
}

func AddBook(c *gin.Context){
	var newbook models.Book
	if err := c.ShouldBindJSON(&newbook); err != nil{
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	newbook.IsAvailable = true

	id,err := data.CreateBook(newbook)
	if err != nil{
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, id)
}

func UpdateBook(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid book ID"})
		return
	}

	var updatedbook models.Book
	if err := c.ShouldBindJSON(&updatedbook); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	
	
	// user,_ := c.Get("user")
	// claims := user.(*middleware.Claims)
	
	_, err = data.GetBookByID(id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    
    updatedbook.ID = id

    book, err := data.UpdateBook(id,updatedbook)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, book)
}

func DeleteBook(c *gin.Context){
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid book ID"})
        return
    }


	if err := data.DeleteBook(id); err != nil{
		c.JSON(http.StatusNotFound, err.Error())
		return
	}
	c.JSON(http.StatusOK, nil)
}