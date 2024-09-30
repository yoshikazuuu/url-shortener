package logger

import (
	"log"
)

const (
	Reset  = "\033[0m"
	Red    = "\033[31m"
	Green  = "\033[32m"
	Yellow = "\033[33m"
)

func LogMessage(level string, message string) {
	var color string
	switch level {
	case "INFO":
		color = Green
	case "WARN":
		color = Yellow
	case "ERROR":
		color = Red
	default:
		color = Reset
	}
	log.Printf("%s%s: %s%s\n", color, level, message, Reset)
}
