package redis

import (
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/yoshikazuuu/url-shortener/config"
)

var Nil = redis.Nil

func SaveURL(id string, url string) error {
	return config.RedisClient.Set(config.Ctx, id, url, 24*time.Hour).Err()
}

func GetURL(id string) (string, error) {
	return config.RedisClient.Get(config.Ctx, id).Result()
}

func CustomIDExists(id string) (bool, error) {
	_, err := config.RedisClient.Get(config.Ctx, id).Result()
	if err == redis.Nil {
		return false, nil
	}
	return err == nil, err
}
