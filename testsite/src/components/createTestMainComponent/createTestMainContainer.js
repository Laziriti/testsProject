import { connect } from 'react-redux';
import * as testActions from '../../redux/actions/createTestAction';
import * as variantActions from '../../redux/actions/createTestAction';
import * as setGroupObjectAction from '../../redux/actions/setGroupObjectAction';
import * as testTypeActions from '../../redux/actions/changeTestTypeAction';
import * as clearEditTest from '../../redux/actions/clearEditTestAction';
import * as setEditTest from '../../redux/actions/setEditTestAction';
import * as setQuests from '../../redux/actions/createTestAction';
import * as resultsAction from '../../redux/actions/resultsAction';
import { bindActionCreators } from 'redux';
import CreateTestMain from './createTestMainComponent'

const mapStateToProps = ({ tests, questions, results, timer }) => ({
  activePage: tests.activePage,
  activeState: questions.activeState,
  questions: questions.items,
  flagReady: questions.flagReady,
  results: results.results,
  testType: tests.testType,
  groupsObject: timer.groupsObject,
  editTest: tests.editTest,
  editTestResults: tests.editTestResults,
  editTestContent: tests.editTestContent,

});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(setGroupObjectAction, dispatch),
  ...bindActionCreators(testTypeActions, dispatch),
  ...bindActionCreators(testActions, dispatch),
  ...bindActionCreators(clearEditTest, dispatch),
  ...bindActionCreators(setEditTest, dispatch),
  ...bindActionCreators(setQuests, dispatch),
  ...bindActionCreators(resultsAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTestMain);