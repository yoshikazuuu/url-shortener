package main

import (
	"log"
	"os"

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

	// CORS middleware with whitelist
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("FRONTEND_URL"),
		AllowMethods: "GET,POST,OPTIONS",     // Ensure OPTIONS method is allowed for preflight
		AllowHeaders: "Content-Type, Accept", // Add necessary headers
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	// Routes
	app.Post("/api/shorten", handler.ShortenURL)
	app.Get("/:id", handler.RedirectToURL)

	// Redirect root path to https://url.jer.ee
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect(os.Getenv("FRONTEND_URL"), 301)
	})

	// Test endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	log.Fatal(app.Listen(":8080"))
}
