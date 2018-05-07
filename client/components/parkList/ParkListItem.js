import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Image, Rail, Segment, Sticky, Button } from  'semantic-ui-react'
import {Link} from 'react-router-dom'


class ParkListItem extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }


  clickHandler(){
    // this.props.history.push does not work
    // console.log(this.props.history)
  }


  render() {

    // console.log(this.props.currentPark)
    const currentPark = this.props.currentPark

    return (

      <div className="card">
        <div className="extra">
        <Grid columns={3}>
        <Grid.Column width={3}>
        <Image size='small' centered={true} src='https://react.semantic-ui.com/assets/images/wireframe/image.png' />
          <div className="ui star rating" data-rating="4"></div>
          </Grid.Column>
          <Grid.Column width={5}>
          <h3> {currentPark.name}</h3>
          Rating: <div className="ui star rating" data-rating="4"></div>
          </Grid.Column>
          <Grid.Column width={5}>
          <h4>{currentPark.address.line_1}</h4>
          <h4>{currentPark.address.city} {currentPark.address.state}, {currentPark.address.zipcode}</h4>
          </Grid.Column>
          <Grid.Column width={3}>

          {/*change link to button after fixing this.props.history*/}
          <Link to={`/dog-park/${currentPark.id}`}>
          >See Details</Link>
          </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{

  }
};

const mapDispatch = dispatch => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatch)(ParkListItem);
