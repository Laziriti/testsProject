import React, { Component } from 'react';
import axios from 'axios';
import Cards from '../testCardComponent/testCardContainer';
import { Container } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';
import './style.css';


class ShowAllTests extends Component {
  state={
    results:[]
  }
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

  checkResTes() {
    let persID = document.getElementById("pupID").value;
    let testID = document.getElementById("testID").value;
    if(testID=="" || testID==" "){
      testID="-1";
    }
    var url = "https://psychotestmodule.herokuapp.com/results/" + persID + "/" + testID + "/";
    axios.get(url)
      .then((response) => {
        console.log(response.data);
        this.setState({results:response.data})
      })
      .catch(e => {
        console.log(e)
      })
  }
  render() {

    const { tests, isReady } = this.props;
    return (
      <Container>
        <div>
          <label>ID ученика</label>
          <input type="text" id="pupID"></input>
          <label>ID теста</label>
          <input type="text" id="testID"></input>
          <button onClick={() => {this.checkResTes() }}>Отправить</button>
        </div>
        <div>
        <table className="resultsTable">
        <tr>
          <td>ID</td>
          <td>PERSON ID</td>
          <td>TEST ID</td>
          <td>КОЛИЧЕСТВО БАЛЛОВ</td>
          <td>РЕЗУЛЬТАТ</td>
          </tr>
        {this.state.results?this.state.results.map((res,ind)=><tr>
          <td>{res.id}</td>
          <td>{res.person_id}</td>
          <td>{res.test_id}</td>
          <td>{res.test_count_point}</td>
          <td>{res.test_result}</td>
          </tr>):""}
        </table>
        </div>
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