FROM golang:1.22-alpine

WORKDIR /app

# Copy go mod file
COPY go.mod ./

# Copy source code
COPY *.go ./

# Download all dependencies and generate go.sum
RUN go mod download
RUN go mod tidy

# Build the Go app
RUN go build -o main .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
