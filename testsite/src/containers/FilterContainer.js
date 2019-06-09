import { connect } from 'react-redux';
import * as filterActions from '../actions/filterAction';
import { bindActionCreators } from 'redux';
import Filter from '../components/FilterComponent/FilterComponent'

const mapStateToProps = ({ tests, filter }) => ({
  filterBy: filter.filterBy,
  searchQuery: filter.searchQuery
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(filterActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter);