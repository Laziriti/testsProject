import { connect } from 'react-redux';
import * as testActions from '../actions/createTestAction';
import * as variantActions from '../actions/setVariantsCountAction';
import { bindActionCreators } from 'redux';
import sequenceQuestion from '../components/sequenceQuestionComponent/sequenceQuestionComponent'

const mapStateToProps = ({ questions, tests }) => ({
  activeState: questions.activeState,
  questions: questions.items,
  isReady: questions.isReady,
  variantsCount:tests.variantsCount,
  testType: tests.testType
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(testActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(sequenceQuestion);