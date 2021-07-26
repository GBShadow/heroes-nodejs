docker run \
  --name database_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=heroes \
  -p 5432:5432 \
  -d postgres

docker ps
docker exec -it database_postgres /bin/bash

docker run \
  --name adminer \
  -p 8080:8080 \ 
  --link postgres:database_postgres \
  -d adminer

docker run \ 
  --name database_mongo \
  -p 27017:27017 \ 
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=mongo \
  -d mongo

docker run --name mongoClient -p 3001:3000 --link database_mongo:mongodb -d mongoclient/mongoclient  

docker exec -it database_mongo mongo --host localhost -u admin -p mongo --authenticationDatabase admin --eval "db.getSiblingDB('heroes').createUser({user: 'gbshadow', pwd: 'mongo', roles: [{role: 'readWrite', db: 'heroes'}]})"

