import { connect } from 'react-redux';
import * as switchActions from '../actions/switchAction';
import * as variantActions from '../actions/variantAction';
import { bindActionCreators } from 'redux';
import CreateTestMain from '../components/createTestMainComponent'

const mapStateToProps = ({ questions }) => ({
  questions:questions.items
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(switchActions, dispatch),
  ...bindActionCreators(variantActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTestMain);