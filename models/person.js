const mongo = require('mongoose')

const url = 'mongodb://fullstack:A49NVuTjduafn2L@ds137650.mlab.com:37650/phonebook'

mongo.connect(url)

const Person = mongo.model('Person',{
    name: String,
    number: String,
})

Person.statics.format = (person) => (
    {
        name: person.name,
        number: person.number,
        id: person._id
    }
)

module.ecports = Person