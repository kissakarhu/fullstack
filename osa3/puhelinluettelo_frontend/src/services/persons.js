import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)

}

const addNewNumber = newNumber => {
    const request = axios.post(baseUrl, newNumber)
    return request.then(response => response.data)
}

const deleteNumber = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const updateNumber = (id, updatedNumber) => {
    const request = axios.put(`${baseUrl}/${id}`, updatedNumber)
    return request.then(response => response.data)
}

export default { getAll, addNewNumber, deleteNumber, updateNumber }