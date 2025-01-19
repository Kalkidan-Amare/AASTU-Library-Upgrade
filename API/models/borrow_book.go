package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Borrow_Book struct {
	ID          primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	BorrowedAt  time.Time 			 `json:"borrow_time"`
	ReturnedAt  time.Time 			 `json:"return_time"`
	BookID      primitive.ObjectID   `json:"book_id" bson:"book_id,omitempty"`
	UserID      primitive.ObjectID   `json:"user_id" bson:"user_id,omitempty"`

}