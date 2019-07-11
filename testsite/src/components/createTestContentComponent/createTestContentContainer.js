import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import CreateTestContentComponent from './createTestContentComponent'

const mapStateToProps = ({ tests, results }) => ({
    results: results.results,
    testType: tests.testType,
});

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTestContentComponent);