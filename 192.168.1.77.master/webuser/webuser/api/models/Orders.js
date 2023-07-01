/**
 * Orders.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: { 
    PRIKEY: { type: "string", primaryKey: true },
    TELLERID:{type:"string"},
   ORDERID: { type: "string" },
   TXDATE: { type: "string" }, 
   TXNUM: { type: "string" },
   QTTY: { type: "string" }, 
   AMOUNT: { type: "string" }, 
   TRADINGDATE: { type: "string" }, 
   CUSTODYCD: { type: "string" }, 
   AFACCTNO: { type: "string" }, 
   SID: { type: "string" }, 
   CODEID: { type: "string" }, 
   SEACCTNO: { type: "string" }, 
   SYMBOL: { type: "string" }, 
   REFORDERID: { type: "string" }, 
   EXECTYPE: { type: "string" }, 
   EXECTYPE_DESC: { type: "string" }, 
   SRTYPE: { type: "string" }, 
   SRTYPE_DESC: { type: "string" }, 
   SIPID: { type: "string" }, 
   PAID: { type: "string" }, 
   SWID: { type: "string" }, 
   SEDTLID: { type: "string" }, 
   ORDERAMT: { type: "string" }, 
   ORDERQTTY: { type: "string" }, 
   REMAINQTTY: { type: "string" }, 
   CANCELQTTY: { type: "string" }, 
   ADJUSTQTTY: { type: "string" }, 
   MATCHAMT: { type: "string" }, 
   MATCHQTTY: { type: "string" }, 
   CANCELAMT: { type: "string" }, 
   ADJUSTAMT: { type: "string" }, 
   FEEAMT: { type: "string" }, 
   SESSIONNO: { type: "string" }, 
   STATUS: { type: "string" }, 
   STATUS_DES: { type: "string" }, 
   USERNAME: { type: "string" }, 
   TLID: { type: "string" }, 
   FEEID: { type: "string" }, 
   VERFEE: { type: "string" }, 
   VERMATCHING: { type: "string" }, 
   PORDERID: { type: "string" }, 
   LASTCHANGE: { type: "string" }, 
   SPCODE: { type: "string" }, 
   SWCODEID: { type: "string" },
   SWID: { type: "string" },
   SWSYMBOL: { type: "string" } , 
   ORDERVALUE: { type: "string" }  ,
   ISOTP_CONFIRM:{type: "string"}
  },
  newInstance: function (obj) {
    let that = {}
    // for(var property in obj) { 
    // console.log("...obj", obj[property])  
    // } 
    for (var property in this.attributes) {

      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    return that;
  },
  //  newsIntance: function (obj) { var that = {}; that.ORDERID = obj.ORDERID; that.TXDATE = obj.TXDATE; that.TXNUM = obj.TXNUM; that.TRADINGDATE = obj.TRADINGDATE; that.CUSTODYCD = obj.CUSTODYCD; that.AFACCTNO = obj.AFACCTNO; that.SID = obj.SID; that.CODEID = obj.CODEID; that.SEACCTNO = obj.SEACCTNO; that.SYMBOL = obj.SYMBOL; that.REFORDERID = obj.REFORDERID; that.EXECTYPE = obj.EXECTYPE; that.EXECTYPE_DESC = obj.EXECTYPE_DESC; that.SRTYPE = obj.SRTYPE; that.SRTYPE_DESC = obj.SRTYPE_DESC; that.SIPID = obj.SIPID; that.PAID = obj.PAID; that.SWID = obj.SWID; that.SEDTLID = obj.SEDTLID; that.ORDERAMT = obj.ORDERAMT; that.ORDERQTTY = obj.ORDERQTTY; that.REMAINQTTY = obj.REMAINQTTY; that.CANCELQTTY = obj.CANCELQTTY; that.ADJUSTQTTY = obj.ADJUSTQTTY; that.MATCHAMT = obj.MATCHAMT; that.MATCHQTTY = obj.MATCHQTTY; that.CANCELAMT = obj.CANCELAMT; that.ADJUSTAMT = obj.ADJUSTAMT; that.FEEAMT = obj.FEEAMT; that.SESSIONNO = obj.SESSIONNO; that.STATUS = obj.STATUS; that.STATUS_DES = obj.STATUS_DES; that.USERNAME = obj.USERNAME; that.TLID = obj.TLID; that.FEEID = obj.FEEID; that.VERFEE = obj.VERFEE; that.VERMATCHING = obj.VERMATCHING; that.PORDERID = obj.PORDERID; that.LASTCHANGE = obj.LASTCHANGE; that.SPCODE = obj.SPCODE;  that.QTTY = obj.QTTY;
  // that.AMOUNT = obj.AMOUNT; that.WID = obj.WID; return that; },
};

