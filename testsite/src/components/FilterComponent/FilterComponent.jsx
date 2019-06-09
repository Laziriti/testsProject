import React, { Component } from 'react';
import { Menu, Input } from 'semantic-ui-react'


class Filter extends Component {

  render() {
    const { setFilter, filterBy, searchQuery,setSearchQuery } = this.props;
    return (
      <Menu inverted>

        <Menu.Item
          active={filterBy === 'All'}
          onClick={setFilter.bind(this, 'All')}
        >Все</Menu.Item>
        <Menu.Item

          active={filterBy === 'title'}
          onClick={setFilter.bind(this, 'title')}
        >По алфавиту</Menu.Item>
        <Menu.Item

          active={filterBy === 'author'}
          onClick={setFilter.bind(this, 'author')}
        >По автору</Menu.Item>


        <Menu.Item>
          <Input icon='search' onChange={e =>setSearchQuery(e.target.value)} value={searchQuery} placeholder="Введите запрос"></Input>
        </Menu.Item>

         
      </Menu>
    )
  }
}


export default Filter;
