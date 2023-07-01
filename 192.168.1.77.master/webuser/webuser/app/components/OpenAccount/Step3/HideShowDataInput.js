import React, { Component, Fragment, PureComponent } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { USER_TYPE_OBJ } from 'app/Helpers';
import {
    ARR_ALLOW_CNTN, ARR_ALLOW_CNNN, ARR_ALLOW_TCTN, ARR_ALLOW_TCNN,
    ARR_ALLOW_CNTN_EDIT, ARR_ALLOW_CNNN_EDIT, ARR_ALLOW_TCTN_EDIT, ARR_ALLOW_TCNN_EDIT
} from './Step3Utils';
class HideShowDataInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowInput: true,
            isFirstRender: true
        }
    }

    componentDidMount() {
        let { userType, inputName, isLoggedOut } = this.props;
        let { isShowInput } = this.state;

        let arrAllow = [];
        if (userType === USER_TYPE_OBJ.CNTN) {
            arrAllow = isLoggedOut ? ARR_ALLOW_CNTN : ARR_ALLOW_CNTN_EDIT;
        }
        if (userType === USER_TYPE_OBJ.CNNN) {
            arrAllow = isLoggedOut ? ARR_ALLOW_CNNN : ARR_ALLOW_CNNN_EDIT;
        }
        if (userType === USER_TYPE_OBJ.TCTN) {
            arrAllow = isLoggedOut ? ARR_ALLOW_TCTN : ARR_ALLOW_TCTN_EDIT;
        }
        if (userType === USER_TYPE_OBJ.TCNN) {
            arrAllow = isLoggedOut ? ARR_ALLOW_TCNN : ARR_ALLOW_TCNN_EDIT;
        }

        if (arrAllow && arrAllow.length > 0 && arrAllow.includes(inputName)) {
            isShowInput = true;
        } else {
            isShowInput = false;
        }

        this.setState({
            isShowInput: isShowInput,
            isFirstRender: false
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isFirstRender) return true;
        let { allDataStep3, inputName, allDataSelect } = this.props;
        return allDataStep3[inputName] !== nextProps.allDataStep3[inputName]
            || allDataSelect !== nextProps.allDataSelect
            || nextProps.shouldReRender === true
    }

    render() {
        let { isShowInput } = this.state;

        return (
            <React.Fragment>
                {
                    isShowInput &&
                    <React.Fragment>
                        {this.props.children}
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }

}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('HideShowDataInput')
]);

module.exports = decorators(HideShowDataInput);
