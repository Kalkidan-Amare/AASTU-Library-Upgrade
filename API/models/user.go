package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username string             `bson:"username" json:"username"`
	Email    string             `bson:"email" json:"email"`
	StudentId string            `json:"student_id" bson:"student_id,omitemptly"`
    Password string             `bson:"password" json:"password"`
    Role     string             `bson:"role" json:"role"`
	BorrowedBooks []primitive.ObjectID `bson:"borrowed_books" json:"borrowed_books"`
	IscheckedIN bool 			`bson:"is_checked_in" json:"is_checked_in"`

}

type LoginAdmin struct {
	Email	 string `json:"email"`
	Password string `json:"password"`
}

type CheckStudent struct {
	StudentId string `json:"student_id"`
}