import React, { Component } from 'react';
import {  Pie, Doughnut } from 'react-chartjs-2';

class Chart extends Component {
    constructor(props) {
        
        super(props);
       
        this.state = {
            //chartData: props.chartData
            data : {} ,
        }
    }

    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'right',
        location: 'City'
    }
    
    
    componentWillMount(){
        console.log('this is in chart.js: arrSYMBOL', this.props.arrSYMBOL )
        this.state.data = {
            labels: this.props.arrSYMBOL,
            datasets: [{
                data: this.props.arrBALQTTY,
                backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ],
                hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ]
            }]
        };
    }
    render() {
        this.state.data = {
            labels: this.props.arrSYMBOL,
            datasets: [{
                data: this.props.arrBALQTTY,
                backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ],
                hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ]
            }]
        };
        console.log('o day la chart ', this.state.data)
        return (
            <div className="chart">
              
                <Doughnut

                    data={this.state.data}
                    options={{
                        title: {
                            display: this.props.displayTitle,
                            text: 'Biểu đồ ' + this.props.location,
                            fontSize: 15
                        },
                        legend: {
                            display: this.props.displayLegend,
                            position: this.props.legendPosition
                        }
                    }}
                />
            </div>
        )
    }
}

export default Chart;