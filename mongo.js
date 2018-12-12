const mongo = require('mongoose')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongo.connect(url)

const Person = mongo.model('Person',{
    name: String,
    number: String,
})

if (process.argv.length <=2) {
    Person
        .find({})
        .then(result => {
            console.log('Puhelinluettelo:')
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongo.connection.close()
        })
} else if (process.argv.length >= 4) {

    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(response => {
            console.log(`Lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
            mongo.connection.close()
        })
}
