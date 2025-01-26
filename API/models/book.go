package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Book struct {
	ID          primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Barcode     string `json:"bar_code"`
	IsAvailable bool   `json:"status"`
	ShelfNo	 	string `json:"shelf_no"`
	Author      string `json:"author"`

	//ToDo add Tags for more filter...
	//ToDo add ISBN, photo
}