package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username string             `bson:"username" json:"username"`
	StudentId string            `json:"student_id" bson:"student_id,omitemptly"`
    Password string             `bson:"password" json:"password"`
    Role     string             `bson:"role" json:"role"`
	BorrowedBooks []primitive.ObjectID `bson:"borrowed_books" json:"borrowed_books"`

}