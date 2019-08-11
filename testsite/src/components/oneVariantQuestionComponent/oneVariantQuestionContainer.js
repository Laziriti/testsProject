import { connect } from 'react-redux';
import * as testActions from '../../redux/actions/createTestAction';
import * as variantActions from '../../redux/actions/setVariantsCountAction';
import * as setGroupObjectAction from '../../redux/actions/setGroupObjectAction';
import { bindActionCreators } from 'redux';
import oneVariantQuestion from './oneVariantQuestionComponent'

const mapStateToProps = ({ questions, tests, results, timer }) => ({
  activeState: questions.activeState,
  questions: questions.items,
  testType: tests.testType,
  variantsCount: tests.variantsCount,
  results: results.results,
  groupsObject: timer.groupsObject
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch),
  ...bindActionCreators(testActions, dispatch),
  ...bindActionCreators(setGroupObjectAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(oneVariantQuestion);