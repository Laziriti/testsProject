import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


class mainMenu extends Component {
  menuClickHandler(setPage, changeTestType, page, typeTest) {
    setPage.bind(page); changeTestType.bind(this, typeTest);
    console.log(typeTest);
  }

  render() {

    const { setPage, activePage, changeTestType, testType,setPassingTest,setIndexOfQuestion } = this.props;

    return (

      <Menu inverted>

        <Menu.Item

          active={activePage === 'showTests'}
          as={Link} to="/"
          onClick={()=>{setPassingTest({});setIndexOfQuestion(0)}}
        >Тесты</Menu.Item>

        <Menu.Item
          active={activePage === 'createTest'}
          as={Link} to="/createTest"
          onClick={changeTestType.bind(this, 'first')}
        >Создать тест</Menu.Item>
        <Menu.Item
          active={activePage === 'createTest'}
          as={Link} to="/createTest"
          onClick={changeTestType.bind(this, 'second')}
        >Создать тест 2</Menu.Item>

      </Menu>
    )

  }

}


export default mainMenu;
