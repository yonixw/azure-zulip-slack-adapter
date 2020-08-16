FROM node:12-slim
CMD node server.js
WORKDIR /app/usr/

COPY package* /app/usr/
RUN npm install
COPY . . 

