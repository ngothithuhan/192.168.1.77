import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import RestfulUtils from 'app/utils/RestfulUtils'
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import _ from 'lodash'
import ReactTable from "react-table";
import "react-table/react-table.css";
import NumberInput from 'app/utils/input/NumberInput';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalConfirm } from 'actionDatLenh';
import { getRowTextTable, getPageTextTable } from 'app/Helpers'
import { SRTYPE_NR, SRTYPE_NS, SRTYPE_SW, COLORSW, COLORNR, COLORNS, amt_width, qtty_width, symbol_width, date_width } from '../../../../Helpers';
import './ModalDetail.scss'
// import logo from '../../../../../assets/images/'


class ModalDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const { isOpen, onClose, detailCCQ, dataCCQ, detailColumn, idAccount, idCCQ } = this.props
		return (
			<Modal className="custom_modal" show={isOpen} onHide={onClose}>
				<div className="titleDetail">
					<div className="titleDetail_left">
						<div>
							<span>{this.props.strings.TKGD}</span>&nbsp;
								<span className="titleDetail--info">
								{idAccount}
							</span>
						</div>
						<div>
							<span>{this.props.strings.CCQId}</span>&nbsp;
								<span className="titleDetail--info">
								{idCCQ}
							</span>
						</div>
					</div>
					<div className="titleDetail_right" onClick={onClose}>
						<i className="fas fa-times" />
					</div>
				</div>
				<div className="tableDetail">
					<ReactTable
						className="modal-detail"
						data={dataCCQ}
						columns={detailColumn}
						defaultPageSize={1}
						filterable={true}
						showPagination={true}
						pageText={getPageTextTable(this.props.language)}
						rowsText={getRowTextTable(this.props.language)}
						previousText={<i className="fas fa-backward"></i>}
						nextText={<i className="fas fa-forward"></i>}
						loadingText="Loading..."
					/>
				</div>
			</Modal>
		)
	}
}

const stateToProps = state => ({
	language: state.language.language
});
const decorators = flow([
	connect(stateToProps),
	translate('ModalDetail')
]);
module.exports = decorators(ModalDetail);

