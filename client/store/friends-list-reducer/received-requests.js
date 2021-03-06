import axios from 'axios';
import history from '../../history';
import {
  add as addFriend
} from './';
import socket from '../../socket';

/**
 * ACTION TYPES
 */
const GET_RECEIVED_REQUESTS = 'GET_RECEIVED_REQUESTS';
const REMOVE_RECEIVED_REQUEST = 'REMOVE_RECEIVED_REQUEST';
const APPROVE_RECEIVED_REQUEST = 'APPROVE_RECEIVED_REQUEST';
const ADD_RECEIVED_REQUEST = 'ADD_RECEIVED_REQUEST';

/**
 * INITIAL STATE
 */
const defaultList = [];

/**
 * ACTION CREATORS
 */
const get = receivedRequests => ({
  type: GET_RECEIVED_REQUESTS,
  receivedRequests,
});
const remove = requesterId => ({
  type: REMOVE_RECEIVED_REQUEST,
  requesterId,
});
const approve = () => ({
  type: APPROVE_RECEIVED_REQUEST,
});
const add = (request) => ({
  type: ADD_RECEIVED_REQUEST,
  request
});

/**
 * THUNK CREATORS
 */

export const approveRequest = (userId, friendId) => dispatch => {
  // console.log('approve req', userId ,senderId)
  axios
    .put(`/api/users/${userId}/approve-request`, {
      friendId,
    })
    .then(res => {
      dispatch(remove(friendId));
      dispatch(addFriend(res.data));
      socket.emit('accept-request', {
        friendId,
        userId
      })
    });
};

export const getReceivedRequests = userId => dispatch =>
  axios
  .get(`/api/users/${userId}/received-requests`)
  .then(res => dispatch(get(res.data)))
  .catch(err => console.log(err));

export const declineRequest = (userId, friendId) => dispatch =>
  axios
  .put(`/api/users/${friendId}/cancel-request`, {
    friendId: userId
  })
  .then(() => {
    dispatch(remove(friendId))
    socket.emit('decline-request', {
      friendId,
      userId
    })
  })
  .catch(err => console.log(err));

export const declineRequestSocket = (requestId) => dispatch =>
  axios
  .get(`/api/users/simple/${requestId}`)
  .then(res => dispatch(remove(res.data.id)))
  .catch(err => console.log(err));

export const addRequestSocket = (requestId) => dispatch =>
  axios
  .get(`/api/users/simple/${requestId}`)
  .then(res => dispatch(add(res.data)))
  .catch(err => console.log(err));

export const acceptRequestSocket = (userId) => dispatch =>
  axios
  .get(`/api/users/simple/${userId}`)
  .then(res => dispatch(addFriend(res.data)))
  .catch(err => console.log(err));

/**
 * REDUCER
 */
export default function (state = defaultList, action) {
  switch (action.type) {
    case GET_RECEIVED_REQUESTS:
      return action.receivedRequests;
    case REMOVE_RECEIVED_REQUEST:
      return state.filter(request => request.id !== action.requesterId);
    case APPROVE_RECEIVED_REQUEST:
      return state.map(map => map.id !== action.requester.id);
    case ADD_RECEIVED_REQUEST:
      return [...state, action.request];
    default:
      return state;
  }
}
