import Toggle from 'react-toggle'
import "react-toggle/style.css"
import React from 'react'

class ToggleUtil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillReceiveProps(nextProps) {
        // if(nextProps.value&&nextProps.value=="Y"){
        //     this.setState
        // }
    }
    onChange(event) {
        if (event.target.checked) {
            this.props.onChange(this.props.type, { type: "toggle", value: "Y" })
        }
        else {
            this.props.onChange(this.props.type, { type: "toggle", value: "N" })
        }
    }
    render() {
        return (
            <Toggle
                id={this.props.id ? this.props.id : "cbtoogle"}
                defaultChecked={this.props.value == "Y" ? true : false}
                disabled={this.props.disabled}
                onChange={this.onChange.bind(this)} />
        )
    }
}
module.exports = ToggleUtil