import React, { Component } from 'react';
import './WizardComponent.scss';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'

class WizardComponent extends Component {

    wizardLegends = this.props.isOpenAccount ?
        [
            'this.props.strings.step1',
            'this.props.strings.step2',
            'this.props.strings.step3',
            'this.props.strings.step4',
        ] :
        [
            'this.props.strings.tab1',
            'this.props.strings.tab2',
            'this.props.strings.tab3',
            'this.props.strings.tab4',
        ];

    static defaultProps = {
        step: 1,
    };

    initialState = {
        canGo: false,
        isStep1: false,
        isStep2: false,
        isStep3: false,
        isStep4: false,
        isStep5: false,
        shorterLegend: [],
        activedLegends: []
    };

    state = {
        ...this.initialState
    }

    componentDidMount() {
        const { multiStep } = this.props;
        if (multiStep) {
            this.getShorterLegend();
        }
    }

    getShorterLegend = () => {
        const legends = this.wizardLegends;
        if (legends.length > 3) {
            this.setState({
                shorterLegend: legends.slice(1, legends.length - 1)
            }, () => {
                this.updateActivedStep();
            });
        } else {
            this.setState({ shorterLegend: legends.length > 1 ? legends[1] : [] })
        }
    };

    updateActivedStep = () => {
        const { shorterLegend } = this.state;
        const { step } = this.props;
        let newActivedLegends = [];
        let nextStepIndex = step - 2;
        if (nextStepIndex >= 0 && shorterLegend.length > 0) {
            for (let i = 0; i <= nextStepIndex; i++) {
                newActivedLegends.push(shorterLegend[i]);
                this.setState({ activedLegends: newActivedLegends });
            }
        } else {
            this.setState({ activedLegends: [] });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { step, multiStep } = this.props;
        const { step: prevStep } = prevProps;
        const { shorterLegend } = this.state;
        let newActivedLegends = [];
        if (step !== prevStep && multiStep) {
            this.updateActivedStep();
        }
    }

    onLegendClick = (stepClicked) => {
        const { step, onClick, clickable } = this.props;
        if (clickable === true && onClick) {
            onClick(stepClicked);
        }
    }


    getLegendText = (id) => {
        if (id) {
            let arrId = id.split('.');
            let currentStep = arrId[arrId.length - 1];
            return this.props.strings[currentStep]
        }
        return '-';
    }
    render() {
        const legends = this.wizardLegends;
        const { multiStep, step, clickable } = this.props;
        const { shorterLegend, activedLegends } = this.state;
        let activeMsgId = "";
        if (multiStep && shorterLegend.length > 0 && step > 1) {
            activeMsgId = shorterLegend[step - 2];
        }


        return (
            <div className="wizard">
                <div className="row no-gutters" style={{ display: 'flex', position: 'relative' }}>
                    {/* Render step 1 */}
                    {multiStep && shorterLegend.length > 0 &&
                        <div className="col">
                            <div
                                className={"step step-first " + (step === 1 ? "active" : "") + (step > 1 ? " actived" : "") + (clickable === true ? ' clickable' : '')}
                                onClick={this.onLegendClick.bind(null, 1)}
                            >
                                <div className="step-icon">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="step-legend">
                                    <span>{this.getLegendText(legends[0])}</span>
                                </div>
                            </div>
                        </div>
                    }

                    {/* Render step 2 3 4 5 */}
                    {multiStep && shorterLegend.length > 0 &&
                        shorterLegend.map((element, index) => {
                            let active = (activeMsgId !== "" && activeMsgId === element);
                            let actived = activedLegends.includes(element);
                            let activing = actived && active;
                            let stepLegend = legends.findIndex(item => item === element) + 1;
                            let iconStep = "";
                            switch (stepLegend) {
                                case 2:
                                    iconStep = <i className="fas fa-fingerprint"></i>
                                    break;
                                case 3:
                                    iconStep = <i className="fas fa-id-card-alt"></i>
                                    break;
                                case 4:
                                    iconStep = <i className="fas fa-headset" />
                                    break;
                                case 5:
                                    iconStep = <i className="fas fa-book-open"></i>
                                default:
                                    iconStep = <i className="fas fa-book-open" />
                                    break;
                            }
                            return (
                                <div className="col" key={index}>
                                    <div
                                        className={"step step-middle " + (activing ? 'active' : "") + ((actived && !active) ? 'actived' : "")}
                                        onClick={this.onLegendClick.bind(null, stepLegend)}
                                    >
                                        <div className="step-icon">
                                            {iconStep}
                                        </div>
                                        <div className="step-legend">
                                            {legends.length > 1 &&
                                                <span>{this.getLegendText(element)}</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    {multiStep && shorterLegend.length > 0 &&
                        <div className="col">
                            <div className={"step step-last " + (step === legends.length ? "active" : "")}>
                                <div className="step-icon">
                                    <i className="fas fa-check" />
                                </div>
                                <div className="step-legend">
                                    {this.getLegendText(legends[legends.length - 1])}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('WizardComponent')
]);

module.exports = decorators(WizardComponent);
