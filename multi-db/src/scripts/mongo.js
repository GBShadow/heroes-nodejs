docker exec -it database_mongo mongo -u gbshadow -p mongo --authenticationDatabase heroes
show dbs
use heroes
show collections
db.heroes.insert({
name: 'Flash',
power: 'Velocidade',
bithDate: '14-03-1989'
})

db.heroes.find()
db.heroes.find().pretty()
