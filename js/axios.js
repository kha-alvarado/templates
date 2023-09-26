import axios from 'axios';

export default axios.create({
    baseURL: 'http://192.168.10.45:3001'
})