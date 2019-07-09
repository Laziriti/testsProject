import { connect } from 'react-redux';
import * as testActions from '../actions/createTestAction';
import * as variantActions from '../actions/setVariantsCountAction';
import * as setGroupObjectAction from '../actions/setGroupObjectAction';
import { bindActionCreators } from 'redux';
import sequenceQuestion from '../components/sequenceQuestionComponent/sequenceQuestionComponent'

const mapStateToProps = ({ questions, tests,timer }) => ({
  activeState: questions.activeState,
  questions: questions.items,
  variantsCount:tests.variantsCount,
  testType: tests.testType,
  groupsObject: timer.groupsObject
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(testActions, dispatch),
  ...bindActionCreators(setGroupObjectAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(sequenceQuestion);