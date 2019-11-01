import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'
import './style.css';
class Filter extends Component {

  constructor(props) {
    super(props)
    this.goCreateTest = this.goCreateTest.bind(this)
  }

  goCreateTest(testType) {
    let alert = true;
    if (this.props.editTestState) {
      this.props.clearEditTest();
      this.props.setQuests([]);
      this.props.setResults([]);
    }
    if (testType !== this.props.testType && this.props.testType !== null) {
      alert = window.confirm("При переходе на создание теста другого типа, все созданыые вопросы будут удалены, перейти?");
      console.log(alert)
      if (alert) {
        this.props.setQuests([]);
        this.props.history.push('/createTest/' + testType)
        this.props.changeTestType(testType)
      }
    }
    else {
      this.props.history.push('/createTest/' + testType)
    }

  }
  goToTheTests() {
    this.props.history.push('/0');
  }
  goSearchResults(){
    this.props.history.push('/searchResults');
  }
  render() {
    const { setFilter, searchQuery, setSearchQuery, changeTestType } = this.props;

    return (
      <div className="user-block">

        <div className="user-block__container">
          <div className="user-block__profile">
            <div className="user-block__logo">
              <div className="user-block__logo-content">
                <p className="user-block__logo-text">TT</p>
              </div>
            </div>
            <div className="user-block__info">
              <div className="user-block__info-text"><span className="user-block__name">Тимофей Титов</span></div>
              <div className="user-block__info-text user-block__info-text_margin">
                <span className="user-block__email"><i className="far fa-envelope"></i> titov.timoha@mail.ru</span></div>
              <p className="user-block__status">Преподаватель</p>
              <div className="user-block__info-text"><i className="fas fa-pencil-alt"></i><span className="user-block__edit"> Редактировать</span></div>
              <div className="user-block__info-text"><i className="fas fa-sign-out-alt"></i><span className="user-block__logOut"> Выйти</span></div>
            </div>
          </div>
          <div className="user-block__tests-config">
            <ul className="user-block__config-container">
              <li className="user-block__create-test">Создать новый тест <i className="fas fa-angle-down iconTests"></i>
                <ul className="user-block_create-ul">
                  <li className="user-block_create-li" onClick={() => { this.goCreateTest('first') }}>Создать тест1</li>

                  <li className="user-block_create-li" onClick={() => { this.goCreateTest('second') }}>Создать тест2</li>
                </ul>
              </li>
              <li className="user-block__all-tests" onClick={() => { this.goToTheTests() }}>Все тесты</li>
            </ul>


            <ul className="user-block__config-container">
              <li className="user-block__search-container" >
                <Input className="user-block__search"
                  icon='search'
                  onChange={e => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  placeholder="Введите запрос"></Input>
              </li>
              <li className="user-block__filter">Фильтр <i className="fas fa-angle-down iconFilter"></i>
                <ul className="user-block_filter-ul">
                  <li className="user-block_filter-li" onClick={setFilter.bind(this, 'All')}>Все</li>
                  <li className="user-block_filter-li" onClick={setFilter.bind(this, 'title')}>По алфавиту</li>
                  <li className="user-block_filter-li" onClick={setFilter.bind(this, 'author')}>По автору</li>
                </ul>
              </li>
            </ul>

            <ul className="user-block__config-container">
              <li className="user-block__search-container" ></li>

              <li className="user-block_search-res" onClick={() => { this.goSearchResults() }}>Поиск результатов</li>
            </ul>
          </div>

        </div>

      </div >
    )
  }
}

export default withRouter(Filter);
