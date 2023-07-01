import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';

class CreateListPhanQuyen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true,
            curposition: 0,
            parentpostion: 0,
            level:null,
            parentIDlevel:0,
            tree: [
                {
                    title: "Lệnh giao dịch", childNodes: [
                        { title: "Quản lý tài khoản nhà đầu tư", id: "acc", vl: [true, false, false, true, false] },

                    ]
                },
                {
                    title: "Tài khoản giao dịch", childNodes: [
                        { title: "Màn hình lệnh giao dịch", id: "lgd", vl: [false, false, false, false, false] }
                    ]
                },
                {
                    title: "Chứng chỉ quỹ", childNodes: [
                        { title: "Nhận chuyển khoản từ NH", id: 'ck', vl: [false, false, false, false, false] }
                    ]
                },
                {
                    title: "Báo cáo", childNodes: [
                        { title: "Thiết lập việc làm việc", id: "llv", vl: [false, false, false, false, false] },

                    ]
                },
                {
                    title: "Môi giới", childNodes: [
                        { title: "Quản lý ĐLPP", id: "dlpp", vl: [false, false, false, false, false] },

                    ]
                },
                {
                    title: "Quản trị hệ thống", childNodes: [
                        { title: "Quản lý ĐLPP", id: "dlpp", vl: [false, false, false, false, false] },

                    ]
                },

            ],
            datagroup: {
                p_grpid: '',
                p_right_list: '',
                pv_language: this.props.lang
            },
            nodeclick: '',
            access: ''

        };
    }
    onClick(title, id, index, level) {


        var parentID = window.$('#' + id).parents().eq(level).attr('id');
        var parentIDlevel = window.$('#' + id).parents().eq(1).attr('id');
       
        this.setState({
            curposition: index,
            parentpostion: parentID,
            title: title,
            nodeclick: id,
            level: level == 3 ? level : null,
            parentIDlevel:parentIDlevel
        })

        //console.log(this.state.tree.childNodes[this.state.parentpostion].childNodes[this.state.curposition].vl[0])



        window.$("#phanquyen").css("display", "block");

    }

    componentDidMount() {
        window.$("#loadingscreen").show()
        var handle = setInterval(function () {
        window.$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
        window.$('.tree li.parent_li > span').on('click', function (e) {
          var children = window.$(this).parent('li.parent_li').find(' > ul > li');
          if (children.is(":visible")) {
            children.hide('fast');
    
            window.$(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-plus-circle').removeClass('fa-minus-circle');
    
          } else {
            children.show('fast');
            window.$(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-minus-circle').removeClass('fa-plus-circle');
          }
          e.stopPropagation();
       
           
        });
        clearInterval(handle)
        window.$("#loadingscreen").hide()
        //window.$('#divTree').parents().eq(6).find(' > div.modal-backdrop').css('z-index', '1056')
        // window.$('#divTree').parents().eq(5).css('z-index', '1057')
    },2000)
 
    }


    CreateTree(x) {
        
        return (
            x.map(function (node, index) {

                if (node.childNodes != null && node.childNodes != undefined) {

                    if (node.childNodes.length > 0) {
                        return (
                            <li id={index} key={index} style={{ display: 'none' }}>
                                <span id={"parent" + index}><i className="fas fa-plus-circle"></i> {node.title}</span>
                                <ul>
                                    {this.CreateTree(node.childNodes)}
                                </ul>
                            </li>
                        )
                    }

                    else {

                        var i = node.vl.filter(nodes => nodes == true)

                        return (

                            <li id={node.id} key={index} style={{ display: 'none' }}>
                                <span id={node.id} onClick={this.onClick.bind(this, node.title, node.id, index, 1)} className="last-child"><i className={i.length <= 0 ? "fas fa-globe" : "fas fa-edit"}></i> {node.title}</span>
                            </li>

                        )
                    }
                } else {

                    var i = node.vl.filter(nodes => nodes == true)

                    return (

                        <li id={node.id} key={index} style={{ display: 'none' }}>
                            <span id={node.id} onClick={this.onClick.bind(this, node.title, node.id, index, 3)} className="last-child"><i className={i.length <= 0 ? "fas fa-globe" : "fas fa-edit"}></i> {node.title}</span>
                        </li>

                    )
                }
            }.bind(this))

        )


    }
    build(str) {
        let list = ''

        for (let index = 0; index < str.length; index++) {
            if (str[index] == false)
                list += 'N~#~'
            else list += 'Y~#~'
        }
        let finallist = this.state.nodeclick + '~#~' + list.slice(0, list.length - 3) + '~$~'
        return finallist

    }
    handleChange(number, event) {
        let str =[]
        if(this.state.level==null){
        var value = this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl[number]
        this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl[number] = !value
         str = this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl
        }else{
            var value = this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl[number]
            this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl[number] = !value
             str = this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl
        }
        let list = this.build(str)
        let p_right_list = this.state.datagroup["p_right_list"]
        let nodeclick = this.state.nodeclick

        if (p_right_list.indexOf(nodeclick) < 0) {
            this.state.datagroup["p_right_list"] += list
        } else {
            var str1 = p_right_list.substr(p_right_list.indexOf(nodeclick), 26)
            this.state.datagroup["p_right_list"] = p_right_list.replace(str1, list.slice(0, list.length - 3))
        }
        this.setState({
            datagroup: this.state.datagroup,
            tree: this.state.tree
        });
    }
    submit() {

        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        let data = {
            data: this.state.datagroup,
            pv_language: this.props.lang,
            pv_objname: this.props.OBJNAME
        }
        // this.props.getPhanQuyen(data, this.state.tree)

        RestfulUtils.posttrans('/fund/assign_rights_group', data)
            .then((res) => {

                if (res.EC == 0) {
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }

            })

    }
    /*
    loadDATA() {
        let data = {
            p_grpid: this.props.groupid,
            p_language: this.props.lang
        }
        this.state.datagroup["p_grpid"] = this.props.groupid
        let that = this
        io.socket.post('/fund/getlistfocmdmenu_rights', { data }, function (resData, jwRes) {
            let par = ""
            let partitle = ""
            let datacon = {}
            let childNodes = []
            let childNodescon = []
            let str = ""
            let i = 0
            console.log(resData.DT.data)
            resData.DT.data.map(function (node, index) {
                if (node.PRID == null) {
            
                    if (node.CMDID == '000000') {

                        par = node.CMDID
                        partitle = node.CMDNAME
                        // dataPQ.title=node.CMDNAME
                        //i += 1
                    } else {

                      
                        childNodes.push({ title: partitle, childNodes: childNodescon })
                        childNodescon = []

                        par = node.CMDID
                        partitle = node.CMDNAME
                    }
                } else {
                
                    if (node.PRID == par) {
                    
                        let add = node.ISADD == 'N' ? false : true
                        let edit = node.ISEDIT == 'N' ? false : true
                        let del = node.ISDELETE == 'N' ? false : true
                        let approve = node.ISAPPROVE == 'N' ? false : true
                        let reject = node.ISINQUIRY == 'N' ? false : true
                        // dataPQ.childNodes=[datacon]
                        if (add == true || edit == true || del == true || approve == true || reject == true) {
                            str += node.CMDID + "~#~" + node.ISADD + "~#~" + node.ISEDIT + "~#~" + node.ISDELETE + "~#~" + node.ISAPPROVE + "~#~" + node.ISINQUIRY + '~$~'
                        }
                        childNodescon.push({ title: node.CMDNAME, id: node.CMDID, vl: [add, edit, del, approve, reject] })
                    }else{
                        par = '000000'
                        partitle = 'Lệnh giao dịch'
                        let add = node.ISADD == 'N' ? false : true
                        let edit = node.ISEDIT == 'N' ? false : true
                        let del = node.ISDELETE == 'N' ? false : true
                        let approve = node.ISAPPROVE == 'N' ? false : true
                        let reject = node.ISINQUIRY == 'N' ? false : true
                        // dataPQ.childNodes=[datacon]
                        if (add == true || edit == true || del == true || approve == true || reject == true) {
                            str += node.CMDID + "~#~" + node.ISADD + "~#~" + node.ISEDIT + "~#~" + node.ISDELETE + "~#~" + node.ISAPPROVE + "~#~" + node.ISINQUIRY + '~$~'
                        }
                        childNodescon.push({ title: node.CMDNAME, id: node.CMDID, vl: [add, edit, del, approve, reject] })
                    }
                }
                if(index==resData.DT.data.length-1)    childNodes.push({ title: partitle, childNodes: childNodescon })
            })
          
            console.log(childNodes)
            that.state.datagroup["p_right_list"] = str
            that.setState({
                tree: childNodes,
                datagroup: that.state.datagroup,
                access: that.props.access
            })
        })
    }
    */
    async  loadDATA() {
        // console.log(this.props)
        //if (this.props.dataphanquyen == '') {
        let data = {
            p_grpid: this.props.groupid,
            p_language: this.props.lang,
            OBJNAME: this.props.OBJNAME
        }
        this.state.datagroup["p_grpid"] = this.props.groupid
        let that = this
        await RestfulUtils.post('/fund/getlistfocmdmenu_rights', { data }).then((resData) => {
           
            let childNodes = []
            let str = ""
            let indexPar = 0
            let indexChild = 0
            resData.DT.data.map(function (node, index) {
                if (node.LEV === '1') {
                    childNodes.push({ title: node.CMDNAME, childNodes: [] })

                    indexPar++;
                    indexChild = 0;
                }
                else if (node.LEV === '2') {
                    indexChild++;
                    if (node.CMDNAME != '---') {
                        let add = node.ISADD == 'N' ? false : true
                        let edit = node.ISEDIT == 'N' ? false : true
                        let del = node.ISDELETE == 'N' ? false : true
                        let approve = node.ISAPPROVE == 'N' ? false : true
                        let reject = node.ISINQUIRY == 'N' ? false : true
                        if (add == true || edit == true || del == true || approve == true || reject == true) {
                            str += node.CMDID + "~#~" + node.ISINQUIRY + '~#~' + node.ISADD + "~#~" + node.ISEDIT + "~#~" + node.ISDELETE + "~#~" + node.ISAPPROVE + "~$~"
                        }

                        childNodes[indexPar - 1].childNodes.push({ title: node.CMDNAME, id: node.CMDID, vl: [reject, add, edit, del, approve], childNodes: [] })
                    }
                }
                else if (node.LEV === '3') {
                    if (node.CMDNAME != '---') {
                        let add = node.ISADD == 'N' ? false : true
                        let edit = node.ISEDIT == 'N' ? false : true
                        let del = node.ISDELETE == 'N' ? false : true
                        let approve = node.ISAPPROVE == 'N' ? false : true
                        let reject = node.ISINQUIRY == 'N' ? false : true
                        if (add == true || edit == true || del == true || approve == true || reject == true) {
                            str += node.CMDID + "~#~" + node.ISINQUIRY + '~#~' + node.ISADD + "~#~" + node.ISEDIT + "~#~" + node.ISDELETE + "~#~" + node.ISAPPROVE + "~$~"
                        }
                        //childNodes[indexPar-1].childNodes[indexChild-1].childNodes=[]
                        childNodes[indexPar - 1].childNodes[indexChild - 1].childNodes.push({ title: node.CMDNAME, id: node.CMDID, vl: [reject, add, edit, del, approve] })
                    }
                }
            })
           // console.log('du lieu dau ra', childNodes)
            // let par = ""
            // let partitle = ""
            // let datacon = {}
            // let childNodes = []
            // let childNodescon = []
            // let str = ""
            // let i = 0
            // resData.DT.data.map(function (node, index) {
            //     if (index == 0) par = node.CMDID
            //     if (node.PRID == null) {

            //         if (par != node.CMDID) {
            //             childNodes.push({ title: partitle, childNodes: childNodescon })
            //             childNodescon = []
            //         }
            //         par = node.CMDID
            //         partitle = node.CMDNAME

            //     } else {
            //         if (node.PRID == par) {
            //             if (node.CMDNAME != '---') {
            //                 let add = node.ISADD == 'N' ? false : true
            //                 let edit = node.ISEDIT == 'N' ? false : true
            //                 let del = node.ISDELETE == 'N' ? false : true
            //                 let approve = node.ISAPPROVE == 'N' ? false : true
            //                 let reject = node.ISINQUIRY == 'N' ? false : true
            //                 if (add == true || edit == true || del == true || approve == true || reject == true) {
            //                     str += node.CMDID + "~#~" + node.ISINQUIRY + '~#~' + node.ISADD + "~#~" + node.ISEDIT + "~#~" + node.ISDELETE + "~#~" + node.ISAPPROVE + "~$~"
            //                 }
            //                 childNodescon.push({ title: node.CMDNAME, id: node.CMDID, vl: [reject, add, edit, del, approve] })
            //             }
            //         }
            //     }
            //     if (index == resData.DT.data.length - 1) childNodes.push({ title: partitle, childNodes: childNodescon })
            // })


            that.state.datagroup["p_right_list"] = str
            that.setState({
                tree: childNodes,
                datagroup: that.state.datagroup,
                access: that.props.access
            })
        })

        // } 
        /*
       else {
           this.state.datagroup["p_right_list"] = this.props.dataphanquyenSTR
           this.setState({
               tree: this.props.dataphanquyen,
               datagroup: this.state.datagroup,
               access: this.props.access
           })
       }
       */
    }
    componentWillMount() {

        this.loadDATA()
    }
    render() {
        let displayreport = this.state.parentpostion == 4 ? "none" : "block"
        let displayy = this.state.access == 'view' ? true : false
      
        if (this.state.level == null) {
           
            var isView = this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl[0];
            var isAdd = this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl[1];
            var isEdit = this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl[2];
            var isDelete = this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl[3];
            var isApprove = this.state.tree[this.state.parentpostion].childNodes[this.state.curposition].vl[4];
        } else {

            var isView = this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl[0];
            var isAdd = this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl[1]
            var isEdit = this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl[2]
            var isDelete = this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl[3]
            var isApprove = this.state.tree[this.state.parentpostion].childNodes[this.state.parentIDlevel].childNodes[this.state.curposition].vl[4]
        }
        return (
            <div className="col-xs-12">

                <div className="col-xs-7">

                    <div className="tree " id="divTree">
                        <ul>
                            <li>
                                <span><i id='Parent' className='fas fa-plus-circle'></i> {this.props.strings.title}</span>
                                <ul>
                                    {this.CreateTree(this.state.tree)}
                                </ul>
                            </li>
                        </ul>
                    </div>

                </div>


                <div className={this.state.access == 'view' ? "col-xs-5 disable" : "col-xs-5 "} id="phanquyen" style={{ display: "none" }}>
                    <div className="panel panel-default">
                        <div className="panel-heading">{this.state.title}</div>
                        <div className="panel-body" style={{ minHeight: 208 }}>
                            <div className="col-md-12">
                                <div className="col-md-1">
                                    <h5 ><input type="checkbox" checked={isView} onChange={this.handleChange.bind(this, "0")} /></h5>
                                </div>
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.view}</b></h5>
                                </div>
                            </div>
                            <div style={{ display: displayreport }}>
                                <div className="col-md-12">
                                    <div className="col-md-1">
                                        <h5 ><input checked={isAdd} type="checkbox" onChange={this.handleChange.bind(this, "1")} /></h5>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.add}</b></h5>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-1">
                                        <h5 ><input type="checkbox" checked={isEdit} onChange={this.handleChange.bind(this, "2")} /></h5>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.edit}</b></h5>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-1">
                                        <h5 ><input type="checkbox" checked={isDelete} onChange={this.handleChange.bind(this, "3")} /></h5>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.delete}</b></h5>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-1">
                                        <h5 ><input type="checkbox" checked={isApprove} onChange={this.handleChange.bind(this, "4")} /></h5>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.approve}</b></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel-footer" style={{ float: "right" }}>
                            <input id="sunmitPQ" disabled={displayy} type="button" className="btn btn-primary" style={{ marginRight: -20, marginTop: 10 }} value={this.props.strings.submit} onClick={this.submit.bind(this)} />

                        </div>
                    </div>
                </div>

            </div>

        )
    }
}
CreateListPhanQuyen.defaultProps = {

    strings: {
        create: 'Thêm',
        edit: 'Sửa',
        delete: 'Hủy',
        approve: 'Duyệt',
        delay: 'Từ chối'

    },
}
const stateToProps = state => ({
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('CreateListPhanQuyen')
]);

module.exports = decorators(CreateListPhanQuyen);
