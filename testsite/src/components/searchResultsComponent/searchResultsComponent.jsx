import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import './style.css';


class SearchResults extends Component {
  state = {
    results: []
  }

  checkResTes() {
    let persID = document.getElementById("pupID").value;
    let testID = document.getElementById("testID").value;
    if (testID === "" || testID === " ") {
      testID = "-1";
    }
    var url = "https://psychotestmodule.herokuapp.com/results/" + persID + "/" + testID + "/";
    axios.get(url)
      .then((response) => {
        console.log(response.data);
        this.setState({ results: response.data })
      })
      .catch(e => {
        console.log(e)
      })
  }
  render() {

    const { } = this.props;
    return (
      <Container>
        <div>
          <label>ID ученика</label>
          <input type="text" id="pupID"></input>
          <label>ID теста</label>
          <input type="text" id="testID"></input>
          <button onClick={() => { this.checkResTes() }}>Отправить</button>
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
            {this.state.results ? this.state.results.map((res, ind) => <tr>
              <td>{res.id}</td>
              <td>{res.person_id}</td>
              <td>{res.test_id}</td>
              <td>{res.test_count_point}</td>
              <td>{res.test_result}</td>
            </tr>) : ""}
          </table>
        </div>
      </Container>
    )
  }
}

export default SearchResults