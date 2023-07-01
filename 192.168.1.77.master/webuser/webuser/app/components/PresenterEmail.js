import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { Link, Switch } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { changeLanguage } from 'app/action/actionLanguage.js';
import { getLanguageKey, saveLanguageKey, LANGUAGE_KEY } from '../Helpers';
import RestfulUtils from 'app/utils/RestfulUtils';
//import DateInput from 'app/utils/input/DateInput';
import GeneralInfo from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/GeneralInfo'
import ModalOTPConfirm from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/ModalOTPConfirm'
import './PresenterEmail.scss';
class PresenterEmail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			answer : 'N'
		}
	}

	onAnswerChange = (e) => {
		this.setState({
			answer: e.target.value
		})
	}

	render() {
		let {answer} = this.state
		return (
			<div className="presenter-Container Presenter">
				<div className="modal-Presenter">
					<div className="modal-title">
						<span>Đăng ký mở tài khoản giao dịch chứng chỉ quỹ mở</span>
					</div>
					<div className="modal-question">
						<span>Có người giới thiệu không?</span>
						<div onChange={this.onAnswerChange} className="thereAns">
							<input className="awn1" type="radio" value='Y' name="answer" /> Có
							<input className="awn2" type="radio" value='N' name="answer" defaultChecked /> Không
						</div>

					</div>
					<div className="modal-button">
						<Link to="/CREATEACCOUNT">
							<button className="foward">Tiếp tục</button>
						</Link>
						<Link to="/login">
							<button className="turnBack">Quay lại</button>
						</Link>

					</div>
				</div>
			</div>
		)
	}
}

const stateToProps = state => ({
	language: state.language.language
});


const decorators = flow([
	connect(stateToProps),
	translate('PresenterEmail')
]);

module.exports = decorators(PresenterEmail);
