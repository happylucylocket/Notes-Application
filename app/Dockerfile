FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]

# FROM postgres:15.2
# ENV POSTGRES_USER=postgres \
#     POSTGRES_PASSWORD=root \
#     POSTGRES_DB=postgres
# COPY init.sql /docker-entrypoint-initdb.d/
