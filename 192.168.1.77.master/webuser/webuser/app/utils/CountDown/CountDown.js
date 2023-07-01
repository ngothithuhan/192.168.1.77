import React, { Component, Fragment } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import './CountDown.scss';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 60;
const ALERT_THRESHOLD = 30;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

const remainingPathColor = COLOR_CODES.info.color;



class CountDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TIME_LIMIT: 0,
            count: 0,
            isFirstRender: true
        }
    }
    async componentWillMount() {
        if (this.props.duration) {
            await this.getSystemDuration();
        }
    }

    async componentDidMount() {

        // this.startTimer();
    }

    componentWillUnmount() {
        if (this.timer) this.clearTimer();
    }

    componentDidUpdate(prevState, prevProps) {
        if (prevState.count !== this.state.count && this.state.count === 0 && !this.state.isFirstRender) {
            if (this.timer) {
                this.clearTimer();
            }
            this.props.onTimesUp();
        }
    }

    getSystemDuration = async () => {
        let that = this;
        let datanotify = {
            type: "",
            header: "",
            content: ""
        }
        await RestfulUtils.post('/otp/gettimeotp', { OBJECTNAME: 'GETTIMEOTP' }).then(resData => {
            if (resData.EC == 0 && resData.DT) {
                let minute = +resData.DT.fn_get_sysvar;
                that.setState({
                    ...that.state,
                    TIME_LIMIT: minute * 60,
                    count: minute * 60,
                    isFirstRender: false,
                }, () => {
                    that.startTimer();
                })
            } else {
                that.setState({
                    ...that.state,
                    TIME_LIMIT: 0,
                    count: 0,
                    isFirstRender: true,
                })

                datanotify.type = "error";
                datanotify.content = resData.EM;
                that.props.dispatch(showNotifi(datanotify));
            }
        })
    }

    clearTimer = () => {
        clearInterval(this.timer);
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            let { count } = this.state;
            count = count - 1;
            if (count === 0) {
                this.clearTimer();
            }
            this.setState({
                ...this.state,
                count: count
            }, () => {
                this.setCircleDasharray();
                this.setRemainingPathColor();
            })
        }, 1000);
    }

    formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    }

    setRemainingPathColor = () => {
        let { count } = this.state;
        const { alert, warning, info } = COLOR_CODES;
        if (count <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (count <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        }
    }

    calculateTimeFraction = () => {
        let { TIME_LIMIT, count } = this.state;
        const rawTimeFraction = count / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    setCircleDasharray = () => {
        const circleDasharray = `${(
            this.calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("strokeDasharray", circleDasharray);
    }


    render() {
        let { count } = this.state;
        let { duration, onTimesUp } = this.props;
        return (
            <div className="count-down-container">
                <div className="base-timer">
                    <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <g className="base-timer__circle">
                            <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                            <path
                                id="base-timer-path-remaining"
                                strokeDasharray="283"
                                className={`base-timer__path-remaining ${remainingPathColor}`}
                                d="
                                    M 50, 50
                                    m -45, 0
                                    a 45,45 0 1,0 90,0
                                    a 45,45 0 1,0 -90,0
                                    "
                            ></path>
                        </g>
                    </svg>
                    <span id="base-timer-label" className="base-timer__label">
                        {/* ${formatTime(timeLeft)} */}
                        {this.formatTime(count)}
                    </span>
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
    translate('CreateAccount')
]);

module.exports = decorators(CountDown);
