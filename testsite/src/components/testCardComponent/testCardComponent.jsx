import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import './style.css';
import { withRouter } from 'react-router-dom';
import DeleteTestComponent from '../deleteTestComponent/deleteTestContainer'
class testCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      testToPass: {}
    }
    this.goPassTheTest = this.goPassTheTest.bind(this)
  }

  goPassTheTest() {
    setTimeout(() => { this.props.history.push('/passingTest/' + this.props.currentTest.id) }, 0)

  }
  goEditTheTest() {
    this.props.setEditTest(this.props.currentTest)
    setTimeout(() => { this.props.history.push('/editTest') }, 0)
  }

  render() {
    const { test_name, test_author, test_img, setEditTest } = this.props;

    return (
      <Card>
        <div className="button-container">
          <div className="opacity-div"></div>
          <div className="btn-div">
            <button className="test-card__button" onClick={() => { this.goEditTheTest() }}>изменить</button>

            <DeleteTestComponent testId={this.props.currentTest.id}></DeleteTestComponent>
          </div>
          <Image id="cardImage"
            src={test_img !== 'null' ?
              test_img
              : 'https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/befbcde0-9b36-11e6-95b9-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg'} >

          </Image>

        </div>
        <Card.Content className="test-card">
          <Card.Header>{test_name}</Card.Header>
          <Card.Meta>{test_author}</Card.Meta>
        </Card.Content>
        <button className="card-button" onClick={() => { this.goPassTheTest() }} >Пройти тест</button>
        <div></div>
      </Card>
    )
  }
}

export default withRouter(testCard)
