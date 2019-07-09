import { connect } from 'react-redux';
import * as testActions from '../actions/createTestAction';
import * as switchActions from '../actions/switchAction';
import * as variantActions from '../actions/createTestAction';
import * as setGroupObjectAction from '../actions/setGroupObjectAction';
import * as testTypeActions from '../actions/changeTestTypeAction';
import { bindActionCreators } from 'redux';
import CreateTestMain from '../components/createTestMainComponent/createTestMainComponent'

const mapStateToProps = ({ tests, questions, results,timer }) => ({
  activePage: tests.activePage,
  activeState: questions.activeState,
  questions: questions.items,
  flagReady: questions.flagReady,
  results: results.results,
  testType: tests.testType,
  groupsObject: timer.groupsObject
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(switchActions, dispatch),
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(setGroupObjectAction, dispatch),
  ...bindActionCreators(testTypeActions, dispatch),
  ...bindActionCreators(testActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTestMain);