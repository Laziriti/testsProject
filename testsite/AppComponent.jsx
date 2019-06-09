import React, { Component } from 'react';
import axios from 'axios';
import Menu from '../containers/mainMenuContainer';
import Cards from '../containers/testCardContainer';
import Filter from '../containers/FilterContainer';
import { Container } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';
import imgLoader from '../components/createTestComponent';

class App extends Component {
  componentWillMount() {
    const { setTests } = this.props
    axios.get('/tests.json').then((response) => {
      setTests(response.data);
    })
  }
  render() {
    const { tests, isReady, activePage } = this.props;
    return (
      <Container>
      
        <Menu />
        
        
        
        {
          activePage !== 'showTests' ? '' :
          <Filter />}
        {
          <Card.Group itemsPerRow={4}>{
            activePage !== 'showTests' ? 'Данная часть сайта в разработке' :
              !isReady ? 'Загрузка...'
                : tests.map(test => <Cards key={test.id} {...test} />)

          }
          </Card.Group>
        }
      </Container>
    )
  }
}

export default App