import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RestfulUtils from 'app/utils/RestfulUtils'
import { LabelEx } from 'app/utils/LabelEx';

class ComboDataBind extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Data: []
    }
  }
  componentDidMount() {
    let self = this
    RestfulUtils.post(self.props.dataurl, self.props.datafilter).then((resdata) => {
      if (resdata.errCode == 0) {
        self.setState({ Data: resdata.data })
      }
      
    })
  }
  render() {
    var that = this;
    var Data = that.state.Data,
      MakeItem = function (X, index) {
        return <option value={X.CDVAL} key={index}>{that.props.language == "vie" ? X.CDCONTENT : X.EN_CDCONTENT}</option>;
      };
    return (
      <select onChange={event => that.props.onChange(event.target.value)}
        style={that.props.style ? that.props.style : {width: "100%"} } className={that.props.className}
        value={that.props.filter ? that.props.filter.value : ""}>
        <LabelEx value="" className="" text="Tất cả" type="option" />
        {Data.map(MakeItem)}
      </select>
    )

  }
}
ComboDataBind.contextTypes = {
  router: PropTypes.object.isRequired
}
module.exports = {
  ComboDataBind: connect(function (state) {
    return {
      language: state.language.language
    };
  })(ComboDataBind)
};