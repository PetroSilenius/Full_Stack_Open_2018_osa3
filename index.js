const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', function getId(req) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

const logger = (request, response, next) => {
    console.log('Method:',request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.static('build'))
app.use(logger)


const formatPerson = (person) => (
    {
        name: person.name,
        number: person.number,
        id: person._id
    }
)

app.get('/info', (request, response) => {
    Person
        .find({})
        .then(persons => response.send(
        `<div>Puhelinluettelossa on ${persons.length} henkilön tiedot</div>
        <div>${new Date()}</div>`))
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(Person.format))
        })
})

app.post('/api/persons', (request, response) => {

    if (request.body.name === undefined){
        return response.status(400).json({error:'Missing name'})
    }
    if (request.body.number === undefined){
        return response.status(400).json({error:'Missing number'})
    }

    const person = new Person ({
        name: request.body.name,
        number: request.body.number,
        id: request.body._id
    })

    person
        .save()
        .then(response.json(Person.format(person)))

})

app.get('/api/persons/:id', (request, response) => {
    const person = Person.findById(request.parmas.id)

    if ( person ) {
        response.json(Person.format(person))
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})