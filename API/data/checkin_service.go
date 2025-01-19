package data

import (
	"context"
	"time"

	"aastu_lib/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var checkinCollection *mongo.Collection

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

func UpdateCheckOutTime(checkIn models.CheckIn) error {
	_, err := checkinCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": checkIn.ID},
		bson.M{"$set": bson.M{"checkoutat": time.Now()}},
	)

	return err
}

func GetStudentCheckInsInInterval(startTime, endTime time.Time) ([]models.CheckIn, error) {
	var checkIns []models.CheckIn

	// Query to find students in the given time interval
	filter := bson.M{
		"$or": []bson.M{
			{"checkin_at": bson.M{"$lte": endTime, "$gte": startTime}},
			{"checkout_at": bson.M{"$lte": endTime, "$gte": startTime}},
		},
	}

	cursor, err := checkinCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var checkIn models.CheckIn
		if err := cursor.Decode(&checkIn); err != nil {
			return nil, err
		}
		checkIns = append(checkIns, checkIn)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return checkIns, nil
}

func GetUserCheckIns(studentID string, startDate time.Time, endDate time.Time) ([]models.CheckIn, error) {
	var checkIns []models.CheckIn

	// Filter to find check-ins for the given student within the specified date range
	filter := bson.M{
		"studentid": studentID,
		"checkin_at": bson.M{"$gte": startDate, "$lte": endDate},
	}

	cursor, err := checkinCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var checkIn models.CheckIn
		if err := cursor.Decode(&checkIn); err != nil {
			return nil, err
		}
		checkIns = append(checkIns, checkIn)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return checkIns, nil
}
