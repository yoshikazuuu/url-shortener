package config

import (
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

var (
	RedisClient *redis.Client
	Ctx         = context.Background()
)

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),     // Host and port only
		Password: os.Getenv("REDIS_PASSWORD"), // Add this if your Redis instance uses a password
		DB:       0,                           // Optional, DB 0 is the default
	})

	if err := RedisClient.Ping(Ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
}
