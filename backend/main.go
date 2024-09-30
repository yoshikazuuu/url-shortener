package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/yoshikazuuu/url-shortener/config"
	"github.com/yoshikazuuu/url-shortener/handler"
)

func main() {
	config.InitRedis() // Initialize Redis client

	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024, // 10MB
	})

	// CORS middleware
	app.Use(cors.New())

	// Routes
	app.Post("/api/shorten", handler.ShortenURL)
	app.Get("/:id", handler.RedirectToURL)

	log.Fatal(app.Listen(":8080"))
}
