package main

import (
	"aastu_lib/config"
	"aastu_lib/data"
	"aastu_lib/router"
	"log"
	// "os"
)

func main() {
	// Initialize the database
	client, err := config.Init()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Set database collections
	data.SetUserCollection(client)
	data.SetBookCollection(client)
	data.SetBorrowBooksCollection(client)
	data.SetCheckinCollection(client)
	data.SetOtpCollection(client)

	// Setup router and run server
	// port := os.Getenv("PORT")
	port := "8080"

	if port == "" {
		port = "8080"
	}

	r := router.SetupRouter()
	log.Println("Starting server on port", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
