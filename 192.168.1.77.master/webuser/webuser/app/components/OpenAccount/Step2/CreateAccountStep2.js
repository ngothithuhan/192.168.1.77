import React, { Component, Fragment } from "react";
import TestCam from './TestCam.js';
import './CreateAccountStep2.scss';

class CreateAccountStep2 extends Component {
    onChangeAllData = (data) => {
        this.props.onChangeAllData(data)
    }
    render() {
        let { allData, setStep, currentStep } = this.props

        return (
            <React.Fragment>
                <div className='create-account-step2'>
                    <TestCam
                        setStep={setStep}
                        currentStep={currentStep}
                        allData={allData}
                        onChangeAllData={this.onChangeAllData}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default CreateAccountStep2;