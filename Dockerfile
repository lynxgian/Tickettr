FROM node:latest

WORKDIR /

COPY package*.json ./

COPY . .
COPY .env.example .env


RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start-bot"]
