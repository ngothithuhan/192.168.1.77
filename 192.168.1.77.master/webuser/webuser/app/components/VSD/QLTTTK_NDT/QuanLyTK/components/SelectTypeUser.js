import React, { Component } from 'react';

import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';

import { USER_TYPE_OBJ, CUSTYPE_CN, CUSTYPE_TC, GRINVESTOR_TN, GRINVESTOR_NN, EVENT } from 'app/Helpers'
import './ModalUpsertAccount.scss';
const YES_NO_ARR = [
    { key: 'YES', value: 'Y' },
    { key: 'NO', value: 'N' }
]
class SelectTypeUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            typeUser: {
                IS_PERSONAL: 'Y',
                IS_CITIZEN: 'Y'
            }
        }
    }

    componentWillMount() {
        let { dataTypeUser } = this.props
        if (dataTypeUser) {
            this.setState({ typeUser: dataTypeUser })
        }
    }

    handleOnChange = (event, type) => {
        let cloneTypeUser = { ...this.state.typeUser }
        if (event && event.target) {
            cloneTypeUser[type] = event.target.value
        }
        this.setState({
            typeUser: cloneTypeUser
        })
    }

    checkTypeUser = () => {
        const { IS_PERSONAL, IS_CITIZEN } = this.state.typeUser
        let { setDataTypeUser } = this.props
        setDataTypeUser({ IS_PERSONAL, IS_CITIZEN });
        if (IS_PERSONAL === "Y" && IS_CITIZEN === "Y") {
            this.props.setTypeUser(USER_TYPE_OBJ.CNTN)
            this.props.handleChangeIsShowCusType(IS_PERSONAL, IS_CITIZEN)
        } else if (IS_PERSONAL === "Y" && IS_CITIZEN === "N") {
            this.props.setTypeUser(USER_TYPE_OBJ.CNNN)
            this.props.handleChangeIsShowCusType(IS_PERSONAL,)
        } else if (IS_PERSONAL === "N" && IS_CITIZEN === "Y") {
            this.props.setTypeUser(USER_TYPE_OBJ.TCTN)
            this.props.handleChangeIsShowCusType(IS_PERSONAL, IS_CITIZEN)
        } else {
            this.props.setTypeUser(USER_TYPE_OBJ.TCNN)
            this.props.handleChangeIsShowCusType(IS_PERSONAL, IS_CITIZEN)
        }
    }
    render() {
        return (
            <div className="screen-select-type-user">
                <div className="block-radio">
                    <div className="title-step1">{this.props.strings.chooseType}</div>
                    <div className="custom-radio">
                        {YES_NO_ARR.map((item, index) => {
                            return (
                                <div key={index} >
                                    <input
                                        name='IS_PERSONAL'
                                        type="radio"
                                        value={item.value}
                                        onChange={(e) => this.handleOnChange(e, 'IS_PERSONAL')}
                                        checked={this.state.typeUser.IS_PERSONAL === item.value}
                                    />
                                    {index === 0 ? this.props.strings.personal : this.props.strings.organization}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="block-radio">
                    <div className="title-step1">{this.props.strings.chooseNationtnaly}</div>
                    <div className="custom-radio">
                        {YES_NO_ARR.map((item, index) => {
                            return (
                                <div key={index} >
                                    <input
                                        name='IS_CITIZEN'
                                        type="radio"
                                        value={item.value}
                                        onChange={(e) => this.handleOnChange(e, 'IS_CITIZEN')}
                                        checked={this.state.typeUser.IS_CITIZEN === item.value}

                                    />
                                    {index === 0 ? this.props.strings.vietnam : this.props.strings.oversea}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="btn-center">
                    <button className="btn-confirm" onClick={() => this.checkTypeUser()}>{this.props.strings.confirm}</button>
                </div>
            </div>
        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('SelectTypeUser')
]);

module.exports = decorators(SelectTypeUser);