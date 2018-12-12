import React from 'react';

const Person = ({ person, removePerson }) => {
    return (
        <div>
            <li>{person.name} {person.number}
            <button name={person.name} id={person.id} onClick={removePerson}>Poista</button></li>
        </div>
        )
}

export default Person