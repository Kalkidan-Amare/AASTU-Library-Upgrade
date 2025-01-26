package data

import (
	"context"
	"fmt"
	"time"

	"aastu_lib/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	checkinCollection *mongo.Collection
	location          *time.Location
)

func init() {
	var err error
	location, err = time.LoadLocation("Africa/Addis_Ababa")
	if err != nil {
		panic(err) // ToDo Handle this appropriately
	}
}

func SetCheckinCollection(client *mongo.Client) {
	checkinCollection = client.Database("BookManager").Collection("CheckIns")
}

func CreateCheckInRecord(checkIn models.CheckIn) error {
	_, err := checkinCollection.InsertOne(context.Background(), checkIn)

	return err
}

func GetCheckInRecord(studentID string) (models.CheckIn, error) {
	var checkIn models.CheckIn
	err := checkinCollection.FindOne(context.Background(), bson.M{"studentid": studentID}).Decode(&checkIn)

	return checkIn, err
}

// func UpdateCheckOutTime(checkIn models.CheckIn, checkoutTime string) error {
// 	_, err := checkinCollection.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": checkIn.ID},
// 		bson.M{"$set": bson.M{"checkout_at": checkoutTime}},
// 	)
// 	if err != nil {
// 		return err
// 	}
// 	fmt.Printf("Check-out time updated: %+v\n", checkIn)
// 	fmt.Println(checkoutTime)

// 	return nil
// }


func UpdateCheckIn(checkIn models.CheckIn) error {
	// Validate and parse the CheckIn ID
	objectID, err := primitive.ObjectIDFromHex(checkIn.ID)
	if err != nil {
		return fmt.Errorf("invalid check-in ID: %v", err)
	}

	// Define the update operation
	update := bson.M{
		"$set": bson.M{
			"userid":     checkIn.UserID,
			"studentid":  checkIn.StudentID,
			"checkinat":  checkIn.CheckInAt,
			"checkoutat": checkIn.CheckOutAt,
		},
	}

	// Perform the update
	_, err = checkinCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID}, // Match by ObjectID
		update,
	)

	if err != nil {
		return fmt.Errorf("failed to update check-in: %v", err)
	}

	return nil
}


func GetStudentCheckInsInInterval(startTimeStr, endTimeStr string) ([]models.CheckIn, error) {
	var checkIns []models.CheckIn

	// Parse the input start and end time strings into time.Time
	startTime, err := time.Parse("2006-01-02 15:04", startTimeStr)
	if err != nil {
		return nil, fmt.Errorf("invalid start time format: %v", err)
	}

	endTime, err := time.Parse("2006-01-02 15:04", endTimeStr)
	if err != nil {
		return nil, fmt.Errorf("invalid end time format: %v", err)
	}

	// Fetch all check-ins
	cursor, err := checkinCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var checkIn models.CheckIn
		if err := cursor.Decode(&checkIn); err != nil {
			return nil, err
		}

		// Parse `checkin_at` and `checkout_at` strings into time.Time
		var checkInTime, checkOutTime time.Time
		if checkIn.CheckInAt != "" {
			checkInTime, err = time.Parse("2006-01-02 15:04", checkIn.CheckInAt)
			if err != nil {
				// Skip invalid date formats
				continue
			}
		}

		if checkIn.CheckOutAt != "" {
			checkOutTime, err = time.Parse("2006-01-02 15:04", checkIn.CheckOutAt)
			if err != nil {
				// Skip invalid date formats
				continue
			}
		}

		// Check if either `checkin_at` or `checkout_at` falls within the interval
		if (checkInTime.After(startTime) && checkInTime.Before(endTime)) || 
		   (checkOutTime.After(startTime) && checkOutTime.Before(endTime)) {
			checkIns = append(checkIns, checkIn)
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return checkIns, nil
}


func GetUserCheckIns(studentID, startDate, endDate string) ([]models.CheckIn, error) {
	var checkIns []models.CheckIn

	// Filter to find check-ins for the given student
	filter := bson.M{"studentid": studentID}

	// Fetch all records if the dates are not in ISO 8601 format
	cursor, err := checkinCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	// Parse the start and end dates
	startTime, err := time.Parse("2006-01-02 15:04", startDate)
	if err != nil {
		return nil, fmt.Errorf("invalid start date format: %v", err)
	}
	endTime, err := time.Parse("2006-01-02 15:04", endDate)
	if err != nil {
		return nil, fmt.Errorf("invalid end date format: %v", err)
	}

	// Manually filter the records
	for cursor.Next(context.Background()) {
		var checkIn models.CheckIn
		if err := cursor.Decode(&checkIn); err != nil {
			return nil, err
		}

		// Parse `checkin_at` as a string into a time.Time object
		checkInTime, err := time.Parse("2006-01-02 15:04", checkIn.CheckInAt)
		if err != nil {
			// Skip invalid dates
			continue
		}
		// fmt.Printf("Check-in time: %v\n", checkInTime)

		// Filter based on the date range
		if checkInTime.After(startTime) && checkInTime.Before(endTime) {
			checkIns = append(checkIns, checkIn)
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return checkIns, nil
}

func GetDailyCheckIns(date string) ([]models.CheckIn, error) {
	var checkIns []models.CheckIn

	// Parse the input date string into time.Time
	targetDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		return nil, fmt.Errorf("invalid date format: %v", err)
	}

	// Fetch all check-ins
	cursor, err := checkinCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var checkIn models.CheckIn
		if err := cursor.Decode(&checkIn); err != nil {
			return nil, err
		}

		// Parse `checkin_at` string into time.Time
		checkInTime, err := time.Parse("2006-01-02 15:04", checkIn.CheckInAt)
		if err != nil {
			// Skip invalid date formats
			continue
		}

		// Check if the date part matches the target date
		if checkInTime.Year() == targetDate.Year() && checkInTime.Month() == targetDate.Month() && checkInTime.Day() == targetDate.Day() {
			checkIns = append(checkIns, checkIn)
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return checkIns, nil
}