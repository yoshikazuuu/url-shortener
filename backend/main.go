package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/teris-io/shortid"
)

var (
	redisClient *redis.Client
	ctx         = context.Background()
)

func main() {
	// Initialize Redis client
	redisClient = redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_ADDR"),
	})

	// Check Redis connection
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024, // 10MB
	})

	// CORS middleware
	app.Use(cors.New())

	// Routes
	app.Post("/shorten", shortenURL)
	app.Get("/:id", redirectToURL)

	log.Fatal(app.Listen(":8080"))
}

func shortenURL(c *fiber.Ctx) error {
	var request struct {
		URL string `json:"url"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	id, err := shortid.Generate()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate short ID"})
	}

	// Save URL to Redis
	err = redisClient.Set(ctx, id, request.URL, 24*time.Hour).Err()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save URL"})
	}

	shortURL := "http://localhost:8080/" + id
	return c.JSON(fiber.Map{"shortURL": shortURL})
}

func redirectToURL(c *fiber.Ctx) error {
	id := c.Params("id")

	// Retrieve URL from Redis
	url, err := redisClient.Get(ctx, id).Result()
	if err == redis.Nil {
		return c.Status(fiber.StatusNotFound).SendString("Short URL not found")
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to retrieve URL")
	}

	// Redirect to the original URL
	return c.Redirect(url, fiber.StatusTemporaryRedirect)
}
