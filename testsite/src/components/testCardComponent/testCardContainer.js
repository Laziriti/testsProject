import { connect } from 'react-redux';
import * as switchActions from '../../actions/switchAction';
import { bindActionCreators } from 'redux';
import testCard from './testCardComponent'
import * as setPassingTestAct from '../../actions/setPassingTestAction';

const mapStateToProps = ({ tests }) => ({
  activePage: tests.activePage,
  testsList:tests.items
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(switchActions, dispatch),
  ...bindActionCreators(setPassingTestAct, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(testCard);