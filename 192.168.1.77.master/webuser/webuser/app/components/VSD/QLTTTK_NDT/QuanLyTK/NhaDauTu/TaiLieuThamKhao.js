import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

class TaiLieuThamKhao extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }



    render() {

        return (
            <div className="tltk-container">
                <div className="tltk-header">
                    {this.props.strings.TLTK}
                </div>
                <div className='tltk-content'>
                    {[...Array(10)].map((value, index) => {
                        return (
                            <div className="tltk-child" key={index}>
                                <div className="tltk-content-left">
                                    <i class="fa fa-file-word-o" aria-hidden="true"></i>
                                </div>
                                <div className="tltk-content-center">
                                    <div className="name">Tài liệu tham khảo {index + 1}</div>
                                    <div className="size">Kích thước: 100 MB</div>
                                </div>
                                <div className="tltk-content-right">
                                    <i class="fa fa-download" aria-hidden="true"></i>
                                </div>
                            </div>
                        )
                    })}

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
    translate('NhaDauTu')
]);
module.exports = decorators(TaiLieuThamKhao);