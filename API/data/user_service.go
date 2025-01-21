package data

import (
	"aastu_lib/models"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection

func SetUserCollection(client *mongo.Client){
	userCollection = client.Database("BookManager").Collection("Users")
}

func GetUserByID(id string) (models.User, error) {
	var user models.User
	objectId, err := primitive.ObjectIDFromHex(id) // should be on the controller
	if err != nil {
		return models.User{}, err
	}

	err = userCollection.FindOne(context.Background(), bson.M{"_id": objectId}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func GetUserByStudentID(studentID string) (models.User, error) {
	var user models.User
	err := userCollection.FindOne(context.Background(), bson.M{"student_id": studentID}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func RegisterUser(user models.User) (models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}
	user.Password = string(hashedPassword)

	_,err = userCollection.InsertOne(context.Background(),user)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func AuthenticateUser(newUser models.LoginAdmin) (models.User, error) {
	var user models.User
	err := userCollection.FindOne(context.Background(),bson.M{"email": newUser.Email}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(newUser.Password))
	if err != nil{
		return models.User{}, errors.New("invalide credentials")
	}

	return user,nil
}


func UpdateUserBorrowedBooks(id string, borrowedBooks []primitive.ObjectID) (models.User, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.User{}, err
	}

	update := bson.M{
		"$set": bson.M{
			"borrowed_books": borrowedBooks,
		},
	}

	_, err = userCollection.UpdateOne(context.Background(), bson.M{"_id": objectId}, update)
	if err != nil {
		return models.User{}, err
	}

	return GetUserByID(id)
}
