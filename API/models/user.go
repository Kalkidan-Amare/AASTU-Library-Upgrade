package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID            primitive.ObjectID   `json:"id,omitempty" bson:"_id,omitempty"`
	Username      string               `bson:"username" json:"username"`
	Email         string               `bson:"email" json:"email"`
	StudentId     string               `json:"student_id" bson:"student_id,omitempty"`
	Password      string               `bson:"password" json:"password"`
	Role          string               `bson:"role" json:"role"`
	BorrowedBooks []primitive.ObjectID `bson:"borrowed_books" json:"borrowed_books"`
	IsCheckedIn   bool                 `bson:"is_checked_in" json:"is_checked_in"`
	Approved      bool                 `bson:"approved" json:"approved"`
	Sex           string               `bson:"sex" json:"sex"`
	Department    string               `bson:"department" json:"department"`
	EntryBatch    string               `bson:"entry_batch" json:"entry_batch"`
	ImgURL        string               `bson:"img_url" json:"img_url"`
}

type LoginAdmin struct {
	Email	 string `json:"email"`
	Password string `json:"password"`
}

type CheckStudent struct {
	StudentId string `json:"student_id"`
}

type ApproveStaff struct {
	StaffId primitive.ObjectID `json:"staff_id"`
	Approved bool `json:"approved"`
}