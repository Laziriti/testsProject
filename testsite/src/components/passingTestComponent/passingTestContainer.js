import { connect } from 'react-redux';
import * as variantActions from '../../redux/actions/setPassingTestAction';
import * as setIndexActions from '../../redux/actions/nextIndexOfQuestion';
import { bindActionCreators } from 'redux';
import passingTest from './passingTestComponent'
import * as setPassingTestAct from '../../redux/actions/setPassingTestAction';
import * as saveVariantState from '../../redux/actions/saveVariantState';
import * as clearPassingTest from '../../redux/actions/clearPassingTest';
import * as setQuestionTimer from '../../redux/actions/setQuestionTimer';
import * as setGroupTimer from '../../redux/actions/setGroupTimer';
import * as setGroupObjectAction from '../../redux/actions/setGroupObjectAction';

const mapStateToProps = ({ questions, tests, results, timer }) => ({
  passingTest: tests.passingTest,
  questIndex: questions.index,
  questReady: questions.indexReady,
  testType: tests.testType,
  passingTestResults: tests.passingTestResults,
  groups_object:tests.groups_object,
  testContent: tests.passingTestContent,
  isReadyToPass: tests.isReadyToPass,
  questionMinutes: timer.questionMinutes,
  questionSeconds: timer.questionSeconds,
  questionGroupMinutes: timer.questionGroupMinutes,
  questionGroupSeconds: timer.questionGroupSeconds,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(setIndexActions, dispatch),
  ...bindActionCreators(setPassingTestAct, dispatch),
  ...bindActionCreators(saveVariantState, dispatch),
  ...bindActionCreators(clearPassingTest, dispatch),
  ...bindActionCreators(setQuestionTimer, dispatch),
  ...bindActionCreators(setGroupTimer, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(passingTest);








