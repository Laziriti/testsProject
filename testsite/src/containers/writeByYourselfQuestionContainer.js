import { connect } from 'react-redux';
import * as variantActions from '../actions/createTestAction';
import * as setGroupObjectAction from '../actions/setGroupObjectAction';
import { bindActionCreators } from 'redux';
import writeByYourselfQuest from '../components/writeByYourselfQuestionCompoent/writeByYourselfQuestionCompoent'

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