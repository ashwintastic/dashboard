import LoadingBar from 'react-redux-loading-bar'

export default class Header extends React.Component {
  render() {
    return (
      <header>
        <LoadingBar style={{ backgroundColor: 'red', height: '500px' }}/>
      </header>
    )
  }
}