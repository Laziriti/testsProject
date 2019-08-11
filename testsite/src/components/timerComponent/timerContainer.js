import { connect } from 'react-redux';
import * as variantActions from '../../redux/actions/createTestAction';
import * as lolAct from '../../redux/actions/resultsAction';

import { bindActionCreators } from 'redux';
import timerComponent from './timerComponent'

const mapStateToProps = ({ timer }) => ({
    questionMinutes: timer.questionMinutes,
    questionSeconds: timer.questionSeconds,
    questionGroupMinutes: timer.questionGroupMinutes,
    questionGroupSeconds: timer.questionGroupSeconds,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(variantActions, dispatch),
    ...bindActionCreators(lolAct, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(timerComponent);