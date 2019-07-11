import { connect } from 'react-redux';
import * as testsActions from './actions/testsAction';
import { bindActionCreators } from 'redux';
import App from './components/AppComponent';
import {withRouter} from 'react-router-dom'
const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(testsActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
