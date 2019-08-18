import axios from 'axios';

export default axios.create({
  baseURL: (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat-apix.herokuapp.com')
});