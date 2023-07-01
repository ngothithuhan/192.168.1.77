import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';

class PopupNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagesize: 10,
      pages: 1,
    }
  }



  render() {
    let dataNotifi = this.props.dataNotifi ? this.props.dataNotifi : []
    let { pagesize, pages } = this.state

    let { showPopupNotifi, checkboxNotifi, refreshDataNoti } = this.props;
    const columns =
      [
        {
          Header: props => <div className="">STT</div>,
          id: "STT",
          accessor: "STT",
          Cell: ({ value }) => (
            <span style={{ float: 'right', paddingRight: '10px' }}><b>{value}</b></span>
          ),
          width: 60
        },
        {
          Header: props => <div className="">Nội dung</div>,
          id: "DES",
          accessor: "DES",
          Cell: ({ value }) => (
            <span style={{ float: 'left', paddingLeft: '8px' }}><b>{value}</b></span>
          ),
        },
      ]

    return (

      <Modal
        show={showPopupNotifi}
        onHide={() => this.props.closePopupNotifi(false)}
        bsSize="large"
        className="modal-popup-notification"
      >
        <Modal.Header closeButton>
          <Modal.Title><div className="title-content">Cảnh báo nhắc việc</div></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 ">
              <ReactTable
                columns={columns}
                getTheadTrProps={() => {
                  return {
                    className: 'head'
                  }
                }}
                // pages={pages}
                pageText="Trang"
                rowsText="dòng"
                ofText="/"
                className="-striped -highlight heightNotifi"
                data={dataNotifi}
                defaultPageSize={dataNotifi.length}
                loadingText="Đang tải..."
                pageText='Trang'
                nextText='Tiếp'
                previousText='Trước'
                rowsText='bản ghi'
                showPagination={false}
              />
            </div>
            <div className="col-md-12 checkbox-noti">
              <input type="checkbox" id="checkboxNotifi" />
              <label htmlFor="checkboxNotifi">Hiển thị màn hình thông báo nhắc việc mỗi khi login</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={refreshDataNoti}>Làm mới</button>
          <button className="btn btn-default" onClick={() => this.props.closePopupNotifi(false)}>Thoát</button>
        </Modal.Footer>
      </Modal>
    );
  }
}


const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth
});

const decorators = flow([
  connect(stateToProps),
  translate('CreateAccount')
]);

module.exports = decorators(PopupNotification);