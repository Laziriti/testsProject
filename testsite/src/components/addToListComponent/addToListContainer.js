import { connect } from 'react-redux';
import * as variantActions from '../../actions/createTestAction';
import { bindActionCreators } from 'redux';
import addToList from './addToListComponent'

const mapStateToProps = ({ questions, timer }) => ({
  activeState: questions.activeState,
  questions: questions.items,
  groupsObject: timer.groupsObject
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(addToList);