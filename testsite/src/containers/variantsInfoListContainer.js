import { connect } from 'react-redux';
import * as variantActions from '../actions/createTestAction';
import { bindActionCreators } from 'redux';
import variantsInfo from '../components/variantsInfoListComponent/variantsInfoListComponent'

const mapStateToProps = () => ({

});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(variantActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(variantsInfo);