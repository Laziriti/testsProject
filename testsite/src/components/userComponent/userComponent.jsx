import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import { Redirect } from 'react-router';
import { Menu, Input } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import './style.css';
class Filter extends Component {

  constructor(props) {
    super(props)
    this.goCreateTest = this.goCreateTest.bind(this)
  }

  goCreateTest() {
    console.log(this.props.testType);
    this.props.history.push('/createTest')
  }
  goToTheTests() {
    this.props.history.push('/')
  }
  render() {
    const { setFilter, filterBy, searchQuery, setSearchQuery, changeTestType, testType } = this.props;

    return (

      // <Menu inverted>

      //   <Menu.Item
      //     active={filterBy === 'All'}
      //     onClick={setFilter.bind(this, 'All')}
      //   >Все</Menu.Item>
      //   <Menu.Item

      //     active={filterBy === 'title'}
      //     onClick={setFilter.bind(this, 'title')}
      //   >По алфавиту</Menu.Item>
      //   <Menu.Item

      //     active={filterBy === 'author'}
      //     onClick={setFilter.bind(this, 'author')}
      //   >По автору</Menu.Item>

      //   <Menu.Item>
      //     <Input icon='search' onChange={e => setSearchQuery(e.target.value)} value={searchQuery} placeholder="Введите запрос"></Input>
      //   </Menu.Item>

      // </Menu>
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
              <div className="user-block__info-text user-block__info-text_margin"><span className="user-block__email"><i className="far fa-envelope"></i> titov.timoha@mail.ru</span></div>
              <p className="user-block__status">Преподаватель</p>
              <div className="user-block__info-text"><i className="fas fa-pencil-alt"></i><span className="user-block__edit"> Редактировать</span></div>
              <div className="user-block__info-text"><i className="fas fa-sign-out-alt"></i><span className="user-block__logOut"> Выйти</span></div>
            </div>
          </div>
          <div className="user-block__tests-config">
            <ul className="user-block__config-container">
              <li className="user-block__create-test">Создать новый тест <i className="fas fa-angle-down iconTests"></i>
                <ul className="user-block_create-ul">
                  <li className="user-block_create-li" onClick={() => { changeTestType('first'); this.goCreateTest() }}>Создать тест1</li>

                  <li className="user-block_create-li" onClick={() => { changeTestType('second'); this.goCreateTest() }}>Создать тест2</li>
                </ul>
              </li>
              <li className="user-block__all-tests" onClick={() => { this.goToTheTests() }}>Все тесты</li>
            </ul>


            <ul className="user-block__config-container">
              <li className="user-block__search-container" ><Input className="user-block__search" icon='search' onChange={e => setSearchQuery(e.target.value)} value={searchQuery} placeholder="Введите запрос"></Input></li>
              <li className="user-block__filter">Фильтр <i className="fas fa-angle-down iconFilter"></i>
                <ul className="user-block_filter-ul">
                  <li className="user-block_filter-li" onClick={setFilter.bind(this, 'All')}>Все</li>
                  <li className="user-block_filter-li" onClick={setFilter.bind(this, 'title')}>По алфавиту</li>
                  <li className="user-block_filter-li" onClick={setFilter.bind(this, 'author')}>По автору</li>
                </ul>
              </li>
            </ul>

          </div>
        </div>

      </div >
    )
  }
}

export default withRouter(Filter);
