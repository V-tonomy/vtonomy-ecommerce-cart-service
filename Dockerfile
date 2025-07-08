FROM node:20

WORKDIR /app

COPY ./package*.json .
COPY ./tsconfig*.json .

RUN npm install

COPY . .

EXPOSE 3004
CMD ["npm", "run", "start:dev"]