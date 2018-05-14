import io from 'socket.io-client'
import store, {
  getMessages
} from './store';

const socket = io(window.location.origin)
// this is front-end
socket.on('connect', () => {
  console.log('SOCKET CONNECTED TO SERVER!!!');
  socket.on('new-message', message => {
    console.log("new-message received in socket.js!!: ",
      message);
    store.dispatch(getMessages(message));
  });

  socket.on('delete-friend', data => {
    alert(data.friend);
    //   call the thunk to remove use from friendlist
  })
})

export default socket
