import { connect } from 'react-redux';
import * as testsActions from '../../actions/testsAction';
import orderBy from 'lodash/orderBy.js';
import { bindActionCreators } from 'redux';
import ShowAllTests from './showAllTestsComponent';
import * as setPassingTestAct from '../../actions/setPassingTestAction';

const sortBy = (tests, filterBy) => {
  switch (filterBy) {
    case 'All':
      return tests;

    case 'author':
      return orderBy(tests, 'test_author', 'asc');

    case 'title':
      return orderBy(tests, 'test_name', 'asc');

    default:
      return tests;
  }
};
const filterTests = (tests, searchQuery) =>
  tests.filter(
    o =>
      o.test_name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0 ||
      o.test_author.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0);


const searchTests = (tests, filterBy, searchQuery) => {
  return sortBy(filterTests(tests, searchQuery), filterBy);
}

const mapStateToProps = ({ tests, filter }) => ({
  tests: tests.items && searchTests(tests.items, filter.filterBy, filter.searchQuery),
  isReady: tests.isReady,
  activePage: tests.activePage

});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(testsActions, dispatch),
  ...bindActionCreators(setPassingTestAct, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ShowAllTests);
