package data

import (
	"context"
	"errors"
	"time"

	// "aastu_lib/config"
	"aastu_lib/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var borrowBooksCollection *mongo.Collection

func SetBorrowBooksCollection(client *mongo.Client) {
	borrowBooksCollection = client.Database("BookManager").Collection("borrow_books")
}

func BorrowBook(userID, bookID string) error {
	// Check if the book is available
	var book models.Book
	err := borrowBooksCollection.FindOne(context.Background(), bson.M{"_id": bookID, "status": "available"}).Decode(&book)
	if err != nil {
		return errors.New("book not available or does not exist")
	}

	// Update book status and record borrowing
	_, err = borrowBooksCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": bookID},
		bson.M{"$set": bson.M{"status": "borrowed"}},
	)
	if err != nil {
		return errors.New("failed to update book status")
	}

	// Record borrowing in borrow_books collection
	bookObjectID, err := primitive.ObjectIDFromHex(bookID)
	if err != nil {
		return errors.New("invalid book ID")
	}
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}
	borrow := models.Borrow_Book{
		BookID:    bookObjectID,
		UserID:    userObjectID,
		BorrowedAt: time.Now(),
	}

	_, err = borrowBooksCollection.InsertOne(context.Background(), borrow)
	return err
}

func UpdateBorrowedBookReturnTime(userID, bookID primitive.ObjectID) error {
	// Check if the user has borrowed the book
	filter := bson.M{"user_id": userID, "book_id": bookID}
	var borrow models.Borrow_Book
	err := borrowBooksCollection.FindOne(context.Background(), filter).Decode(&borrow)
	if err != nil {
		return errors.New("borrow record not found")
	}

	// Update the return time
	_, err = borrowBooksCollection.UpdateOne(
		context.Background(),
		filter,
		bson.M{"$set": bson.M{"return_time": time.Now()}},
	)
	if err != nil {
		return errors.New("failed to update return time")
	}

	return nil
}

func GetBookByTitleOrID(title, bookID string) (*models.Book, error) {
	var book models.Book
	filter := bson.M{}
	if title != "" {
		filter["title"] = title
	}
	if bookID != "" {
		filter["_id"] = bookID
	}

	err := borrowBooksCollection.FindOne(context.Background(), filter).Decode(&book)
	if err != nil {
		return nil, errors.New("book not found")
	}
	return &book, nil
}

func GetReadBooksBetweenDates(startDate, endDate time.Time) ([]models.Borrow_Book, error) {
	filter := bson.M{
		"borrowed_at": bson.M{
			"$gte": startDate,
			"$lte": endDate,
		},
	}

	cursor, err := borrowBooksCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, errors.New("failed to retrieve borrow records")
	}
	defer cursor.Close(context.Background())

	var borrowedBooks []models.Borrow_Book
	for cursor.Next(context.Background()) {
		var borrow models.Borrow_Book
		if err := cursor.Decode(&borrow); err != nil {
			return nil, err
		}
		borrowedBooks = append(borrowedBooks, borrow)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return borrowedBooks, nil
}

func GetNotReadBooksBetweenDates(startDate, endDate time.Time) ([]models.Borrow_Book, error) {
	filter := bson.M{
		"borrowed_at": bson.M{
			"$gte": startDate,
			"$lte": endDate,
		},
		"return_time": bson.M{"$exists": false},
	}

	cursor, err := borrowBooksCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, errors.New("failed to retrieve borrow records")
	}
	defer cursor.Close(context.Background())

	var notReadBooks []models.Borrow_Book
	for cursor.Next(context.Background()) {
		var borrow models.Borrow_Book
		if err := cursor.Decode(&borrow); err != nil {
			return nil, err
		}
		notReadBooks = append(notReadBooks, borrow)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return notReadBooks, nil
}

func GetHistoryOfBook(title, bookID string) ([]models.Borrow_Book, error) {
	book, err := GetBookByTitleOrID(title, bookID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"book_id": book.ID}
	cursor, err := borrowBooksCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, errors.New("failed to retrieve borrow records")
	}
	defer cursor.Close(context.Background())

	var borrowedBooks []models.Borrow_Book
	for cursor.Next(context.Background()) {
		var borrow models.Borrow_Book
		if err := cursor.Decode(&borrow); err != nil {
			return nil, err
		}
		borrowedBooks = append(borrowedBooks, borrow)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return borrowedBooks, nil
}