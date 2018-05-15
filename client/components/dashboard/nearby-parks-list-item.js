import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Grid,
  Button,
  Image,
  Label,
  Header,
  Segment,
  Icon,
} from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { getNearByUsersInfo, getGeolocation } from '../../store';
import history from '../../history';

/**
 * COMPONENT
 */

export const NearbyParksListItem = props => {
  const { id, name, address, imageUrl } = props.park;
  const parkPhotos = [
    'https://photos.bringfido.com/photo/2016/03/12/20160306_155456-1.jpg',
    'https://images.dog.ceo/breeds/rottweiler/n02106550_12642.jpg',
    'https://photos.bringfido.com/photo/2015/01/02/1205502706_3b97697122.jpg',
    'https://photos.bringfido.com/attractions/4/9/1/2194/2194_32152.jpg',
    'https://images.dog.ceo/breeds/otterhound/n02091635_2011.jpg',
    'https://photos.bringfido.com/photo/2015/10/17/photo_.jpg',
  ];
  return (
    <Segment stacked style={{ margin: '0px', width: '100%' }}>
      <Grid>
        <Grid.Row
          style={{ padding: '0.25em', alignItems: 'center', display: 'flex' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Header
              style={{ flex: 2, margin: '0', fontSize: '1em' }}
              as={NavLink}
              to={`/dog-park/${id}`}
            >
              {name}
            </Header>
            <Header
              style={{ flex: 1, margin: '0', fontSize: '0.8em', color: 'grey' }}
              as="h4"
            >
              {address.fullAddress}
            </Header>
          </div>
          <div style={{ display: 'flex', flex: 2, justifyContent: 'flex-end' }}>
            {address &&
              address.location.distance && (
                <Label
                  style={{ flex: 0.75, padding: '0.5em 0.5em' }}
                  icon="globe"
                  content={`${address.location.distance} mi away`}
                />
              )}
            <NavLink to={`/dog-park/${id}`}>
              <Button
                style={{ flex: 0.75, padding: '0.5em 0.5em', height: '100%' }}
                size="tiny"
                name="dogpark-detail"
              >
                Park Detail
              </Button>
            </NavLink>
          </div>
        </Grid.Row>
        <Grid.Row columns={1} style={{ padding: '0em 0em' }}>
          <Grid.Column width={16} style={{ padding: '0', margin: '0' }}>
            <Grid.Row style={{ padding: '0', margin: '0' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    overflowX: 'scroll',
                    display: 'flex',
                    flexDirection: 'row',
                    height: '10rem',
                  }}
                >
                  {parkPhotos.map(imageUrl => (
                    <div style={{ width: '100%' }} key={imageUrl}>
                      <img
                        style={{ height: '100%', borderRadius: '0.2em' }}
                        src={imageUrl}
                      />
                    </div>
                  ))}
                  <Icon
                    name="angle right"
                    style={{
                      position: 'absolute',
                      top: '60px',
                      right: '0px',
                      backgroundColor: 'transparent',
                      padding: '0px',
                      fontSize: '5em',
                      color: 'rgb(222, 242, 242)',
                      maxWidth: '-1px',
                      margin: '0em 0em',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  />
                </div>
              </div>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    // <Feed.Event>
    //   <Feed.Content>
    //   <Feed.Summary>{`${park.name}`}</Feed.Summary>
    //     <Feed.Date content={`Address: ${park.address.fullAddress}`} />
    //     <Feed.Summary>{`${park.description}`}</Feed.Summary>
    //     {/* <Feed.Extra images>
    //       <Image size="large" src={pet.image} />
    //     </Feed.Extra> */}
    //     <Feed.Extra>
    //       <Button size="tiny" name="add" onClick={() => history.push(`/dog-park/${park.id}`)} >
    //         Park Details
    //       </Button>
    //     </Feed.Extra>
    //   </Feed.Content>
    // </Feed.Event>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    nearbyUsers: state.nearbyUsers,
  };
};

const mapDispatch = dispatch => {
  return {
    getSuggestedFriends(location) {
      dispatch(getNearByUsersInfo(location));
    },
    getUserLocation() {
      dispatch(getGeolocation());
    },
  };
};

export default connect(mapState, mapDispatch)(NearbyParksListItem);

/**
 * PROP TYPES
 */
// NearbyParksListItem.propTypes = {
//   email: PropTypes.string,
// };
