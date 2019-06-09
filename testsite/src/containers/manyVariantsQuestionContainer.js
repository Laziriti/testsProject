import { connect } from 'react-redux';
import * as variantActions from '../actions/createTestAction';
import { bindActionCreators } from 'redux';
import oneVariantQuestion from '../components/manyVariantsQuestionComponent/manyVariantsQuestionComponent'

const mapStateToProps = ({ questions, tests, results }) => ({
  activeState: questions.activeState,
  questions: questions.items,
  isReady: questions.isReady,
  testType: tests.testType,
  results: results.results
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(oneVariantQuestion);