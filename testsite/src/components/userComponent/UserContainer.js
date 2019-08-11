import { connect } from 'react-redux';
import * as testActions from '../../redux/actions/createTestAction';
import * as resultsAction from '../../redux/actions/resultsAction';
import * as filterActions from '../../redux/actions/filterAction';
import * as testTypeActions from '../../redux/actions/changeTestTypeAction';
import * as setEditTest from '../../redux/actions/setEditTestAction';
import * as clearEditTest from '../../redux/actions/clearEditTestAction';
import * as setQuests from '../../redux/actions/createTestAction';
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