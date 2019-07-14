import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import testCard from './testCardComponent'
import * as setPassingTestAct from '../../actions/setPassingTestAction';
import * as setEditTest from '../../actions/setEditTestAction';

const mapStateToProps = ({ tests }) => ({
  activePage: tests.activePage,
  testsList:tests.items
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(setPassingTestAct, dispatch),
  ...bindActionCreators(setEditTest, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(testCard);