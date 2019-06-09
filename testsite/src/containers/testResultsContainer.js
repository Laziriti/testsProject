import { connect } from 'react-redux';
import * as variantActions from '../actions/createTestAction';
import * as lolAct from '../actions/resultsAction';
import { bindActionCreators } from 'redux';
import testResults from '../components/testResultsComponent/testResultsComponent'

const mapStateToProps = ({questions,results,tests}) => ({
  activeState:questions.activeState,
  results:results.results,
  testType:tests.testType,
 
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(lolAct, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(testResults);