package models

// import "time"

type CheckIn struct {
	ID         string     `bson:"_id,omitempty" json:"id"`
	UserID     string     `json:"user_id"`
	StudentID  string     `json:"student_id"`
	CheckInAt  string  `json:"checkin_at"`
	CheckOutAt string `json:"checkout_at"`
}
