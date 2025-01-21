package config

import (
	"context"
	"log"
	// "os"
	// "fmt"

	// "github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Init()(*mongo.Client, error) {
	// if err := godotenv.Load(); err != nil {
	// 	return nil, err
	// }

	mongoURI :="mongodb+srv://kalkidanamare11a:123456Ka@cluster0.d2j0zkv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


	// mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI is not set in .env file")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)

	client, err := mongo.Connect(context.TODO(),clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	if err = client.Ping(context.TODO(),nil); err != nil {
		log.Fatal(err)
	}

	return client, nil	

}