package data

import (
	"context"
	"errors"
	"aastu_lib/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)


var bookCollection *mongo.Collection


func SetBookCollection(client *mongo.Client){
	bookCollection = client.Database("BookManager").Collection("Books")
}

func GetAllBooks() ([]models.Book,error) {
	var all []models.Book

	cur,err := bookCollection.Find(context.TODO(),bson.M{})
	if err != nil {
		return []models.Book{},err
	}

	err = cur.All(context.TODO(),&all)
	if err != nil {
		return []models.Book{}, err
	}

	return all,nil
}

func GetBookByID(id primitive.ObjectID) (models.Book, error) {
	var book models.Book
	filter := bson.D{primitive.E{Key: "_id", Value: id}}
	err := bookCollection.FindOne(context.TODO(),filter).Decode(&book)
	if err != nil {
		return models.Book{},err
	}

	return book, nil
}

func CreateBook(book models.Book) (interface{}, error) {
	insert, err := bookCollection.InsertOne(context.TODO(),book)
	if err != nil {
		return models.Book{},err
	}

	return insert,nil
}

func UpdateBook(id primitive.ObjectID, updatedbook models.Book) (models.Book, error) {
	filter := bson.M{"_id": id}
	
	update := bson.M{"$set": updatedbook}

	book, err := bookCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return models.Book{}, err
	}
	if book.MatchedCount == 0 {
		return models.Book{}, errors.New("no book found with the given ID")
	}

	return updatedbook, nil
}

func DeleteBook(id primitive.ObjectID) error{
	_,err := bookCollection.DeleteOne(context.TODO(),bson.D{{Key: "_id", Value: id}})
	if err != nil{
		return err
	}

	return nil
}

func ReturnBook(bookID primitive.ObjectID) error {
	filter := bson.M{"_id": bookID}
	update := bson.M{"$set": bson.M{"isavailable": true}}

	result, err := bookCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	if result.MatchedCount == 0 {
		return errors.New("no book found with the given ID")
	}

	return nil
}