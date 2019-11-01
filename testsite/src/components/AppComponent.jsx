import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Redirect } from 'react-router-dom';
import Show from './showAllTestsComponent/showAllTestsContainer';
import CreateTestMain from '../components/createTestMainComponent/createTestMainContainer';
import PassingTest from './passingTestComponent/passingTestContainer';
import UserComponent from './userComponent/UserContainer';
import SearchResults from './searchResultsComponent/searchResultsContainer'
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  };

  render() {

    return (
      <Container>

        <UserComponent />
        <Route exact path='/'>
        <Redirect to='/0'/>
        </Route>

        <Route exact path='/:Npage' component={Show} />
        <Route exact path='/createTest/:testType' component={CreateTestMain} />
        <Route exact path='/editTest' component={CreateTestMain} />
        <Route exact path='/passingTest/:testId' component={PassingTest} />
        <Route exact path='/searchResults' component={SearchResults} />
      </Container>
    )

  }
}

export default App