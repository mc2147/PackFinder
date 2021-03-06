import React, { Component } from 'react';
//  ewafofweifjwpoaiefjapwoiej
import {
  Map,
  ParkListItem,
  EventEditModal,
  SingleParkMap,
  ChatRoom,
  AddAttendeeModal,
  EventDetailItem,
} from '../index.js';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Card,
} from 'semantic-ui-react';
import axios from 'axios';
import {
  addEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  inviteUsers,
} from '../../store';
import { connect } from 'react-redux';

export class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showAttendeeModal: false,
      invitedClicked: false,
      invitedClickedText: '',
      map: {},
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleAttendeeModal = this.toggleAttendeeModal.bind(this);
  }

  componentDidMount() {
    this.props.getEvents();
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  toggleAttendeeModal() {
    this.setState({
      showAttendeeModal: !this.state.showAttendeeModal,
    });
  }

  handleSubmit = event => {
    let stateEvent = event;
    let year = parseInt(stateEvent.date.split('-')[0]);
    let month = parseInt(stateEvent.date.split('-')[1]) - 1;
    let day = parseInt(stateEvent.date.split('-')[2]);
    let fromHour = parseInt(stateEvent.startTime.split(':')[0]);
    let fromMin = parseInt(stateEvent.startTime.split(':')[1]);
    let startTime = new Date(year, month, day, fromHour, fromMin);
    let newEvent = Object.assign(stateEvent, {
      start: startTime,
      id: event.id,
    });
    this.props.updateEvent(newEvent);
    this.toggleModal();
  };

  handleAttendeeSubmit = async e => {
    let friendIDs = [];
    for (let K in e.target) {
      if (
        e.target[K] &&
        e.target[K].value &&
        K != 'classList'
        // && ('checked' in event.target[K])
      ) {
        if (typeof parseInt(K) == 'number' && e.target[K].checked) {
          let relatedId = this.props.uninvitedFriends[K].id;
          friendIDs.push(relatedId);
        }
      }
    }
    //axios.put here
    let invitedClickedText = friendIDs.length + ' friends invited!';
    if (friendIDs.length == 1) {
      invitedClickedText = '1' + ' friend invited!';
    }
    this.setState({
      invitedClicked: true,
      invitedClickedText,
    });
    console.log('inviting users: ', friendIDs);
    await this.props.inviteUsers(this.props.displayEvent, friendIDs);
    this.toggleAttendeeModal();
    // axios.put(`/api/events/${this.props.displayEvent.id}/invite-users`,
    //   {userIds: friendIDs}
    // ).then(response => {
    //   this.toggleAttendeeModal();
    // })
  };

  mapLoaded(map) {
    if (this.state.map !== null) {
      return;
    }
    this.setState({ map });
  }

  render() {
    let {
      displayEvent,
      isOwner,
      coords,
      user,
      attendees,
      invitees,
    } = this.props;
    let { showModal, showAttendeeModal } = this.state;
    let friendstoInvite = this.props.uninvitedFriends;
    let invitedFriends = this.props.invitedFriends;
    const styles = {
      dashboardList: {
        boxShadow:
          '  rgba(0, 0, 0, 0.2) 2px 3px 11px, rgba(0, 0, 0, 0.2) 1px 2px 9px',
        width: '100%',
        padding: 0,
        marginBottom: 0,
        height: '78vh'
      },
    };
    return displayEvent ? (
      <div className="container" style={{ overflowY: 'scroll' }}>
        <EventEditModal
          onClose={this.toggleModal}
          showModal={showModal}
          onDelete={deleteEvent}
          item={displayEvent}
          handleEvent={this.props.updateEvent}
        />
        <AddAttendeeModal
          onClose={this.toggleAttendeeModal}
          showModal={showAttendeeModal}
          handleSubmit={this.handleAttendeeSubmit}
          item={displayEvent}
          user={user}
          userFriends={friendstoInvite}
          invitedFriends={invitedFriends}
        />
        <Grid
          columns={2}
          centered
          // className="overflow-scroll"
          style={{ height: '75vh' }}
        >
          <Grid.Row>
            <Grid.Column mobile={16} tablet={7} computer={5} largeScreen={5}>
              <Card style={styles.dashboardList}>
                <Card.Content style={{ padding: '0em' }}>
                  <EventDetailItem
                    id={1}
                    name={displayEvent.park.name}
                    address={displayEvent.park.address}
                    description={displayEvent.description}
                    isOwner={isOwner}
                    toggleModal={this.toggleModal}
                    priv={displayEvent.private}
                    toggleAttendeeModal={this.toggleAttendeeModal}
                    invitedClicked={this.state.invitedClicked}
                    invitedClickedText={this.state.invitedClickedText}
                    imageUrls={displayEvent.park.imageUrls}
                  />
                  {/* <Segment clearing size="large" attached style={{ padding: '0.5em' }} >
                      <b style={{ padding: '.25em' }}>{displayEvent.description}</b>
                    </Segment>
                    <Segment attached style={{ padding: '0.5em' }}>
                      <b>Park Name: </b>{displayEvent.park.name}
                    </Segment>
                    <Segment attached style={{ padding: '0.5em' }}>
                      <b>Date: </b>{moment(displayEvent.start).format('MMMM Do YYYY, h:mm a')}
                      {isOwner ? <Button size="tiny" floated="right" color="blue" onClick={() => this.toggleAttendeeModal()}>Invite Friends</Button>
                        : <div />}
                    </Segment> */}
                </Card.Content>
                <Card.Content
                  className="overflow-scroll"
                  style={{ padding: '1em', height: '22vh' }}
                >
                  <Card.Header style={{ marginBottom: '1em' }}>
                    Attending:
                  </Card.Header>
                  <Grid>
                    {attendees.length ? (
                      attendees.map(attendee => {
                        return (
                          <Grid.Column
                            width={4}
                            key={attendee.id}
                            textAlign={'center'}
                            style={{ marginBottom: '4px', padding: '0px' }}
                          >
                            <Image avatar src={attendee.imageUrl} />
                            <List.Content>
                              <List.Header style={{ fontSize: '10px' }}>
                                {attendee.fullName}
                              </List.Header>
                            </List.Content>
                          </Grid.Column>
                        );
                      })
                    ) : (
                      <p>Nobody is planning to attend</p>
                    )}
                  </Grid>
                </Card.Content>
                <Card.Content
                  className="overflow-scroll"
                  style={{ padding: '1em', height: '22vh' }}
                >
                  <Card.Header style={{ marginBottom: '1em' }}>
                    Invited:
                  </Card.Header>
                  <Grid>
                    {invitees.length ? (
                      invitees.map(invitee => {
                        return (
                          <Grid.Column
                            // mobile={4}
                            // tablet={3}
                            // computer={3}
                            // largeScreen={2}
                            width={4}
                            key={invitee.id}
                            textAlign={'center'}
                            style={{ marginBottom: '4px', padding: '0px' }}
                          >
                            <Image avatar src={invitee.imageUrl} />
                            <List.Content>
                              <List.Header style={{ fontSize: '10px' }}>
                                {invitee.fullName}
                              </List.Header>
                            </List.Content>
                          </Grid.Column>
                        );
                      })
                    ) : (
                      <p>Nobody has been invited</p>
                    )}
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={7} computer={5} largeScreen={5}>
              <Card style={styles.dashboardList}>
                <Card.Content
                  style={{
                    padding: '0em',
                    // height:'80vh',
                    // overflowY:'scroll'
                  }}
                >
                  <Header style={{ flex: 2, margin: '0.5em', fontSize: '1em' }}>
                    Event Chat
                  </Header>
                  <ChatRoom
                    // height={'80vh'}
                    style={
                      {
                        // height:'80vh',
                        // overflowY:'scroll'
                      }
                    }
                    eventId={parseInt(this.props.match.params.id)}
                  />
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column
              // tablet={7}
              only="computer"
              computer={5}
              largeScreen={5}
              style={{height: '78vh'}}
            >
              {/* <Card style={styles.dashboardList}>
                  <Card.Content style={{ padding: '0em' }}> */}
              <SingleParkMap
                zoom={15}
                center={coords}
                mapLoaded={this.mapLoaded.bind(this)}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
              {/* </Card.Content>
                </Card> */}
            </Grid.Column>
          </Grid.Row>
          {/* <Grid.Row>
              <Grid.Column width={16}>
                <Header>Event Chat</Header>
                <ChatRoom height={250} eventId={parseInt(this.props.match.params.id)} />
              </Grid.Column>
            </Grid.Row> */}
        </Grid>
        {/* <br /> <br /> <br /> */}
        {/* </Segment> */}
      </div>
    ) : (
      <div />
    );
  }
}
const mapState = (state, ownProps) => {
  let eventDetail = state.events.filter(
    event => event.id === Number(ownProps.match.params.id)
  )[0];
  let isOwner = false;
  let coords = { lat: 41.954629, lng: -87.6572544 };
  let attendees = [];
  let invitees = [];
  let uninvitedFriends = [];
  let invitedFriends = [];
  console.log('mapState: ', state);
  console.log('eventDetail: ', eventDetail);

  if (eventDetail) {
    isOwner = eventDetail.creatorId === state.user.id;
    coords = eventDetail.park.address.location;
    attendees = eventDetail.attendees;
    invitees = eventDetail.invitees;
    if (state.user.Friends) {
      let InvitedandAttendingIds = [];
      console.log('user friends: ', state.user.Friends);
      attendees.forEach(attendee => {
        InvitedandAttendingIds.push(parseInt(attendee.id));
      });
      invitees.forEach(invitees => {
        InvitedandAttendingIds.push(parseInt(invitees.id));
      });
      state.user.Friends.forEach(friend => {
        // console.log("state.user.Friends: ", friend);
        if (!InvitedandAttendingIds.includes(friend.id)) {
          uninvitedFriends.push(friend);
        } else {
          invitedFriends.push(friend);
        }
      });
    }
  }

  //isOwner = true //FOR TESTING - REMOVE LATER

  return {
    allEvents: state.events,
    attendees: attendees,
    invitees: invitees,
    uninvitedFriends,
    invitedFriends,
    user: state.user,
    displayEvent: eventDetail,
    isOwner: isOwner,
    coords: coords,
  };
};

const mapDispatch = (dispatch, ownProps) => {
  return {
    async inviteUsers(event, userIds) {
      await dispatch(inviteUsers(event, userIds));
    },
    addEvent(event) {
      dispatch(addEvent(event));
    },
    deleteEvent(eventId) {
      dispatch(deleteEvent(eventId));
      ownProps.history.push('/home');
    },
    updateEvent(event) {
      dispatch(updateEvent(event));
    },
    getEvents() {
      dispatch(getEvents());
    },
  };
};
export default connect(mapState, mapDispatch)(EventDetail);
