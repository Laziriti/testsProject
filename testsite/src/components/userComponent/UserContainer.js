import { connect } from 'react-redux';
import * as testActions from '../../actions/createTestAction';
import * as resultsAction from '../../actions/resultsAction';
import * as filterActions from '../../actions/filterAction';
import * as testTypeActions from '../../actions/changeTestTypeAction';
import * as setEditTest from '../../actions/setEditTestAction';
import * as clearEditTest from '../../actions/clearEditTestAction';
import * as setQuests from '../../actions/createTestAction';
import { bindActionCreators } from 'redux';
import User from './userComponent'

const mapStateToProps = ({ tests, filter }) => ({
  filterBy: filter.filterBy,
  searchQuery: filter.searchQuery,
  testType: tests.testType,
  editTestState: tests.editTestState
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(filterActions, dispatch),
  ...bindActionCreators(testTypeActions, dispatch),
  ...bindActionCreators(testActions, dispatch),
  ...bindActionCreators(resultsAction, dispatch),
  ...bindActionCreators(clearEditTest, dispatch),
  ...bindActionCreators(setEditTest, dispatch),
  ...bindActionCreators(setQuests, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(User);