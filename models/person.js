const mongo = require('mongoose')

const url = 'mongodb://fullstack:A49NVuTjduafn2L@ds137650.mlab.com:37650/phonebook'

mongo.connect(url)

const personSchema = new mongoose.Schema(
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

const Person = mongoose.model('Person', personSchema)

module.ecports = Person