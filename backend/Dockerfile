# Use the official Golang image for building
FROM golang:1.21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Go module files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Use a minimal Alpine-based image for deployment
FROM alpine:latest

# Create a directory for the app
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose the port
EXPOSE 8080

# Run the application
CMD ["./main"]