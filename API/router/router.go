package router

import (
	"aastu_lib/controllers"
	"aastu_lib/middleware"

	"github.com/gin-gonic/gin"
)

func SetupBookRouter(r *gin.Engine) {
	authorized := r.Group("/books")
	authorized.Use(middleware.AuthMiddleware())
	{

		// Book routes for all users
		authorized.GET("/", controllers.GetBooks)
		authorized.GET("/:id", controllers.GetBook)

		// Borrowing logic
		authorized.POST("/borrow", controllers.BorrowBook)
		authorized.POST("/return", controllers.ReturnBook)

		// Borrowing analysis routes
		authorized.POST("/read-books", controllers.GetReadBooksBetweenDates)
		authorized.POST("/not-read-books", controllers.GetNotReadBooksBetweenDates)
		authorized.POST("/history", controllers.GetHistoryOfBook)

		// Admin-only routes
		admin := authorized.Group("/")
		admin.Use(middleware.AdminMiddleware())
		{
			admin.POST("/", controllers.AddBook)
			admin.PUT("/:id", controllers.UpdateBook)
			admin.DELETE("/:id", controllers.DeleteBook)
		}
	}
}

func SetupUserRouter(r *gin.Engine) {

	//ToDo if necessary CRUD operations on users
	user := r.Group("/users")
	{
		user.POST("/register", controllers.RegisterStudent)
		user.POST("/register-admin", controllers.RegisterAdmin)
		user.POST("/login-admin", controllers.LoginAdmin)
		user.POST("/authenticate", controllers.AuthenticateUser)

		//ToDo logout
	}

}

func SetupCheckInRouter(r *gin.Engine) {
	checkin := r.Group("/checkin")
	checkin.Use(middleware.AuthMiddleware())
	{
		checkin.POST("/", controllers.CheckIn)
		checkin.POST("/checkout", controllers.CheckOut)
		// checkin.POST("/analyze", controllers.AnalyzeLibraryTraffic)
		checkin.POST("/user-checkins", controllers.GetUserCheckIns)
		checkin.POST("/interval-checkins", controllers.GetStudentCheckInsInInterval)
	}
}

func SetupRouter() *gin.Engine {
	r := gin.Default()

	SetupBookRouter(r)
	SetupUserRouter(r)
	SetupCheckInRouter(r)

	return r
}
