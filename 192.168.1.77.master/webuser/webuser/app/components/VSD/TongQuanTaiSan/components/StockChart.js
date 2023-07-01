import React, { Component } from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts/highstock';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

class StockChart extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        this.initStockChart(this.props.dataChart);

    }

    initStockChart = (data) => {
        this.chart = this.renderInitialChart(data);
        //resize chart to fix div-parent
        setTimeout(() => {
            let element = document.getElementById("StockChartDiv");
            if (this.chart && element) {
                this.chart.setSize(element.clientWidth, element.clientHeight);
            }
        }, 500)
    }



    componentWillUnmount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataChart && this.props.dataChart && prevProps.dataChart !== this.props.dataChart) {
            this.initStockChart(this.props.dataChart);
        }
    }


    renderInitialChart(dataChart) {
        if (!dataChart) return;

        const chartContainer = document.getElementById(`StockChartDiv`);

        const labelStyle = {
            color: '#D8D8D8',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 200,
            fontSize: '0.70rem'
        };

        let seriesOptions = dataChart;

        return Highcharts.stockChart(chartContainer, {
            chart: {
                backgroundColor: '#fff',
            },
            //hide credit
            credits: false,
            legend: false,

            //hide range
            rangeSelector: {
                selected: 4,
                enabled: false
            },

            //hide navigator, scrollbar
            navigator: { enabled: false },
            scrollbar: { enabled: false },


            yAxis: {
                // opposite: false, //move from right to left
                // labels: {
                //     formatter: function () {
                //         return (this.value > 0 ? ' + ' : '') + this.value + '%';
                //     }
                // },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'value',
                    showInNavigator: true
                }
            },

            // tooltip: {
            //     pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            //     valueDecimals: 2,
            //     split: true
            // },

            series: seriesOptions
        });

    }


    render() {
        let { dataFund, onClickPrevChart, onClickNextChart } = this.props;
        return (
            <div className="stock-chart-container">
                <div className="stock-chart-header">
                    <div className="title-chart" >{dataFund && dataFund.value ? dataFund.value : '-'}</div>

                </div>

                <div className="stock-chart-content" >
                    <i onClick={onClickPrevChart} className="prev-chart fa fa-chevron-left" aria-hidden="true"></i>

                    <div id={`StockChartDiv`} style={{ height: '100%', width: '100%' }}>

                    </div>
                    <i onClick={onClickNextChart} className="next-chart fa fa-chevron-right" aria-hidden="true"></i>

                </div>


                <div className="stock-chart-footer">
                    <div className="stock-chart-footer-first">
                        <div className="footer-chart-color one"></div>
                        <div>SSI</div>
                    </div>
                    <div className="stock-chart-footer-second">
                        <div className="footer-chart-color two"></div>
                        <div>ABC</div>
                    </div>
                </div>
            </div>


        );
    }
};

const stateToProps = state => ({
    lang: state.language.language,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('StockChart')
]);
module.exports = decorators(StockChart);
