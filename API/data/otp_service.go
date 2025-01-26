package data

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"

	"aastu_lib/models"
)

var otpCollection *mongo.Collection

func SetOtpCollection(client *mongo.Client){
	otpCollection = client.Database("BookManager").Collection("Otp")
}

func StoreOTP(otp models.OTP) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := otpCollection.InsertOne(ctx, otp)
	return err
}

func GetOTPByEmail(email string) (models.OTP, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var otpEntry models.OTP
	err := otpCollection.FindOne(ctx, bson.M{"email": email}).Decode(&otpEntry)
	return otpEntry, err
}

func DeleteOTPByEmail(email string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := otpCollection.DeleteOne(ctx, bson.M{"email": email})
	return err
}