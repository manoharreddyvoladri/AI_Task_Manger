package main

import (
    "context"
    "fmt"
    "log"
    "time"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    // Replace this with your actual MongoDB URI
    mongoURI := "mongodb+srv://zocket_ai_task:momZZVeM0Cuxjtco@cluster0.kn641.mongodb.net/"

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Fatalf("Error connecting to MongoDB: %v", err)
    }

    fmt.Println("Connected to MongoDB!")
    defer client.Disconnect(ctx)
}