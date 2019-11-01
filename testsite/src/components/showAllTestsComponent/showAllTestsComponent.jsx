import React, { Component } from 'react';
import axios from 'axios';
import Cards from '../testCardComponent/testCardContainer';
import { Container } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';
import './style.css';


class ShowAllTests extends Component {
  state = {
    results: [],
    currentPageNumber: 0
  }
  componentDidMount() {
    const { setTests } = this.props
    this.setState({ currentPageNumber: this.props.match.params.Npage });
    axios.get('https://psychotestmodule.herokuapp.com/tests/')
      .then((response) => {
        setTests(response.data);
        console.log(response.data);

      })
      .catch(e => {
        console.log(e)
      })
  }
  switchPage(sw) {
    let currentpage = this.props.match.params.Npage;
    if (sw) {
      currentpage++;
      this.props.history.push('/' + currentpage);
    }
    else {
      currentpage--;
      this.props.history.push('/' + currentpage);
    }

  }
  render() {
    //+1

    const { tests, isReady } = this.props;
    return (
      <Container className="show-tests-block">
        <div className="show-tests-block__switch">
          {
            this.props.match.params.Npage > 0
              ? <button className="show-test-block__swbtn show-test-block__swbtn_left" onClick={() => { this.switchPage(false) }}>Назад</button>
              : null
          }

          {tests && tests.length - (this.props.match.params.Npage+1 * 12) > 1
            ? <button className="show-test-block__swbtn show-test-block__swbtn_right" onClick={() => { this.switchPage(true) }}>Далее</button>
            : null
          }

          {tests ? console.log(tests.length) : ""}
        </div>

        <div className="show-tests-block__container">

          <Card.Group className="show-tests-block__testsF" itemsPerRow={3}>{
            !isReady ? <div className="lds-facebook"><div></div><div></div><div></div></div>
              : tests.map((test, index) => index <= this.props.match.params.Npage + 11 && index >= this.props.match.params.Npage * 12
                ? <Cards key={test.id} {...test} currentTest={test} />
                : null)
          }
          </Card.Group>

          <div className="show-tests-block__switch">

            {
              this.props.match.params.Npage > 0
                ? <button className="show-test-block__swbtn show-test-block__swbtn_left" onClick={() => { this.switchPage(false) }}>Назад</button>
                : null
            }

            {tests && tests.length - (this.props.match.params.Npage+1 * 12) > 1
              ? <button className="show-test-block__swbtn show-test-block__swbtn_right" onClick={() => { this.switchPage(true) }}>Далее</button>
              : null
            }

            {tests ? console.log(tests.length) : ""}

          </div>
        </div>
      </Container>
    )
  }
}

export default ShowAllTests