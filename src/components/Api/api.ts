import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat-apix.herokuapp.com';

export default axios.create({
  baseURL: REACT_APP_API_URL
});
