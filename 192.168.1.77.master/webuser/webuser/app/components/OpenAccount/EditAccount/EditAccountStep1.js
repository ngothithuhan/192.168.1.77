import React, { Component } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import CreateAccountStep3 from '../Step3/CreateAccountStep3';

export class EditAccountStep1 extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //todo
    }

    componentDidUpdate(prevState, prevProps) {
        //todo
    }
    render() {
        return (
            <React.Fragment>
                <CreateAccountStep3
                    userType={this.props.userType}
                    isLoggedOut={false} //dùng để phân biệt đang dùng luồng tạo tài khoản hay luồng sửa tài khoản
                    // sửa tài khoản dùng cho sửa tài khoản nhà đầu tư và tạo tài khoản (admin)
                    setStepEdit={this.props.setStep}
                    dataEditStep1={this.props.dataStep1}
                    allDataEdit={this.props.allDataEdit}
                    action={this.props.action}
                    setParentStateFromChild={this.props.setParentStateFromChild}
                    GRINVESTOR={this.props.GRINVESTOR}
                    CUSTTYPE={this.props.CUSTTYPE}
                />
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
    translate('EditAccountStep1')
]);

module.exports = decorators(EditAccountStep1);
