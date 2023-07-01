import React, { Component, Fragment } from "react";


// import TestVideo from './TestVideo'
import TestCamFace from './TestCamFace'
import './CreateAccountStep2.scss';

class CreateAccountStep2_1 extends Component {
    onChangeAllData = (data) => {
        this.props.onChangeAllData(data)
    }
    render() {
        let { allData, setStep, currentStep } = this.props

        return (
            <React.Fragment>
                <div className='create-account-step21'>
                    {/* <TestVideo
                        setStep={setStep}
                        currentStep={currentStep}
                        allData={allData}
                        onChangeAllData={this.onChangeAllData}
                    /> */}
                    {/* Capture image */}
                    <TestCamFace
                        setStep={setStep}
                        currentStep={currentStep}
                        allData={allData}
                        onChangeAllData={this.onChangeAllData}
                    />
                </div>
            </React.Fragment >
        );
    }
}

export default CreateAccountStep2_1;