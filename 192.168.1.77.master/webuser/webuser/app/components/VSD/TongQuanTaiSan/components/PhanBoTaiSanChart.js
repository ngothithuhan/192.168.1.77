import React, { Component } from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { getRandomColor } from 'app/utils/Utils';
import { property } from 'lodash';
var _ = require('lodash');
class PhanBoTaiSanChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataFromParent: [],
            dataChart: [],
        };
    }

    componentDidMount() {
        this.chart = this.renderInitialChart();
        //resize chart to fix div-parent
        setTimeout(() => {
            let element = document.getElementById("phanBoTaiSanDivChart");
            if (this.chart && element) {
                this.chart.setSize(element.clientWidth, element.clientHeight);
            }
        }, 500)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataTableQuyMo && this.props.dataTableQuyMo && prevProps.dataTableQuyMo !== this.props.dataTableQuyMo) {
            let data = this.processDataChart(this.props.dataTableQuyMo);
            this.chart = this.renderInitialChart(data);
        }
    }

    sumArray = (arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum += item.CURRAMT ? Number(item.CURRAMT) : 0;
        })
        return sum;
    }

    processDataChart = (dataTableQuyMo) => {
        let data = [];

        dataTableQuyMo.map((item, index) => {
            for (let property in item) {
                if (property === 'CURRAMT') {
                    item[property] = Number(item[property])
                }
            }
        })

        const ans = _(dataTableQuyMo)
            .groupBy('SYMBOL')
            .map((platform, id) => ({
                SYMBOL: id,
                CURRAMT: _.sumBy(platform, 'CURRAMT'),
            }))
            .value()

        if (ans && ans.length > 0) {
            let sum = this.sumArray(ans);
            ans.map((item, index) => {
                let color = getRandomColor(index);
                let totalNav = item.CURRAMT ? item.CURRAMT : 0;
                //fake data
                // let totalNav = item.SYMBOL !== 'SSIBF' ? (index + 2) * 10000000000 : item.CURRAMT;
                let percentNav = (Number(totalNav) / sum) * 100;
                data.push({
                    name: item.SYMBOL ? item.SYMBOL : '',
                    color: color,
                    y: percentNav,
                })
            })
        }
        this.setState({
            ...this.state,
            dataChart: data
        })

        return data;
    }


    renderInitialChart(dataChart) {
        if (!dataChart || (dataChart && dataChart.length === 0)) return;
        const chartContainer = document.getElementById(`phanBoTaiSanDivChart`);

        const labelStyle = {
            color: '#D8D8D8',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 200,
            fontSize: '0.70rem'
        };
        const tooltipStyle = {
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 200,
        }


        return Highcharts.chart(chartContainer, {
            chart: {
                backgroundColor: '#fff',
                renderTo: chartContainer,
                type: 'pie'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        }
                    },
                    center: ['50%', '50%'],
                    size: '100%',
                    borderWidth: 0,
                    selected: false,
                    showInLegend: true
                }
            },
            credits: false,
            legend: false,
            title: {
                text: '',
                labels: {
                    style: labelStyle,
                },
            },

            exporting: { enabled: false },
            series: [
                { data: dataChart }
            ],
            tooltip: {
                shared: true,
                snap: false,
                // padding: 5,
                // paddingBottom: 3,
                crosshairs: true,
                formatter: function () {

                    if (this.point) {
                        window.hoveringPoint = this;
                        return `
                                  <span style="color:${this.point.color};">
                                  ${this.point.name} : ${parseFloat(this.point.percentage).toFixed(2)}%
                                  </span>
                                    `;
                    }
                },
                style: tooltipStyle,
                // backgroundColor: 'grey'
            },
        });
    }


    render() {
        let { dataChart } = this.state;
        return (
            <div className="phan-bo-chart-container">
                <div className="title-chart" >{this.props.strings.chartHeader}</div>
                <div className="content-chart" >

                    <div className="tqts-text">
                        {dataChart && dataChart.length > 0 &&
                            dataChart.map((item, index) => {
                                return (
                                    <div className="text-child" key={index}>
                                        {/* Màu hiển thị */}
                                        <div className="color-div" style={{ backgroundColor: item.color }}></div>
                                        {/* Tên mã quỹ */}
                                        <div className="fund-name" >{item.name ? item.name : '-'}</div>
                                        {/* Số phần trăm */}
                                        <div className="fund-percent">{item.y ? `${parseFloat(item.y).toFixed(2)}%` : '-'}</div>
                                    </div>
                                )
                            })

                        }
                    </div>
                    <div className="holderChartDiv" style={{ width: '60%', height: '100%' }} id={`phanBoTaiSanDivChart`}>
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
    translate('PhanBoTaiSanChart')
]);
module.exports = decorators(PhanBoTaiSanChart);
