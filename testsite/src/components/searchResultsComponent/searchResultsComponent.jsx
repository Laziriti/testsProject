import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import './style.css';


class SearchResults extends Component {
  state = {
    results: []
  }


  tableToExcel(tableId) {
    var htmltable = document.getElementById(tableId);
    var html = htmltable.outerHTML;
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
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
      <Container className="search-res-block">
        <div className="search-res-block__container">
          <div className="search-res-block__title">
            <label className="search-res-block__label">ID ученика: </label>
            <input className="search-res-block__input" type="text" id="pupID"></input>
            <label className="search-res-block__label">ID теста: </label>
            <input className="search-res-block__input" type="text" id="testID"></input>

            <button className="search-res-block__btn" onClick={() => { this.checkResTes() }}>Найти</button>
            <button className="search-res-block__btn" onClick={() => { this.tableToExcel('testTable') }}>Экспорт в Excel</button>


          </div>

          <table className="search-res-block__table" id="testTable">
            <tbody>
              <tr className="search-res-block__tr">
                <td className="search-res-block__td search-res-block__td_title">ID</td>
                <td className="search-res-block__td search-res-block__td_title">PERSON ID</td>
                <td className="search-res-block__td search-res-block__td_title">TEST ID</td>
                <td className="search-res-block__td search-res-block__td_title">КОЛИЧЕСТВО БАЛЛОВ</td>
                <td className="search-res-block__td search-res-block__td_title search-res-block__td_result">РЕЗУЛЬТАТ</td>
              </tr>
              {this.state.results ? this.state.results.map((res, ind) => <tr key={ind} className="search-res-block__tr">
                <td className="search-res-block__td">{res.id}</td>
                <td className="search-res-block__td">{res.person_id}</td>
                <td className="search-res-block__td">{res.test_id}</td>
                <td className="search-res-block__td">{res.test_count_point}</td>
                <td className="search-res-block__td">{res.test_result}</td>
              </tr>) : ""}
            </tbody>
          </table>

        </div>
      </Container>
    )
  }
}

export default SearchResults