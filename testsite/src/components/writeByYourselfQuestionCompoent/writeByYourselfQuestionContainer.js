import { connect } from 'react-redux';
import * as variantActions from '../../redux/actions/createTestAction';
import * as setGroupObjectAction from '../../redux/actions/setGroupObjectAction';
import { bindActionCreators } from 'redux';
import writeByYourselfQuest from './writeByYourselfQuestionCompoent'

const mapStateToProps = ({ questions, tests, results,timer }) => ({
    activeState: questions.activeState,
    questions: questions.items,
    testType: tests.testType,
    results: results.results,
    groupsObject: timer.groupsObject
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(variantActions, dispatch),
    ...bindActionCreators(setGroupObjectAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(writeByYourselfQuest);