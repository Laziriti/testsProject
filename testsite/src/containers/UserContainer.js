import { connect } from 'react-redux';
import * as testActions from '../actions/createTestAction';
import * as resultsAction from '../actions/resultsAction';
import * as filterActions from '../actions/filterAction';
import * as testTypeActions from '../actions/changeTestTypeAction';
import { bindActionCreators } from 'redux';
import User from '../components/userComponent/userComponent'

const mapStateToProps = ({ tests, filter }) => ({
  filterBy: filter.filterBy,
  searchQuery: filter.searchQuery,
  testType: tests.testType
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(filterActions, dispatch),
  ...bindActionCreators(testTypeActions, dispatch),
  ...bindActionCreators(testActions, dispatch),
  ...bindActionCreators(resultsAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(User);