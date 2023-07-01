import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import PhanBoTaiSanChart from './components/PhanBoTaiSanChart.js';
import StockChart from './components/StockChart.js'
import './TongQuanTaiSan.scss'
import TableQuyMo from './components/TableQuyMo.js';
import TableDMUyThac from './components/TableDMUyThac';
import 'app/utils/customize/CustomizeReactTable.scss';
import { DataStockChart } from 'app/utils/MockData';
class TongQuanTaiSan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStockChartIndex: 1,
            indexObject: [],
            dataStockChart: [],
            dataTableQuyMo: [],
        };
    }

    componentDidMount() {
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.add('ndt-customize-body');
        }
        this.setState({
            ...this.state,
            indexObject: [
                { key: 'SSI', value: 'SSI-SSA', index: 1 },
                { key: 'VNX50', value: 'SSI-VNX50', index: 2 },
                { key: 'ETF', value: 'SSI-ETF', index: 3 },
            ],
            dataStockChart: DataStockChart(1)
        })
    }

    componentWillUnmount() {
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.remove('ndt-customize-body');
        }
    }

    onClickNextChart = () => {
        let { currentStockChartIndex, indexObject } = this.state;
        if (currentStockChartIndex < indexObject.length) {
            currentStockChartIndex = currentStockChartIndex + 1;
        } else {
            currentStockChartIndex = 1;
        }

        this.setState({
            ...this.state,
            dataStockChart: DataStockChart(currentStockChartIndex, 'next'),
            currentStockChartIndex: currentStockChartIndex
        })
    }
    onClickPrevChart = () => {
        let { currentStockChartIndex, indexObject } = this.state;
        currentStockChartIndex = currentStockChartIndex - 1;

        if (currentStockChartIndex === 0) {
            currentStockChartIndex = indexObject.length;
        }

        this.setState({
            ...this.state,
            dataStockChart: DataStockChart(currentStockChartIndex, 'prev'),
            currentStockChartIndex: currentStockChartIndex
        })
    }

    setDataTableQuyMo = (data) => {
        this.setState({
            ...this.state,
            dataTableQuyMo: data
        })
    }
    render() {
        let { dataStockChart, currentStockChartIndex, indexObject, dataTableQuyMo } = this.state;
        return (
            <div className="overview-property-container">
                <div className="charts">
                    <div className="content-left-c">
                        <PhanBoTaiSanChart
                            dataTableQuyMo={dataTableQuyMo}
                        />
                    </div>
                    <div className="content-right-c">
                        <StockChart
                            dataChart={dataStockChart}
                            dataFund={indexObject[currentStockChartIndex - 1]}
                            onClickPrevChart={this.onClickPrevChart}
                            onClickNextChart={this.onClickNextChart}
                        />
                    </div>
                </div>
                <div className="quy-mo ">
                    <TableQuyMo
                        setDataTableQuyMo={this.setDataTableQuyMo}
                    />
                </div>
                <div className="dm-uy-thac">
                    <TableDMUyThac />
                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    lang: state.language.language,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('TongQuanTaiSan')
]);
module.exports = decorators(TongQuanTaiSan);