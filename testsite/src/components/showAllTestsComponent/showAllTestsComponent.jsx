import React, { Component } from 'react';
import axios from 'axios';
import Cards from '../testCardComponent/testCardContainer';
import { Container } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';
import './style.css';

class ShowAllTests extends Component {
  componentDidMount() {
    const { setTests } = this.props

    axios.get('https://psychotestmodule.herokuapp.com/tests/')
      .then((response) => {
        setTests(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e)
      })
  }
  render() {

    const { tests, isReady } = this.props;
    return (
      <Container>

        <Card.Group itemsPerRow={3}>{
          !isReady ? <div className="lds-facebook"><div></div><div></div><div></div></div>
            : tests.map((test, index) => <Cards key={test.id} {...test} currentTest={test} />)
        }
        </Card.Group>
      </Container>
    )
  }
}

export default ShowAllTests