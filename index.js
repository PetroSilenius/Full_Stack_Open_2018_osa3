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
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
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
        number: request.body.number
    })

    Person
        .findOne({name: request.body.name})
        .then(result => {
            if (result){
                return response.status(400).json({error:'Person already exists'})
            } else {
                person.save()
                    .then(person => response.json(Person.format(person)))
                    .catch(error => {
                        console.log(error)
                        response.status(500).end()
                    })
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(Person.format(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(404).end({error: 'malformatted id'})
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(response.status(204).end())
        .catch(error => {
            response.status(400).send({error: 'Person does not exist'})
        })
})

app.put('/api/persons/:id'), (request, response) => {

    if(request.body.name === undefined) {
        return response.status(400).json({error: 'Missing name'})
    }
    if(request.body.number === undefined) {
        return response.status(400).json({error: 'Missing number'})
    }

    const person = {
        name : request.body.name,
        number: request.body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person,{new: true})
        .then(person => {
            response.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
        })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})