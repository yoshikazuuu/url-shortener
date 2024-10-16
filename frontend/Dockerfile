FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm i

ENV PATH /app/node_modules/.bin:$PATH

# Copy .env for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

RUN npm run build

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/html/

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]
