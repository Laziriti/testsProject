import { connect } from 'react-redux';
import * as testActions from '../../actions/createTestAction';
import * as variantActions from '../../actions/setVariantsCountAction';
import * as setGroupObjectAction from '../../actions/setGroupObjectAction';
import * as setNotFullPriceArrAction from '../../actions/setNotFullPriceArrAction';
import { bindActionCreators } from 'redux';
import sequenceQuestion from './sequenceQuestionComponent'

const mapStateToProps = ({ questions, tests, timer }) => ({
  activeState: questions.activeState,
  questions: questions.items,
  variantsCount: tests.variantsCount,
  testType: tests.testType,
  groupsObject: timer.groupsObject,
  notFullPriceArr: questions.notFullPriceArr
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(testActions, dispatch),
  ...bindActionCreators(setGroupObjectAction, dispatch),
  ...bindActionCreators(setNotFullPriceArrAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(sequenceQuestion);