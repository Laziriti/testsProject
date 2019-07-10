import { connect } from 'react-redux';
import * as variantActions from '../../actions/createTestAction';
import * as resultsAction from '../../actions/resultsAction';
import { bindActionCreators } from 'redux';
import testResults from './testResultsComponent'

const mapStateToProps = ({ questions, results, tests, timer }) => ({
  activeState: questions.activeState,
  results: results.results,
  testType: tests.testType,
  groupsObject: timer.groupsObject

});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(resultsAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(testResults);