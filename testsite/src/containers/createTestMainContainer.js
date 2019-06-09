import { connect } from 'react-redux';
import * as switchActions from '../actions/switchAction';
import * as variantActions from '../actions/createTestAction';
import { bindActionCreators } from 'redux';
import CreateTestMain from '../components/createTestMainComponent/createTestMainComponent'

const mapStateToProps = ({ tests, questions, results }) => ({
  activePage: tests.activePage,
  activeState: questions.activeState,
  questions: questions.items,
  isReady: questions.isReady,
  flagReady: questions.flagReady,
  results: results.results,
  testType: tests.testType,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(switchActions, dispatch),
  ...bindActionCreators(variantActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTestMain);