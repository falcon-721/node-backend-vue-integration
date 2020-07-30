import axios from 'axios';
import Vue from 'vue';
import VueFlashMessage from 'vue-flash-message';
import 'vue-flash-message/dist/vue-flash-message.min.css';

Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 3000,
    pauseOnInteract: true
  }
});

const vm = new Vue();

const baseURL = 'https://3peat.dev/chargebee';

//const baseURL = 'http://localhost/api/chargebee';


//const baseURL = 'https://api-integration1.herokuapp.com/chargebee';
// const baseURL = 'http://3peatdigital.com/api/backend/chargebee'; 
//const baseURL = 'http://localhost:4000/chargebee';

const handleError = fn => (...params) =>
  fn(...params).catch(error => {
    vm.flash(`${error.response.status}: ${error.response.statusText}`, 'error');
  });

export const api = {
  getChargebees: handleError(async () => {
    const res = await axios.get(baseURL + '/all.php');




    return res.data;
  })
  // gettasks: handleError(async () => {
  //   const res = await axios.get(baseURL);
  //   return res.data;
  // }),
  // deletetask: handleError(async id => {
  //   const res = await axios.delete(baseURL + id);
  //   return res.data;
  // }),
  // createtask: handleError(async payload => {
  //   const res = await axios.post(baseURL, payload);
  //   return res.data;
  // }),
  // updatetask: handleError(async payload => {
  //   const res = await axios.put(baseURL + payload._id, payload);
  //   return res.data;
  // })
};