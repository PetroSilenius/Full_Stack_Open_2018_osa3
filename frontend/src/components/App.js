import React from 'react';
import List from './List'
import personService from './services/persons'
import Notification from './Notification'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
            searchName: '',
            message: null,
        }
    }
    render() {
        return (
            <div>
                <h2>Puhelinluettelo</h2>
                <Notification message={this.state.message}/>
                Rajaa näytettäviä: <input value = {this.state.searchName} onChange={this.handleSearchChange}/>
                <h4> Lisää uusi </h4>
                <form onSubmit={this.addPerson}>
                    <div>
                        nimi: <input value={this.state.newName} onChange={this.handleNameChange}/>
                    </div>
                    <div>
                        numero : <input value={this.state.newNumber} onChange={this.handleNumberChange}/>
                    </div>
                    <div>
                        <button type="submit">lisää</button>
                    </div>
                </form>
                <h2>Numerot</h2>
                <List persons={this.state.persons} searchName={this.state.searchName} removePerson={this.removePerson}/>
            </div>
        )
    }

    componentDidMount() {
        console.log('did mount')
        personService
            .getAll()
            .then(response => {
                console.log('promise fulfilled')
                this.setState({persons: response})
            })
    }

    handleNameChange = (event) => {
        console.log(event.target.value)
        this.setState({newName: event.target.value})
    }

    handleNumberChange = (event) => {
        console.log(event.target.value)
        this.setState({newNumber: event.target.value})
    }

    handleSearchChange = (event) => {
        console.log(event.target.value)
        this.setState({searchName: event.target.value})
    }

    addPerson = (event) => {
        event.preventDefault()
        const personObject = {
            name: this.state.newName,
            number: this.state.newNumber
        }

        let id = -1
        this.state.persons.forEach(person => person.name === personObject.name ? id = person.id : 0)

        if(this.state.persons.find(p => p.name === this.state.newName )){
            if(window.confirm(`${this.state.newName} on jo luettelossa, korvataanko vanha numero uudella?`)){
                personService
                    .update(id, personObject)
                    .then(response =>{
                        this.setState({
                            persons: this.state.persons.concat(response),
                            message: `Muutettiin ${response.name} tietoja`
                        })
                        setTimeout(() => {
                            this.setState({message: null})
                        }, 2000)
                    })
                    //Jos henkilö poistetaan toisesta selaimesta juuri kun tietoja
                    // ollaan muokkaamassa, ilmoitetaan asiasta käyttäjälle
                    .catch(error => {
                        this.setState({
                            message: `${this.state.newName} on jo poistettu palvelimelta`
                        })
                        setTimeout(() => {
                            this.setState({message: null})
                        }, 2000)
                    })
            }
            return
        }
        personService
            .create(personObject)
            .then(response => {
                this.setState({
                    persons: this.state.persons.concat(response),
                    message: `Lisättiin ${response.name}`
                })
                setTimeout(() => {
                    this.setState({message: null})
                }, 2000)
            })


        this.setState({
            newName: '',
            newNumber: ''
        })
    }

    removePerson = (event) => {
        const id = event.target.getAttribute('id')
        const name = event.target.getAttribute('name')

        if(window.confirm(`Poistetaanko ${name}?`)){
            personService
                .remove(id)

            this.setState({
                persons: this.state.persons.filter(person => person.id !== id),
                message: `Poistettiin ${name}`
            })
            setTimeout(() => {
                this.setState({message: null})
            }, 2000)
        }
    }
}

export default App