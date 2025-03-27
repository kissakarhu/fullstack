import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const addNewNumber = newNumber => {
    return axios.post(baseUrl, newNumber)
}

export default { getAll, addNewNumber }