package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "time"

    "github.com/gin-contrib/cors"
    "github.com/gin-contrib/gzip"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "github.com/dgrijalva/jwt-go"
    "github.com/gorilla/websocket"
    "github.com/go-redis/redis/v8"
    "github.com/joho/godotenv"
)

var client *mongo.Client
var redisClient *redis.Client
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool { return true },
}

func main() {
    // Load environment variables from .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Load MongoDB URI from environment variables
    mongoURI := os.Getenv("MONGO_URI")
    if mongoURI == "" {
        log.Fatal("MONGO_URI is not set in the environment variables")
    }

    // Connect to MongoDB
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    client, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Fatalf("Error connecting to MongoDB: %v", err)
    }
    log.Println("Connected to MongoDB!")

    // Connect to Redis
    redisClient = redis.NewClient(&redis.Options{
        Addr:     "localhost:6379",
        Password: "",
        DB:       0,
    })

    // Initialize Gin
    r := gin.Default()

    // Middleware
    r.Use(cors.Default())
    r.Use(gzip.Gzip(gzip.DefaultCompression))

    // Routes
    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Welcome to the Task Manager API!"})
    })

    // WebSocket route
    r.GET("/ws", WebSocketHandler)

    // Authentication routes
    r.POST("/register", Register)
    r.POST("/login", Login)

    // Task management routes
    r.GET("/tasks", GetTasks)
    r.POST("/tasks", CreateTask)
    r.DELETE("/tasks/:id", DeleteTask)
    r.PUT("/tasks/:id", UpdateTask)
    r.PUT("/tasks/:id/done", MarkAsDone)

    // Start Server
    r.Run(":8080")
}

// WebSocket handler for real-time updates
func WebSocketHandler(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Println("WebSocket upgrade error:", err)
        return
    }
    defer conn.Close()

    for {
        _, message, err := conn.ReadMessage()
        if err != nil {
            log.Println("WebSocket read error:", err)
            break
        }
        log.Printf("Received: %s", message)
        if err := conn.WriteMessage(websocket.TextMessage, []byte("Task updated!")); err != nil {
            log.Println("WebSocket write error:", err)
            break
        }
    }
}

// Fetch tasks with Redis caching
func GetTasks(c *gin.Context) {
    cacheKey := "tasks"
    cachedTasks, err := redisClient.Get(context.TODO(), cacheKey).Result()
    if err == nil {
        c.JSON(http.StatusOK, cachedTasks)
        return
    }

    collection := client.Database("task_manager").Collection("tasks")
    cursor, err := collection.Find(context.TODO(), map[string]interface{}{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
        return
    }
    defer cursor.Close(context.TODO())

    var tasks []map[string]interface{}
    if err := cursor.All(context.TODO(), &tasks); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode tasks"})
        return
    }

    redisClient.Set(context.TODO(), cacheKey, tasks, 5*time.Minute)
    c.JSON(http.StatusOK, tasks)
}

// Create a new task
func CreateTask(c *gin.Context) {
    var task struct {
        Title       string `json:"title"`
        Description string `json:"description"`
    }
    if err := c.ShouldBindJSON(&task); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    collection := client.Database("task_manager").Collection("tasks")
    _, err := collection.InsertOne(context.TODO(), task)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Task created successfully"})
}

// Delete a task by ID
func DeleteTask(c *gin.Context) {
    id := c.Param("id")
    collection := client.Database("task_manager").Collection("tasks")
    _, err := collection.DeleteOne(context.TODO(), map[string]interface{}{"_id": id})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

// Update a task by ID
func UpdateTask(c *gin.Context) {
    id := c.Param("id")
    var updatedTask struct {
        Title       string `json:"title"`
        Description string `json:"description"`
        Done        bool   `json:"done"`
    }
    if err := c.ShouldBindJSON(&updatedTask); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    collection := client.Database("task_manager").Collection("tasks")
    _, err := collection.UpdateOne(context.TODO(), map[string]interface{}{"_id": id}, map[string]interface{}{
        "$set": updatedTask,
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Task updated successfully"})
}

// Mark a task as done by ID
func MarkAsDone(c *gin.Context) {
    id := c.Param("id")
    collection := client.Database("task_manager").Collection("tasks")
    _, err := collection.UpdateOne(context.TODO(), map[string]interface{}{"_id": id}, map[string]interface{}{
        "$set": map[string]interface{}{"done": true},
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark task as done"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Task marked as done"})
}

// User Registration
func Register(c *gin.Context) {
    var user struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Save user to MongoDB (dummy implementation)
    collection := client.Database("task_manager").Collection("users")
    _, err := collection.InsertOne(context.TODO(), user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

// User Login
func Login(c *gin.Context) {
    var input struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Dummy user check
    if input.Username != "test" || input.Password != "test" {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Generate JWT token
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "username": input.Username,
        "exp":      time.Now().Add(time.Hour * 24).Unix(),
    })
    tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": tokenString})
}