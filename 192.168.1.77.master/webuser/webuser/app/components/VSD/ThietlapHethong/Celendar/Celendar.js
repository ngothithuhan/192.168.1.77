import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import RestfulUtil from "app/utils/RestfulUtils";
import ReactDOM from 'react-dom';
import { Doughnut } from 'react-chartjs-2';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
// Make sure moment.js has the required locale data
import 'moment/locale/ja';
import 'moment/locale/ar';
import 'moment/locale/it';
function startFocusOut() {
  $(document).on("click", function () {
    $("#cntnr").hide();
    $(document).off("click");
  });
}
const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);


function YearMonthForm({ date, localeUtils, onChange, lang, loadData }) {
  const months = localeUtils.getMonths(lang);

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {

    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
    loadData(parseInt(month.value) + 1, year.value);
  };

  return (
    <form className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()} id="CBmonth">
        {months.map((month, i) => (
          <option key={month} value={i} id={"lblMonth" + i}>
            {month}
          </option>
        ))}
      </select>
      <span>&nbsp;</span>
      <select name="year" onChange={handleChange} value={date.getFullYear()} id="CByear">
        {years.map(year => (
          <option key={year} value={year} id={"lblYear" + year}>
            {year}
          </option>
        ))}
      </select>
    </form>
  );
}
var datax = []
class Celendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    this.state = {
      chartData: {}, //data test for chart
      arrSYMBOL: [], // mang symbol = label
      arrBALQTTY: [], // mang gtri
      selectedDays: [],
      selectedDay: '',
      month: fromMonth,
      locale: 'vi',
      datax: []
    };
  }
  handleYearMonthChange = (month) => {
    this.setState({ month: month });

  }
  workClick = () => {
    const { selectedDays, selectedDay } = this.state;
    const selectedIndex = selectedDays.findIndex(choseDay =>
      DateUtils.isSameDay(choseDay, selectedDay)
    );
    if (selectedIndex >= 0) {
      selectedDays.splice(selectedIndex, 1);
      this.setHolidayorWorkday(selectedDay.toLocaleDateString('en-GB'), 'N')
      this.setState({ selectedDays: selectedDays });
    }
  }
  holidayClick = () => {

    const { selectedDays, selectedDay } = this.state;
    var a = new Date(selectedDay)
    //console.log(selectedDay.toLocaleDateString('en-GB'))
    this.setHolidayorWorkday(selectedDay.toLocaleDateString('en-GB'), 'Y')
    selectedDays.push(a);
    this.setState({ selectedDays: selectedDays });
  }
  async setHolidayorWorkday(p_day, p_isholiday) {
    var { dispatch, datapage } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }
    await RestfulUtils.posttrans('/celendar/setlistcelendar', { p_day, p_isholiday,OBJNAME: datapage.OBJNAME }).then((resData) => {

   

        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        if (resData.EC == 0) {
          datanotify.type = "success";
          datanotify.content = this.props.strings.success;
          dispatch(showNotifi(datanotify));

        } else {
          datanotify.type = "error";
          datanotify.content = resData.EM;
          dispatch(showNotifi(datanotify));
        }


    
    })
  }
  handleDayClick(day, { selected }, event) {

    // const { selectedDays } = this.state;
    // if (selected) {
    //   const selectedIndex = selectedDays.findIndex(selectedDay =>
    //     DateUtils.isSameDay(selectedDay, day)
    //   );
    //   selectedDays.splice(selectedIndex, 1);
    // } else {
    //   selectedDays.push(day);
    // }
    // this.setState({ selectedDays: selectedDays });
    this.setState({ selectedDay: day })
    window.$("#cntnr").css("top", event.pageY);
    window.$("#cntnr").css("left", event.pageX);
    window.$("#cntnr").fadeIn(200, startFocusOut());
  }
  componentWillMount() {
    this.loadData(fromMonth.getMonth() + 1, currentYear)


  }

  loadData = async (month, year) => {
    let { datapage } = this.props
    var that = this;
    await RestfulUtils.posttrans('/celendar/getlistcelendar', { month, year, objname: datapage.OBJNAME }).then((resData) => {
        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        if (resData.EC == 0)

          // var tmpdata=[];
          // for (let index = 0; index < resData.DT.data.length; index++) {

          //   that.state.datax.push(new Date(resData.DT.data[index].sbdate))

          // }resData.DT.data.vl.filter(nodes=>nodes==true)
          resData.DT.data.map(function (date, index) {
            if (date.HOLIDAY == 'Y')
              that.state.selectedDays[index] = new Date(date.SBDATE)

          })

        that.setState({ selectedDays: that.state.selectedDays })
      

    })

  }
  //xu li cho chart 

  getChartData(labels, data) {
    // Ajax calls here for get data chart
    //console.log('hhihi check coi data!', data)
    this.setState({
      chartData: {
        labels: labels,
        datasets: [{
          label: 'My First dataset',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255,153,0,0.6)'
          ],
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255,153,0,0.6)'
          ]
        }]

      }
    });
  }

  componentDidMount() {
    //this.getChartData(this.state.arrSYMBOL, this.state.arrBALQTTY)
  }
  componentWillReceiveProps() {

  }
  getOptions(input) {
    return RestfulUtils.post('/account/search_all', { key: input })
      .then((res) => {
        return { options: res }
      })
  }
  async onChange(e) {
    // console.log(e)
    let arrTamLABEL = []
    let arrTamDATA = []
    let { datapage } = this.props
    //console.log('pha rong  ko???? ', this.state.chartData, this.state.arrBALQTTY)
    if (e) {
      var that = this;
      let CUSTODYCD = this.state.CUSTODYCD === null ? "" : this.state.CUSTODYCD;
      var obj = {
        CUSTODYCD: e.value,
        CODEID: '',
        language: this.props.lang,
        OBJNAME: datapage.OBJNAME
      }
      if (CUSTODYCD != '') {
        await RestfulUtil.post('/balance/getfundbalance', obj)
          .then(resData => {
            //console.log('resData.DT rs', resData, this.state.CUSTODYCD)

            if (resData.EC === 0) {
              //console.log('resData.DT', resData.DT)
              that.setState({ data: resData.DT.data })
              //gan data
              for (let index = 0; index < this.state.data.length; index++) {
                arrTamLABEL.push(this.state.data[index].SYMBOL)
                arrTamDATA.push(this.state.data[index].BALQTTY)
              }
              this.setState({
                arrSYMBOL: arrTamLABEL,
                arrBALQTTY: arrTamDATA
              })
            }
          })
      }
      this.getChartData(this.state.arrSYMBOL, this.state.arrBALQTTY)

      this.setState({
        CUSTODYCD: e.value
      })

    } else {
      this.setState({
        CUSTODYCD: ''
      })
    }

  }
  search() {
    //console.log('this.state.chartData>>>', this.state.chartData)
    const element = <Doughnut data={this.state.chartData} />;
    ReactDOM.render(element, document.getElementById('root'));

  }
  render() {
    const chartLineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 0.6)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(153, 102, 255, 0.6)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(153, 102, 255, 0.6)',
          pointHoverBorderColor: 'rgba(153, 102, 255, 0.6)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [75, 9, 80, 14, 88, 1, 2]
        }
      ]
    };
    //mm/dd/yyyy
    return (
      <div>
        <div className="container panel panel-default request-change margintopNewUI" style={{ padding: "10px" }}>
          <div className="title-content">{this.props.strings.title}</div>
          <div>
            <DayPicker
              month={this.state.month}
              fromMonth={fromMonth}
              toMonth={toMonth}


              selectedDays={this.state.selectedDays}
              onDayClick={this.handleDayClick}
              captionElement={({ date, localeUtils }) => (
                <YearMonthForm
                  date={date}
                  localeUtils={localeUtils}
                  onChange={this.handleYearMonthChange}
                  lang={this.state.locale}
                  loadData={this.loadData}
                />
              )}
            />

            <div id="cntnr">
              <ul id="items">
                <li ><a id="holiday" style={{ color: 'red' }} onClick={this.holidayClick} >{this.props.strings.holiday}</a></li>
                <li ><a id="work" onClick={this.workClick} >{this.props.strings.workday}</a></li>
              </ul>
            </div>
          </div>
        </div>
        {/* this is chart */}
        {/* <div className="container panel panel-default request-change " style={{ padding: "10px" }}>
          <div className="title-content">CHART</div>
          <div>
            <div className="col-md-12" style={{ marginBottom: "20px", marginTop: '20px' }}>
              <h5>{this.props.strings.custodycd}</h5>
              <div className="col-xs-2">
                <Select.Async
                  name="form-field-name"
                  placeholder={this.props.strings.custodycd}
                  loadOptions={this.getOptions.bind(this)}
                  value={this.state.CUSTODYCD}
                  onChange={this.onChange.bind(this)}
                  id="CBcustodycdCCQ"
                />
              </div>
              <input onClick={this.search.bind(this)} type="button" defaultValue="Tìm kiếm" className="btn btn-primary" id="btnSearch" />
            </div>
            <div className="col-md-12">
              <div className="col-md-4" id="root">

              </div>
              <div className="col-md-8">
                <Line data={chartLineData} ></Line>
              </div>
            </div>

          </div>
        </div> */}
      </div>
    )
  }
}
Celendar.defaultProps = {

};
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('Celendar')
]);

module.exports = decorators(Celendar);
