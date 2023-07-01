import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalConfirm } from 'actionDatLenh';
import { SRTYPE_NR, SRTYPE_NS, SRTYPE_SW, COLORSW, COLORNR, COLORNS } from '../../../../Helpers';
import './RulesModal.scss'
// import logo from '../../../../../assets/images/'


class RulesModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmCheckbox: false,
		};
	}

	onConfirmChange = (e) => {
		let check = e.target.checked;
		if (check) {
			this.setState({
				confirmCheckbox: true,
			})
		} else {
			this.setState({
				confirmCheckbox: false,
			})
		}
	}

	componentDidUpdate = (prevProps, prevState, snapshot) => {
		if (prevState.confirmCheckbox === true) {
			this.setState({
				confirmCheckbox: false,
			})
		}
	}

	render() {
		const { isOpen, onClose, isAllow, canRegis } = this.props
		let { confirmCheckbox } = this.state
		return (
			<Modal show={isOpen} onHide={onClose} bsSize="lg" className="rule-modal">
				<Modal.Header  >
					<div className="modalPopup-title">
						<div className="modalPopup-title-left">
							<img src="./images/logo_ssi_1.png" />
							<span>{this.props.strings.title}</span>
						</div>
						<div className="modalPopup-title-right">
							<button type="button" className="close" onClick={onClose}>
								<span aria-hidden="true">×</span>
								<span className="sr-only">Close</span>
							</button>
						</div>
					</div>
				</Modal.Header>
				<Modal.Body style={{ overflow: "auto", height: "100%" }}>
					<div className="modalPopup-content">
						<span className="ruleTitle">
							{this.props.strings.ruleTitle01}
						</span>
						<ul>
							<li>{this.props.strings.para01}</li>
							<li>{this.props.strings.para02}</li>
							<li>{this.props.strings.para03}</li>
							<li>{this.props.strings.para04}</li>
							<li>{this.props.strings.para05}</li>
							<li>{this.props.strings.para06}</li>
							<li>{this.props.strings.para07}</li>
							<li>{this.props.strings.para08}</li>
							<li>{this.props.strings.para09}</li>
						</ul>
						<span className="ruleTitle">
							{this.props.strings.ruleTitle02}
						</span>
						<ul>
							<li>{this.props.strings.para10}</li>
							<li>{this.props.strings.para11}</li>
							<li>{this.props.strings.para12}</li>
							<li>{this.props.strings.para13}</li>
							<li>{this.props.strings.para14}</li>
						</ul>
					</div>
				</Modal.Body>

				{/* <hr /> */}
				<Modal.Footer>
					<div className="modalPopup-footer">
						<div className="modalPopup-footer-left">
							<label className="container-checkmark">
								<input
									type="checkbox"
									name="checkbox"
									value={confirmCheckbox}
									onChange={this.onConfirmChange}
								/>
								<span className="checkmark"></span>
							</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span className="read-rules">{this.props.strings.confirm}</span> <br></br>
							{(canRegis === false) && <span className="importantThing"> {this.props.strings.plsConfirm} </span>}
						</div>
						<div className="modalPopup-footer-right">
							<button className="modalPopup-footer-button" onClick={() => isAllow(confirmCheckbox)}>
								{this.props.strings.registration}
							</button>
						</div>
					</div>
				</Modal.Footer>
			</Modal>
		)
	}
}

const stateToProps = state => ({
	language: state.language.language
});
const decorators = flow([
	connect(stateToProps),
	translate('RulesModal')
]);
module.exports = decorators(RulesModal);

