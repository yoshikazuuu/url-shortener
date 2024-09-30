package handler

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/teris-io/shortid"
	"github.com/yoshikazuuu/url-shortener/logger"
	"github.com/yoshikazuuu/url-shortener/redis"
)

func ShortenURL(c *fiber.Ctx) error {
	var request struct {
		URL      string `json:"url"`
		CustomID string `json:"customID"`
	}

	if err := c.BodyParser(&request); err != nil {
		logger.LogMessage("ERROR", "Invalid request")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	id := request.CustomID
	if id == "" {
		var err error
		id, err = shortid.Generate()
		if err != nil {
			logger.LogMessage("ERROR", "Failed to generate short ID")
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate short ID"})
		}
	} else {
		exists, err := redis.CustomIDExists(id)
		if err != nil || exists {
			logger.LogMessage("WARN", "Custom ID already exists: "+id)
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Custom ID already exists"})
		}
	}

	if err := redis.SaveURL(id, request.URL); err != nil {
		logger.LogMessage("ERROR", "Failed to save URL")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save URL"})
	}

	shortURL := os.Getenv("SERVER_URL") + "/" + id
	logger.LogMessage("INFO", "Shortened URL created: "+shortURL)
	return c.JSON(fiber.Map{"shortURL": shortURL})
}

func RedirectToURL(c *fiber.Ctx) error {
	id := c.Params("id")

	url, err := redis.GetURL(id)
	if err != nil {
		if err == redis.Nil {
			logger.LogMessage("WARN", "Short URL not found: "+id)
			return c.Status(fiber.StatusNotFound).SendString("Short URL not found")
		}
		logger.LogMessage("ERROR", "Failed to retrieve URL")
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to retrieve URL")
	}

	logger.LogMessage("INFO", "Redirecting to: "+url)
	return c.Redirect(url, fiber.StatusTemporaryRedirect)
}
