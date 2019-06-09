import { connect } from 'react-redux';
import * as switchActions from '../actions/switchAction';
import * as testTypeActions from '../actions/cangeTestTypeAction';
import { bindActionCreators } from 'redux';
import Menu from '../components/mainMenuComponent/mainMenuComponent';
import * as setPassingTestAct from '../actions/setPassingTestAction';
import * as setIndexActions from '../actions/nextIndexOfQuestion';
const mapStateToProps = ({ tests }) => ({
  activePage: tests.activePage,
  testType: tests.testType

});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(switchActions, dispatch),
  ...bindActionCreators(testTypeActions, dispatch),
  ...bindActionCreators(setPassingTestAct, dispatch),
  ...bindActionCreators(setIndexActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu);