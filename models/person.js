const mongo = require('mongoose')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongo.connect(url)

const personSchema = new mongo.Schema(
    {
        name: String,
        number: String
    }
)

personSchema.statics.format = (person) => (
    {
        name: person.name,
        number: person.number,
        id: person._id
    }
)

const Person = mongo.model('Person', personSchema)

module.exports = Person