import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import testCard from './testCardComponent'
import * as setPassingTestAct from '../../actions/setPassingTestAction';

const mapStateToProps = ({ tests }) => ({
  activePage: tests.activePage,
  testsList:tests.items
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(setPassingTestAct, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(testCard);