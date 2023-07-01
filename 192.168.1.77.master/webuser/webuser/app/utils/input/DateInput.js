import React from 'react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { convertDate } from 'app/utils/dateUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import flow from 'lodash.flow';
import { connect } from 'react-redux';
import translate from 'app/utils/i18n/Translate.js';
import InputMask from 'react-input-mask';

class DateInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            value: '',
            showTooltip: false,
            startDate: '',

        }
    }
    componentDidMount() {

        let date = null;
        let value = ''
        if (!this.props.isTime) {
            if (this.props.value && this.props.value != '' && this.props.value != 'Invalid date') {
                date = moment(convertDate(this.props.value))
                value = this.props.value
                this.setState({ date: date, value: value })
            }
            else {
                this.setState({ date: date, value: value })
            }
        } else {
            //  console.log(this.props.value)
            if (this.props.value && this.props.value != '' && this.props.value != 'Invalid date') {
                date = moment(this.props.value, 'HH:mm')
                value = this.props.value
                this.setState({ startDate: date, value: value })
            }
            else {
                this.setState({ startDate: date, value: value })
            }
        }
    }
    componentWillReceiveProps(nextProps) {

        let date = null;
        let value = '';
        if (!this.props.isTime) {
            // là 1 ngày hợp lệ thì sẽ set state để hiển thị
            if (nextProps.value && nextProps.value != '' && nextProps.value != "Invalid date") {
                date = moment(convertDate(nextProps.value))
                value = nextProps.value
                this.setState({ date: date, value: value })
            }
            else {
                this.setState({ date: date, value: value })
            }
        } else {
            if (nextProps.value && nextProps.value != '' && nextProps.value != "Invalid date") {
                date = moment(nextProps.value, 'HH:mm')
                value = nextProps.value
                this.setState({ startDate: date, value: value })
            }
            else {
                this.setState({ startDate: date, value: value })
            }
        }
    }
    onChange(date) {

        let value = date ? moment(date).format('DD/MM/YYYY') : '';
        value = value == "Invalid date" ? '' : value
        if (!date) {
            this.setState({ showTooltip: false })
        }
        this.props.onChange(this.props.type, { type: 'date', value: value })
        this.setState({ date: date, value: value })
    }
    onBlur(e) {

        let date = e.target.value;
        date = date.replace(/_/g, '');
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        if (date.length > 0) {
            if (!moment(date, 'DD/MM/YYYY').isValid() || (date.length !== 10)) {
                let date = null;
                let value = '';

                datanotify.type = "error";
                datanotify.content = this.props.strings.invalidDate;
                dispatch(showNotifi(datanotify));
                window.$('#' + this.props.id).focus();
                this.props.onChange(this.props.type, { type: 'date', value: value });
                this.setState({ showTooltip: true, date: date, value: value, });
            }
            else {
                if (this.props.maxDate) {
                    let maxDate = moment(this.props.maxDate, "DD/MM/YYYY")
                    let valuedate = moment(date, "DD/MM/YYYY")
                    if (!(valuedate).isBefore(maxDate)) {
                        if (date != maxDate.format("DD/MM/YYYY")) {
                            datanotify.type = "error";
                            datanotify.content = this.props.strings.invalidMaxDate;
                            dispatch(showNotifi(datanotify));
                            window.$('#' + this.props.id).focus();
                            // this.props.onChange(this.props.type, { type: 'date', value: value });
                            //  this.setState({ showTooltip: true});
                        }
                    }
                }
            }
        }

    }
    handleChange(time) {


        let value = time ? moment(time).format('LT') : '';
        this.props.handleChange(this.props.type, { value: value })
        this.setState({
            startDate: time
        })
    }
    onBlur1(e) {

        let date = e.target.value;

        date = date.replace(/_/g, '');
        if (!moment(date, 'LT').isValid() || (date.length !== 5)) {
            let date = null;
            let value = '';
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            datanotify.type = "error";
            datanotify.content = this.props.strings.invalidTime;
            dispatch(showNotifi(datanotify));
            window.$('#' + this.props.id).focus();
            //this.props.handleChange(this.props.type, { value: value });
            this.setState({ startDate: date, value: value, });
        } else {
            //   let value = time ? moment(time).format('LT') : '';
            this.props.handleChange(this.props.type, { value: e.target.value })
            this.setState({
                startDate: e.target.value
            })
        }


    }
    render() {
        let props = this.props;
        return (
            <React.Fragment>
                {!this.props.isTime ?
                    <DatePicker
                        // isClearable={!props.disabled}
                        disabled={this.props.disabled}
                        id={this.props.id}
                        onBlur={this.onBlur.bind(this)}
                        allowSameDay={true}
                        //  disabled={props.disabled}
                        placeholderText={props.placeholderText ? props.placeholderText : "DD/MM/YYYY"}
                        dateFormat="DD/MM/YYYY"
                        selected={this.state.date}
                        onChange={this.onChange.bind(this)}
                        //peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        // dropdownMode="select"
                        //fixedHeight
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        disabledKeyboardNavigation={true}
                        locale={this.props.lang == 'vie' ? "vi" : this.props.lang}
                        // customInput={<InputMask mask="99/99/9999" />}
                        className="form-control"

                    // showTimeSelect
                    // showTimeSelectOnly
                    //timeIntervals={15}
                    // timeFormat="HH:mm"
                    // timeCaption="Time"
                    />
                    :
                    <DatePicker
                        className="form-control"
                        locale="vi"
                        selected={this.state.startDate}
                        onChange={this.handleChange.bind(this)}
                        showTimeSelect
                        showTimeSelectOnly
                        dateFormat="LT"
                        timeFormat="HH:mm"
                        customInput={<InputMask mask="99:99" />}
                        onBlur={this.onBlur1.bind(this)}
                        id={this.props.id}
                        disabled={this.props.disabled}
                        //fixedHeight
                        placeholderText="HH24:MI"
                        timeCaption={this.props.strings.timecaption}
                    />
                }
            </React.Fragment>
        )
    }
}


/*
class DateInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            value: '',
            showTooltip: false
        }
    }
    valid=(current )=>{
        if(this.props.valid)
            return this.props.valid(current );
        else
            return true;
    }
    renderMonth=(props, month, year, selectedDate )=>{
        return <td {...props}>{this.props.strings.month+' '+ (month+1) }</td>;
    }
    componentDidMount() {
        let date = null;
        let value = ''
        if (this.props.value && this.props.value != '' && this.props.value != 'Invalid date') {
            date = moment(convertDate(this.props.value))
            value = this.props.value
            this.setState({ date: date, value: value })
        }
        else {
            this.setState({ date: date, value: value })
        }
    }
    
    componentWillReceiveProps(nextProps) {
        let date = null;
        let value = '';
        // là 1 ngày hợp lệ thì sẽ set state để hiển thị
        if (nextProps.value && nextProps.value != '' && nextProps.value != "Invalid date") {
            date = moment(convertDate(nextProps.value))
            value = nextProps.value
            this.setState({ date: date, value: value })
        }
        else {
            this.setState({ date: date, value: value })
        }
    }
    onChange(date) {
    
        if (!date) {
           // this.setState({ showTooltip: false })
           date=''
        }
        else{
            if(moment(date).isValid()) {
        let value = date ? date.format('DD/MM/YYYY') : '';
        value = value == "Invalid date" ? '' : value
        this.props.onChange(this.props.type, { type: 'date', value: value })
        this.setState({ date: date, value: value })
            }
        }
    }

    render() {
        let props = this.props;
        return (

            <Datetime
                isValidDate={this.valid}
                name={this.props.id}
                value={this.state.value}
                closeOnSelect={true}
                dateFormat="DD/MM/YYYY"
                onChange={(value) => this.onChange(value)}
                renderMonth={ this.renderMonth }
                timeFormat={false}
                locale={this.props.lang == 'vie' ? "vi" : this.props.lang}
                inputProps={{ id: this.props.id,style:{backgroundColor:'white'},readOnly:false }}
                onBlur={this.props.focousOut}
                inputCustom={<InputMask mask="99-99-9999" defaultValue="26-05-2018" />}
            />

        )
    }
}
*/
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('DateInput')
]);

module.exports = decorators(DateInput);
