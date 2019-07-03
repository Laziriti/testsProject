import React, { Component } from 'react';
import axios from 'axios';
import Menu from '../containers/mainMenuContainer';
import { Container } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import Show from '../containers/showAllTestsContainer';
import CreateTestMain from '../containers/createTestMainContainer';
import PassingTest from '../containers/passingTestContainer';
import Filter from '../containers/FilterContainer';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  };

  render() {


    return (
      <Container>
        
        <Filter />
        <Route exact path='/' component={Show} />
        <Route exact path='/createTest' component={CreateTestMain} />
        <Route exact path='/passingTest' component={PassingTest} />
      </Container>
    )


  }
}

export default App