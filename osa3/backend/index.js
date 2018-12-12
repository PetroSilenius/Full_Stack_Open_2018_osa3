const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function getId(req) {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123457",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.get('/info', (request, response) => {
    response.send(`<p>Puhelinluettelossa on ${persons.size} henkilön tiedot</p>
    <div>${new Date()}</div>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    const person = {
        name: request.body.name,
        number: request.body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

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