import { connect } from 'react-redux';
import * as variantActions from '../actions/setPassingTestAction';
import * as setIndexActions from '../actions/nextIndexOfQuestion';
import { bindActionCreators } from 'redux';
import passingTest from '../components/passingTestComponent/passingTestComponent'
import * as setPassingTestAct from '../actions/setPassingTestAction';
const mapStateToProps = ({ questions, tests, results }) => ({
  passingTest: tests.passingTest,
  questIndex: questions.index,
  questReady: questions.indexReady,
  testType: tests.testType,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(setIndexActions, dispatch),
  ...bindActionCreators(setPassingTestAct, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(passingTest);