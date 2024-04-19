FROM node:latest

WORKDIR /bot

COPY package*.json ./

COPY . .

CMD ["npm", "run", "start-bot"]