package models

import "time"

type CheckIn struct {
	ID         string     `bson:"_id,omitempty" json:"id"`
	UserID     string     `json:"user_id"`
	StudentID  string     `json:"student_id"`
	CheckInAt  time.Time  `json:"checkin_at"`
	CheckOutAt *time.Time `json:"checkout_at,omitempty"`
}
