package data

import (
	"aastu_lib/models"
	"context"
	"errors"
	"fmt"

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

func GetUserByEmail(email string) (models.User, error) {
	var user models.User
	err := userCollection.FindOne(context.Background(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func GetUserByUsername(username string) (models.User, error) {
	var user models.User
	err := userCollection.FindOne(context.Background(), bson.M{"username": username}).Decode(&user)
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

func GetStaffList() ([]models.User, error) {
	var users []models.User
	cursor, err := userCollection.Find(context.Background(), bson.M{"role": "admin"})
	if err != nil {
		return []models.User{}, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return []models.User{}, err
		}

		users = append(users, user)
	}

	return users, nil
}

func UpdateUser(user models.User) error {
	// Validate the ObjectID
	if user.ID.IsZero() {
		return fmt.Errorf("invalid user ID: cannot be empty")
	}

	// Fetch the existing user
	existingUser, err := GetUserByID(user.ID.Hex())
	if err != nil {
		return fmt.Errorf("failed to fetch existing user: %v", err)
	}

	// Update operation with conditional updates
	update := bson.M{
		"$set": bson.M{
			"username":       ifNotEmpty(user.Username, existingUser.Username),
			"email":          ifNotEmpty(user.Email, existingUser.Email),
			"student_id":     ifNotEmpty(user.StudentId, existingUser.StudentId),
			"password":       ifNotEmpty(user.Password, existingUser.Password),
			"role":           ifNotEmpty(user.Role, existingUser.Role),
			"borrowed_books": ifNotEmpty(user.BorrowedBooks, existingUser.BorrowedBooks),
			"is_checked_in":  ifNotEmpty(user.IsCheckedIn, existingUser.IsCheckedIn),
			"approved":       ifNotEmpty(user.Approved, existingUser.Approved),
			"sex":            ifNotEmpty(user.Sex, existingUser.Sex),
			"department":     ifNotEmpty(user.Department, existingUser.Department),
			"entry_batch":    ifNotEmpty(user.EntryBatch, existingUser.EntryBatch),
			"img_url":        ifNotEmpty(user.ImgURL, existingUser.ImgURL),
		},
	}

	// Perform the update
	result := userCollection.FindOneAndUpdate(
		context.Background(),
		bson.M{"_id": user.ID}, // Match by ObjectID
		update,
	)

	if result.Err() != nil {
		return fmt.Errorf("failed to update user: %v", result.Err())
	}

	return nil
}

// Helper function to check if a field is not empty
func ifNotEmpty(newValue interface{}, oldValue interface{}) interface{} {
	if newValue != nil && newValue != "" {
		return newValue
	}
	return oldValue
}
