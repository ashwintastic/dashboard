import { connect } from 'react-redux';
import Header from '../components/Header';

const mapStateToProps = (state) => ({
  showLogout: !!state.auth.user.email,
  userEmail: state.auth.user.email,
  userName: state.auth.user.firstName ? 'Hi ' + state.auth.user.firstName : state.auth.user.email
});

export default connect(mapStateToProps)(Header);
