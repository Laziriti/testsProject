import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import deleteTestComponent from './deleteTestComponent'
import * as testsActions from '../../actions/testsAction';
const mapStateToProps = ({ tests }) => ({
    tests: tests.items
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(testsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(deleteTestComponent);