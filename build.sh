docker build --platform=linux/amd64 --push -t yoshikazuuu/url-shortener-backend:latest ./backend
docker build --platform=linux/amd64 --push -t yoshikazuuu/url-shortener-frontend:latest ./frontend

docker push yoshikazuuu/url-shortener-backend:latest
docker push yoshikazuuu/url-shortener-frontend:latest
