import { connect } from 'react-redux';
import * as filterActions from '../actions/filterAction';
import * as testTypeActions from '../actions/changeTestTypeAction';
import { bindActionCreators } from 'redux';
import Filter from '../components/userComponent/userComponent'
import {withRouter} from 'react-router-dom'
const mapStateToProps = ({ tests, filter }) => ({
  filterBy: filter.filterBy,
  searchQuery: filter.searchQuery,
  testType: tests.testType
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(filterActions, dispatch),
  ...bindActionCreators(testTypeActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter);