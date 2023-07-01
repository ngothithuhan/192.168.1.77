import React, { Component, Fragment } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'

class SimpleCountDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            isSecond: true,
            isFirstRender: true
        }
    }


    componentDidMount() {
        this.setState({
            count: this.props.duration ? this.props.duration : 60,
            isSecond: this.props.isSecond
        }, () => {
            this.startTimer();
        })
    }

    componentWillUnmount() {
        if (this.timer) {
            this.clearTimer();
        }
    }

    componentDidUpdate(prevState, prevProps) {
        if (prevState.count !== this.state.count && this.state.count === 0) {
            if (this.timer) {
                this.clearTimer();
            }
            if (this.props.onTimesUp) {
                this.props.onTimesUp();
            }
        }
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
            })
        }, 1000);
    }

    formatTime = (time) => {
        let { isSecond } = this.state;
        if (isSecond === false) {
            //theo format: mm:ss
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;

            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            return `${minutes}:${seconds}`;
        }
        else {
            //theo format: ss
            return time;
        }
    }


    render() {
        let { count } = this.state;
        let { duration, onTimesUp } = this.props;
        return (
            <React.Fragment>
                <span className="simple-countdown-container">{this.formatTime(count)}</span>
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
    translate('CreateAccount')
]);

module.exports = decorators(SimpleCountDown);
