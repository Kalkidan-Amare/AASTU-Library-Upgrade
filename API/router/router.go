package router

import (
    "aastu_lib/controllers"
    "aastu_lib/middleware"

	"github.com/gin-gonic/gin"
)

func SetupBookRouter(r *gin.Engine) {
    authorized := r.Group("/")
    authorized.Use(middleware.AuthMiddleware())
    {
        authorized.GET("/books", controllers.GetBooks)
        authorized.GET("/books/:id", controllers.GetBook)
		// authorized.GET("/books/search/:title", controllers.SearchBook)
        authorized.POST("/books", controllers.BorrowBook)

        authorized.POST("/books", middleware.AdminMiddleware() ,controllers.AddBook)
        authorized.PUT("/books/:id",middleware.AdminMiddleware(), controllers.UpdateTask)
        authorized.DELETE("/books/:id", middleware.AdminMiddleware(), controllers.DeleteTask)
    }
}

func SetupUserRouter(r *gin.Engine) {
    r.POST("/register", controllers.RegisterStudent)
    r.POST("/register-admin", controllers.RegisterAdmin)
    r.POST("/login-admin", controllers.LoginAdmin)
	r.POST("/check-in-student", controllers.CheckInStudent)
	r.POST("/check-out-student", controllers.CheckOutStudent)
}