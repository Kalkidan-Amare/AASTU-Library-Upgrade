package data

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	// "aastu_lib/config"
	"aastu_lib/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var borrowBooksCollection *mongo.Collection

func SetBorrowBooksCollection(client *mongo.Client) {
	borrowBooksCollection = client.Database("BookManager").Collection("BorrowedBooks")
	bookCollection = client.Database("BookManager").Collection("Books")
}

func BorrowBook(userID, bookID primitive.ObjectID) error {
	// Check if the book is available
	var book models.Book
	err := bookCollection.FindOne(context.Background(), bson.M{"_id": bookID, "isavailable": true}).Decode(&book)
	if err != nil {
		return errors.New("book not available or does not exist")
	}

	// Update book isavailable and record borrowing
	_, err = bookCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": bookID},
		bson.M{"$set": bson.M{"isavailable": false}},
	)
	if err != nil {
		return errors.New("failed to update book isavailable")
	}

	// Record borrowing in borrow_books collection
	location, _ := time.LoadLocation("Africa/Addis_Ababa")
	notBorrow := models.Borrow_Book{
		BookID:    bookID,
		UserID:    userID,
		BorrowedAt: time.Now().In(location).Format("2006-01-02 15:04"),
	}

	_, err = borrowBooksCollection.InsertOne(context.Background(), notBorrow)
	if err != nil {
		return err
	}

	log.Printf("Book borrowed: %+v", book)
	return nil
}

func UpdateBorrowedBookReturnTime(userID, bookID primitive.ObjectID) error {
	// Check if the user has borrowed the book
	filter := bson.M{"user_id": userID, "book_id": bookID}
	var notBorrow models.Borrow_Book
	err := borrowBooksCollection.FindOne(context.Background(), filter).Decode(&notBorrow)
	if err != nil {
		return errors.New("notBorrow record not found")
	}

	// Update the return time
	location, _ := time.LoadLocation("Africa/Addis_Ababa")
	_, err = borrowBooksCollection.UpdateOne(
		context.Background(),
		filter,
		bson.M{"$set": bson.M{"return_time": time.Now().In(location).Format("2006-01-02 15:04")}},
	)
	if err != nil {
		return errors.New("failed to update return time")
	}

	log.Printf("Return time updated for book: %+v", notBorrow)
	return nil
}

// func GetBookByTitleOrID(title, bookID string) (*models.Book, error) {
// 	var book models.Book
// 	filter := bson.M{}
// 	if title != "" {
// 		filter["title"] = title
// 	}
// 	if bookID != "" {
// 		filter["_id"] = bookID
// 	}

// 	err := booksCollection.FindOne(context.Background(), filter).Decode(&book)
// 	if err != nil {
// 		return nil, errors.New("book not found")
// 	}

// 	log.Printf("Book found: %+v", book)
// 	return &book, nil
// }

func GetReadBooksBetweenDates(startDateStr, endDateStr string) ([]map[string]interface{}, error) {
	var borrowedBooks []map[string]interface{}

	// Parse startDateStr and endDateStr into time.Time
	startDate, err := time.Parse("2006-01-02 15:04", startDateStr)
	if err != nil {
		return nil, fmt.Errorf("invalid start date format: %v", err)
	}

	endDate, err := time.Parse("2006-01-02 15:04", endDateStr)
	if err != nil {
		return nil, fmt.Errorf("invalid end date format: %v", err)
	}

	// Fetch all borrow records
	cursor, err := borrowBooksCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, errors.New("failed to retrieve borrow records")
	}
	defer cursor.Close(context.Background())

	// Manual filtering
	for cursor.Next(context.Background()) {
		var borrowRecord models.Borrow_Book
		if err := cursor.Decode(&borrowRecord); err != nil {
			return nil, err
		}

		// Parse the `borrowed_at` field
		borrowedAt, err := time.Parse("2006-01-02 15:04", borrowRecord.BorrowedAt)
		if err != nil {
			// Skip invalid date formats
			continue
		}

		// Include only if `borrowed_at` falls within the range
		if borrowedAt.After(startDate) && borrowedAt.Before(endDate) {
			// Fetch book details
			var book models.Book
			err := bookCollection.FindOne(context.Background(), bson.M{"_id": borrowRecord.BookID}).Decode(&book)
			if err != nil {
				return nil, fmt.Errorf("failed to fetch book details: %v", err)
			}

			// Fetch user details
			var user models.User
			err = userCollection.FindOne(context.Background(), bson.M{"_id": borrowRecord.UserID}).Decode(&user)
			if err != nil {
				return nil, fmt.Errorf("failed to fetch user details: %v", err)
			}

			// Create a combined record
			record := map[string]interface{}{
				"borrow": borrowRecord,
				"book":   book,
				"student_id":   user.StudentId,
			}

			borrowedBooks = append(borrowedBooks, record)
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return borrowedBooks, nil
}

func GetNotReadBooksBetweenDates(startDateStr, endDateStr string) ([]models.Book, error) {
	// Get the list of read books within the date range
	readBooks, err := GetReadBooksBetweenDates(startDateStr, endDateStr)
	if err != nil {
		return nil, fmt.Errorf("failed to get read books: %v", err)
	}

	// Create a set of book IDs for read books for quick lookup
	readBookIDs := make(map[primitive.ObjectID]bool)
	for _, record := range readBooks {
		bookID := record["borrow"].(models.Borrow_Book).BookID
		readBookIDs[bookID] = true
	}

	// Fetch all books
	cursor, err := bookCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, errors.New("failed to retrieve books")
	}
	defer cursor.Close(context.Background())

	var notReadBooks []models.Book
	for cursor.Next(context.Background()) {
		var book models.Book
		if err := cursor.Decode(&book); err != nil {
			return nil, err
		}

		// Include the book only if it is not in the readBooks set
		if !readBookIDs[book.ID] {
			notReadBooks = append(notReadBooks, book)
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return notReadBooks, nil
}



func GetHistoryOfBook(bookID primitive.ObjectID) ([]map[string]interface{}, error) {
	_, err := GetBookByID(bookID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"book_id": bookID}
	cursor, err := borrowBooksCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, errors.New("failed to retrieve notBorrow records")
	}
	defer cursor.Close(context.Background())

	var borrowedBooks []map[string]interface{}
	for cursor.Next(context.Background()) {
		var notBorrow models.Borrow_Book
		if err := cursor.Decode(&notBorrow); err != nil {
			return nil, err
		}

		// Fetch user details
		var user models.User
		err = userCollection.FindOne(context.Background(), bson.M{"_id": notBorrow.UserID}).Decode(&user)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch user details: %v", err)
		}

		// Create a combined record
		record := map[string]interface{}{
			"borrow":    notBorrow,
			"student_id": user.StudentId,
		}
		// fmt.Println("Inside")

		borrowedBooks = append(borrowedBooks, record)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	// fmt.Println("hello")

	return borrowedBooks, nil
}
