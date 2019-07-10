import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import './style.css';
import { withRouter } from 'react-router-dom'
class testCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      testToPass: {}
    }
    this.goPassTheTest = this.goPassTheTest.bind(this)
  }

  goPassTheTest() {
    setTimeout(() => { this.props.history.push('/passingTest/'+this.props.currentTest.id) }, 0)

  }
 

  render() {
    const { test_name, test_author, test_img, } = this.props;

    return (
      <Card>

        <Image src={test_img !== 'null' ?
          test_img
          : 'https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/befbcde0-9b36-11e6-95b9-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg'} />

        <Card.Content className="test-card">
          <Card.Header>{test_name}</Card.Header>
          <Card.Meta>{test_author}</Card.Meta>
        </Card.Content>
        <button className="card-button" onClick={() => {this.goPassTheTest() }} >Пройти тест</button>
        <div></div>
      </Card>
    )
  }
}

export default withRouter(testCard)
