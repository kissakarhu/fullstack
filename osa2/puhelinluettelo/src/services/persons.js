import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)

}

const addNewNumber = newNumber => {
    const request = axios.post(baseUrl, newNumber)
    return request.then(response => response.data)
}

export default { getAll, addNewNumber }