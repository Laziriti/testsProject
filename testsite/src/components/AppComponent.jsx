import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import Show from '../containers/showAllTestsContainer';
import CreateTestMain from '../containers/createTestMainContainer';
import PassingTest from '../containers/passingTestContainer';
import Filter from '../containers/UserContainer';
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
        <Route exact path='/createTest/:testType' component={CreateTestMain} />
        <Route exact path='/passingTest' component={PassingTest} />
      </Container>
    )


  }
}

export default App