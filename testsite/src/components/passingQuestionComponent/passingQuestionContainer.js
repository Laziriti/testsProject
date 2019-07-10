import { connect } from 'react-redux';
import * as variantActions from '../../actions/setPassingTestAction';
import * as setIndexActions from '../../actions/nextIndexOfQuestion';
import { bindActionCreators } from 'redux';
import passingQuest from './passingQuestionComponent'
import * as setPassingTestAct from '../../actions/setPassingTestAction';
import * as saveVariantState from '../../actions/saveVariantState';
import * as clearPassingTest from '../../actions/clearPassingTest';
import * as setQuestionTimer from '../../actions/setQuestionTimer';
import * as setGroupTimer from '../../actions/setGroupTimer';

const mapStateToProps = ({ questions, tests, results, timer }) => ({
  passingTest: tests.passingTest,
  questIndex: questions.index,
  questReady: questions.indexReady,
  testType: tests.testType,
  passingTestResults: tests.passingTestResults,
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

export default connect(mapStateToProps, mapDispatchToProps)(passingQuest);








