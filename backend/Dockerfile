# Use golang image as base
FROM golang:1.22-alpine

# Install git
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum first to leverage Docker cache
COPY go.mod .
COPY go.sum .

# Download dependencies
RUN go mod download

# Copy the entire project
COPY . .

# Tidy up the go modules
RUN go mod tidy

# Build the Go application
RUN go build -o main .

# Command to be executed when the container starts
CMD ["./main"]