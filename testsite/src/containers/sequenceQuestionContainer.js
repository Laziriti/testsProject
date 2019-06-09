import { connect } from 'react-redux';
import * as variantActions from '../actions/createTestAction';
import { bindActionCreators } from 'redux';
import sequenceQuestion from '../components/sequenceQuestionComponent/sequenceQuestionComponent'

const mapStateToProps = ({questions,tests}) => ({
  activeState:questions.activeState,
  questions:questions.items,
  isReady:questions.isReady,
  testType:tests.testType
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(sequenceQuestion);