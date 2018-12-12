const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

morgan.token('body', function getId(req) {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))


app.get('/info', (request, response) => {
    response.send(`<p>Puhelinluettelossa on ${persons.size} henkilön tiedot</p>
    <div>${new Date()}</div>`)
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(response.json(response.json(persons)))
})

app.post('/api/persons', (request, response) => {

    if (request.body.name == undefined){
        return response.status(400).json({error:'Missing name'})
    }
    if (request.body.number == undefined){
        return response.status(400).json({error:'Missing number'})
    }
    //if(persons.map(person => person.name === request.body.name)){
        //return response.status(400).json({error:'Name already in use'})
    //}
    const person = new Person ({
        name: request.body.name,
        number: request.body.number,
    })

    person
        .save()
        .then(response.json(person))

})

app.get('/api/persons/:id', (request, response) => {
    const person = Person.findById(request.parmas.id)

    if ( person ) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})