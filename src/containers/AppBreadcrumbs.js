import { connect } from 'react-redux';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

const mapStateToProps = (state) => ({
    links: state.breadcrumbs,
});

export default connect(mapStateToProps)(Breadcrumbs);
