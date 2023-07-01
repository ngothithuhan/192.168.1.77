
var Main = require('Main');
var React = require('react');
import MainFooter from './MainFooter';
import './Layout.scss'

class Layout extends React.Component {

  async componentDidMount() {

  }
  render() {
    console.log('this.props.children:::', this.props.children);
    return (
      <div>
        <div id="loadingscreen">
          <div id="loader" ></div>
        </div>
        <Main />

        <div id="main_body" className="container main_body" >
          {this.props.children}
        </div>
        {/* <MainFooter /> */}
      </div>

    )
  }
}

module.exports = Layout;


