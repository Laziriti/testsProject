import { connect } from 'react-redux';
import * as testActions from '../actions/createTestAction';
import * as variantActions from '../actions/setVariantsCountAction';
import { bindActionCreators } from 'redux';
import manyVariantQuestion from '../components/manyVariantsQuestionComponent/manyVariantsQuestionComponent'

const mapStateToProps = ({ questions, tests, results }) => ({
  activeState: questions.activeState,
  questions: questions.items,
  isReady: questions.isReady,
  testType: tests.testType,
  variantsCount:tests.variantsCount,
  results: results.results
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(testActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(manyVariantQuestion);