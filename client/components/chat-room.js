import React, { Component } from 'react';
import events from './events';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';
import axios from 'axios';
import { ChatMessage } from './index';
import {
  getVisits,
  deleteVisit,
  updateVisit,
  addVisit,
  getParksAddresses,
  getMessages,
} from '../store';
import store, { getAllMessages, addMessage } from '../store';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { timeDisplay, dateDisplay } from './global';
import { isNull } from 'util';
import { Segment, Feed, Message, Form } from 'semantic-ui-react';
import socket from '../socket';

// const socket = io(window.location.origin)

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      chatValue: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.state.messages = getAllMessages();
    this.state = store.getState();
    this.chatChange = this.chatChange.bind(this);
    this.focusChat = this.focusChat.bind(this);
  }

  componentDidMount() {
    this.props.getData();
    // console.log("this.props.match.params.id: ", this.props.match.params.id);
    this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillUpdate() {
    axios.get('/api/messages').then(response => {
      // console.log("response.data: ", response.data, response.data.length);
      // console.log("this.state.messages: ", this.state.messages, this.state.messages.length);
      let newData = response.data.length != this.state.messages.length;
      // console.log("data different? ", newData);
      // if (newData) {
      // console.log("data different is true");
      // this.setState({
      //     messages:response.data
      // })
      //         return
      // }
      //     return
    });
    return;
  }
  handleSubmit(event) {
    // socket.emit('new-message',
    //     {"message content":event.target.messageBody.value}
    // );
    let postBody = {
      sent: new Date(Date.now()),
      content: event.target.messageBody.value,
      posterId: this.props.user.id,
      eventId: this.props.eventId,
    };
    this.setState({
      chatValue: '',
    });
    this.props.addMessage(postBody);
    // axios.post('/api/messages', postBody).then(response => {
    //     console.log("created new message: ", response.data);
    //     this.setState({
    //         messages:[response.data].concat(this.state.messages),
    //     })
    // })
  }
  chatChange(e) {
    this.setState({
      chatValue: e.target.value,
    });
  }
  focusChat() {
    var element = document.getElementById('feedId');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
    console.log('element: ', element);
  }
  render() {
    // var element = this.refs.feedId;
    // console.log("element: ", element);
    // if (element) {
    //     element.scrollTop = element.scrollHeight;
    // }
    this.focusChat();
    return (
      <div
        className="container"
        style={{
          padding: '0.5em',
          height: '73vh',
          // "overflowY":"scroll"
        }}
      >
        <Segment style={{ padding: 0 }}>
          <Feed
            style={{
              height: '63vh',
              overflowY: 'scroll',
              padding: '1em 0.5em',
            }}
            id="feedId"
            ref={feed => {
              this.messageFeed = feed;
            }}
          >
            {this.props.messages.map(message => {
              return <ChatMessage message={message} key={message.id} />;
            })}
          </Feed>
        </Segment>
        {
          //MOST RECENT COMMENTS AT THE BOTTOM -> WHEN GENERATING ARRAY, LARGER TIMES GO IN...
        }
        <Form onSubmit={this.handleSubmit} unstackable>
          <Form.Group>
            <Form.TextArea
              required
              width={12}
              rows={1}
              style={{ marginBottom: '0.5em' }}
              placeholder="Write message"
              name="messageBody"
              value={this.state.chatValue}
              onChange={this.chatChange}
            />
            <Form.Button
              width={4}
              content="Post"
              type="submit"
              style={{
                marginBottom: '10px',
                background: '#54b9bf',
                width: '100%',
                height: '80%',
              }}
            />
          </Form.Group>
        </Form>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  let messages = state.messages.filter(message => message.poster);
  messages = messages.filter(message => message.event.id == ownProps.eventId);
  messages.forEach(message => {
    let timeObj = new Date(message.createdAt);
    message.time = timeObj.toString();
    let timeSplit = message.time.split(' ');
    let DoW = timeSplit[0];
    let month = timeSplit[1];
    let date = timeSplit[2];
    let year = timeSplit[3];
    let timeString = timeSplit[4].slice(0, -3);
    let longTime =
      DoW + ' ' + month + ' ' + date + ' ' + year + ' ' + timeString;
    let shortTime = month + ' ' + date + ' ' + timeString;
    shortTime = timeString;
    const daysDiff = Math.floor(new Date().getDate() - timeObj.getDate());
    const timeDiff = Math.abs(new Date().getTime() - timeObj.getTime()) / 36e5;
    const timeElapsed =
      timeDiff < 1
        ? Math.floor(timeDiff * 60) === 0 ? 'now' : (`${Math.floor(timeDiff * 60)} min${
            Math.floor(timeDiff * 60) > 1 ? 's' : ''
          }  ago`)
        : `${Math.floor(timeDiff)} hr${
            Math.floor(timeDiff) > 1 ? 's' : ''
          } ago`;
    message.timeElapsed = daysDiff
      ? `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`
      : timeElapsed;
    // console.log('time elapsed',new Date() - timeObj)
    if (timeObj.getDate() == new Date(Date.now()).getDate()) {
      message.timeString = shortTime;
    } else {
      message.timeString = longTime;
    }
  });
  console.log('pre-sorted messages: ', messages);
  messages.sort(function(a, b) {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  // function updateScroll(){
  // var element = document.getElementById("feedId");
  // element.scrollTop = element.scrollHeight;
  // }
  console.log('post-sorted messages 3: ', messages);
  return {
    messages: messages,
    user: state.user,
  };
};

const mapDispatch = dispatch => {
  return {
    async getData() {
      // await dispatch(getMessagesforEvent());
      await dispatch(getMessages());
      // dispatch()
    },
    addMessage(message) {
      dispatch(addMessage(message));
      // dispatch(getMessages());
    },
  };
};

export default connect(mapState, mapDispatch)(ChatRoom);
