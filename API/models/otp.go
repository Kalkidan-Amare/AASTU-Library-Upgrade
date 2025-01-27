package models

import "time"

type OTP struct {
	Otp        string    `json:"otp"`
	Username   string    `bson:"username" json:"username"`
	Email      string    `bson:"email" json:"email"`
	StudentId  string    `json:"student_id" bson:"student_id,omitemptly"`
	Password   string    `bson:"password" json:"password"`
	Role       string    `bson:"role" json:"role"`
	ExpiresAt  time.Time `bson:"expires_at"`
	Sex        string    `json:"sex"`
	Department string    `json:"department"`
	EntryBatch string    `json:"entry_batch"`
	ImgUrl     string    `json:"img_url"`
}

type OTPRequest struct {
	Otp   string `json:"otp"`
	Email string `json:"email"`
}

type OTPResetPassword struct {
	Otp      string `json:"otp"`
	Email    string `json:"email"`
	Password string `json:"newpassword"`
}