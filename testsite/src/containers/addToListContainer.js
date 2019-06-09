import { connect } from 'react-redux';
import * as variantActions from '../actions/createTestAction';
import { bindActionCreators } from 'redux';
import addToList from '../components/addToListComponent/addToListComponent'

const mapStateToProps = ({ questions }) => ({
  activeState: questions.activeState,
  questions: questions.items
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(addToList);