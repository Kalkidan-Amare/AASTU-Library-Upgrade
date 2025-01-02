package main

import (
	"log"
	"aastu_lib/router"
	"aastu_lib/config"
	"aastu_lib/data" 
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

	// Setup router and run server
	r := router.SetupRouter()
	log.Println("Starting server on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
