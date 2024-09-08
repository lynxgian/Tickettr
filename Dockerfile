FROM node:latest

RUN mkdir -p /app
WORKDIR /app


COPY . /app
COPY .env.example .env


RUN npm install

RUN npx prisma generate --no-engine

EXPOSE 3000

CMD ["npm", "run", "start-bot"]
