import React, { Component } from 'react';
import axios from 'axios';
import Cards from '../../containers/testCardContainer';
import Filter from '../../containers/FilterContainer';
import { Container } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';


class ShowAllTests extends Component {
  componentDidMount() {
    const { setTests, setPassingTest } = this.props

    axios.get('https://psychotestmodule.herokuapp.com/tests2/')
      .then((response) => {
        setTests(response.data);
        console.log(response.data);
        setPassingTest({})
      })
      .catch(e => {
        console.log(e)
      })
  }
  render() {

    const { tests, isReady } = this.props;
    return (
      <Container>
        <Filter />
        <Card.Group itemsPerRow={4}>{
          !isReady ? 'Загрузка...'
            : tests.map((test, index) => <Cards key={test.id} {...test} currentTest={test} />)
        }
        </Card.Group>
      </Container>
    )
  }
}

export default ShowAllTests