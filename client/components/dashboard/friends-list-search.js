import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Dimmer, Loader, Search } from 'semantic-ui-react';
import { FriendsListItem } from '../';
/**
 * COMPONENT
 */

export class FriendsListSearch extends Component {
  state = { currentSearch: '',  WAIT_INTERVAL : 1000};


  timeout = null;

  handleSearchChange = evt => {
    // this.props.searchUsers(searchString);
    // this.setState({ currentSearch: searchString }, () => {

    //   console.log(searchString)
    // });
    clearTimeout(this.timeout)
    // console.log(evt.target.value)
    // console.log(this.timeout)

    let tempVar = evt.target.value

    if (tempVar.length){
    this.timeout = setTimeout(() => {
      this.props.searchUsers(tempVar)
      this.setState({ currentSearch: tempVar })
    }, 500)
    }

  };

  componentDidMount = () => {
    const { fetchData, user } = this.props;
    fetchData(user.id);
  };

  render() {
    const {
      items,
      submit,
      decline,
      loading,
      activeIndex,
      search,
      sentRequests
    } = this.props;

    if (!items) return <div />;
    const sentRequestIds = sentRequests.map(sentRequest => sentRequest.id);
    const filteredSearch = search.filter(
      user => !sentRequestIds.includes(user.id))
    return (
      <Grid
        divided
        className="overflow-scroll friends-list"
        // style={{
        //   height: '60.5vh',
        //   alignItems: 'baseline',
        //   alignContent: 'baseline',
        // }}
      >
        <Search
          onKeyUp={this.handleSearchChange}
          showNoResults={false}
        />

        {loading === 'true' ? (
          <Dimmer active>
            <Loader size="large">Loading</Loader>
          </Dimmer>
        ) : (
          filteredSearch.map(item => (
            <FriendsListItem
              activeIndex={activeIndex}
              decline={decline}
              submit={submit}
              key={item.id}
              item={item}
            />
          ))
        )}
      </Grid>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = ({ friendsList, user }) => ({
  user,
  search: friendsList.search,
  sentRequests: friendsList.sentRequests,
});

const mapDispatch = null;

export default connect(mapState, mapDispatch)(FriendsListSearch);
// export default FriendsListSearch;

/**
 * PROP TYPES
 */
// FriendsListSearch.propTypes = {
//   email: PropTypes.string,
// };
