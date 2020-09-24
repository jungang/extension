var g;
var diag;
var menukey="workbench";
var loginUserGroups;
var userInfo = top.hollyDataUtil.hollyData.loginUser.userInfo;
var isSjORsy;
$(function(){
    var OnMessage = function (e) {
        if("ts_personal_workbench"==e.data){
            datagrid.search();
        }
    }
    if (window.parent.parent.addEventListener) {  // all browsers except IE before version 9
        window.parent.parent.addEventListener("message", OnMessage, false);
    } else {
        if (window.parent.parent.attachEvent) {   // IE before version 9
            window.parent.parent.attachEvent("onmessage", OnMessage);
        }
    }
    initComplete();
    hollyPage.parsDictCombobox();
    g = hollyPage.parseDatagrid("maingrid",menukey,{
        columns: [
            { display: '标识',name: 'cdYjTotalNum',align: 'left', width: "150",
                render: function(rowdata, rowindex, value, column){
                    // if(value>0){
                    //     return '<font color="#daa520" size="+1">⚡</font>'+value;
                    // }
                    var html =""
                    if(rowdata.yjTotalNum>0){
                        html+="<div class='renderaddicon' title='中途意见' onclick='datagrid.showView("+ rowindex + ")'><span class='renderaddnum'>"+rowdata.yjTotalNum+"</span></div>"
                    }
                    if(rowdata.cdYjTotalNum>0){
                        html+="<div class='renderremindericon' title='催单' onclick='datagrid.showUrge("+ rowindex + ")'><span class='renderremindernum'>"+rowdata.cdYjTotalNum+"</span></div>"
                    }
                    if(rowdata.khPhoneLevel=="1"){
                        html+="<div class='five_stars' title='五星用户' ></div>";
                    }
                    return html;
                }
            },{
                display: '剩余时间', name: 'remainTime', align: 'left', width: "15%",
                render: function (rowdata, rowindex, value, column) {
                    var ret;
                    var dealTaskId = rowdata.dealTaskId;//工单流水
                    ret = "<span id='span_"+dealTaskId+"'>计算中...<span>"
                    return ret;
                }
            },
            { display: '工单标识', showTitle:true,name: 'sheetFlag',  align: 'left', width: "10%"},
            { display: '子工单号', showTitle:true,name: 'dealTaskId', align: 'left',hide:true},
            { display: '主单ID', showTitle:true,name: 'sheetId', align: 'left',hide:true},
            { display: '紧急性', showTitle:true,name: 'codeUrgentLevel', type:'dict_DICT_URGENT_LEVEL', align: 'left', width: "8%"},
            { display: '工单流水号',name: 'sheetCode', align: 'left', width: "18%",render: function (rowdata, rowindex, value, column){
                    var servContent= rowdata.servContent.toString();
                    servContent = servContent.replace(/\"/g, "");
                    servContent = servContent.replace(/\'/g,"");
                    var html = "<a href='javascript:void(0)' title='"+servContent+"' style=\"color: #2DA9FA\" onclick='openSheetDetail("+ rowindex + ")' >"+value+"</a>";
                    return html;
                }
            },
            { display: '主办单位', showTitle:true,name: 'customerArea', type:'TREE_QXZX_AREA_TYPE', align: 'left', width: "10%",
                render: function (rowdata, rowindex, value, column) {
                    return top.hollyDataUtil.getTreeItemByValue("TREE_QXZX_AREA_TYPE",value,"name");
                }},
            { display: '申诉类型', showTitle:true,name: 'dealWay', type:'DICT_DEAL_WAY_CODE', align: 'left', width: "10%",render: function (rowdata, rowindex, value, column){
                    return top.hollyDataUtil.getDictName("DICT_DEAL_WAY_CODE",value);
                }},
            { display: '环节状态', showTitle:true,name: 'sheetStatus', type:'dict_SHEET_ACTUALITY', align: 'left', width: "10%"},
            { display: '受理工号', showTitle:true,name: 'acceptUser',  align: 'left', width: "10%"},
            { display: '业务号码', showTitle:true,name: 'businessNo',  align: 'left', width: "10%"},
            { display: '投诉归属地', showTitle:true,name: 'complainArea', type:'dict_B_CITY', align: 'left', width: "10%"},
            { display: '受理时间', showTitle:true,name: 'acceptTime',  align: 'left', width: "15%"},
            { display: '上环节操作时间', showTitle:true,name: 'upCreateTime',  align: 'left', width: "15%"
            },
            { display: '上一步操作', showTitle:true,name: 'upContent',  align: 'left', width: "10%",
                render: function (rowdata, rowindex, value, column) {
                    if (value == null) {
                        return "";
                    } else {
                        return top.hollyDataUtil.getDictName("ACTION_TYPE", value);
                    }
                }
            },
            { display: '工单类型', showTitle:true,name: 'codeSheetTypeId',  align: 'left', width: "20%",type:'treePath_CODE_SHEET_TYPE_ID'},
            { display: '问题场景', showTitle:true,name: 'busScene',align: 'left', width: "10%",
                render: function (rowdata, rowindex, value, column) {
                    if(value==''){
                        return "";
                    }else{
                        return top.hollyDataUtil.getTreeItemById("PCC_NEW_POINT",value,"name");
                    }
                }
            },
            { display: '业务类别', showTitle:true,name: 'codeBusinessType',type:'dict_DICT_BUS_TYPE',  align: 'left', width: "10%"},
            { display: '环节时限', showTitle:true,name: 'processingTimeLimit',  align: 'left', width: "10%"},
            // { display: '是否回访', showTitle:true,name: 'dfTotalNum', align: 'left', width: "10%",
            //     render: function (rowdata, rowindex, value, column){
            //         if(value){
            //             return "是";
            //         }else{
            //             return "否";
            //         }
            //     }
            // },
            { display: '是否回访成功', showTitle:true,name: 'expandField12', type:'dict_DICT_IS_SUCCESS', align: 'left', width: "10%"},
            { display: '回访时间', showTitle:true,name: 'dfCreateTime',  align: 'left', width: "20%"},
            { display: '受理渠道', showTitle:true,name: 'codeAcceptChannel', type:'dict_DICT_ACC_CHANNEL', align: 'left', width: "10%"},
            // { display: '提交渠道', showTitle:true,name: 'submitWay', type:'dict_DICT_SUBMIT_WAY', align: 'left', width: "15%"},
            /*{ display: '是否跨省', showTitle:true,name: 'indictseq', align: 'left', width: "10%",
                render: function (rowdata, rowindex, value, column){
                    if(value){
                        return "是";
                    }else{
                        return "否";
                    }
                }
            }*/
            { display: '派单人',showTitle:true,name: 'expandField11', align: 'left', width: "10%"}
        ],
        params:datagrid.getParams(),
        url:pccWorkbenchService+'/getPageList',
        method:'post',
        sortName: '',
        sortOrder:'',
        checkbox: true,
        rownumbers:true,
        height: '100%', width:"auto",
        pageSize:10,
        title:'工单列表',
        async:false,
        onAfterShowData:onAfterShowData,
        rowAttrRender: function(rowdata, rowid) {
            return "1" == rowdata.khPhoneLevel ? "style=\"background-color:#f8dacc;\"" : '';
        }
    },datagrid);

    datagrid.querySheetLinkFlag();//查询红黄牌
});


// function getType(){
//     var param = {};
//     param.departmentalId=userInfo.orgId;
//     holly.get(pccCoreService+"/config/linevince/getLineVinceList",param,function (data) {
//         isSjORsy=data[0].parentId;
//         if(isSjORsy=="1"){  //升级进来的账号
//             $("#shengji").show();
//             $("#shengsu").hide();
//         }else if(isSjORsy=="2"){ //申诉进来的账号
//             $("#shengji").hide();
//             $("#shengsu").show();
//         }
//     });
// }


function onAfterShowData(data) {
    var rows = data.rows;
    for(var i = 0; i<rows.length; i++) {
        var dealTaskId  = rows[i].dealTaskId;
        var sheetId = rows[i].sheetId;
        holly.get(pccCoreService + "/sheet/handle/calculationtime", {"dealTaskId":dealTaskId}, function (data) {
            if (data.RSP != null && (data.RSP.RSP_CODE === '0000')) {
                var rd = data.RSP.DATA.workTime;
                var ret ="";
                if (data.RSP.RSP_DESC == -1) {
                    var title = "超时:"+rd;
                    ret = "<font color='#d81e06' title='"+title+"'>" + title + "<font>"
                } else {
                    var title = "剩余:"+rd;
                    ret = "<font color='#343843' title='"+title+"'>" + title + "<font>"
                }
                $('#span_'+data.RSP.DATA.dealTaskId).html(ret);
            }
        }, false);

        holly.get( pccCoreService + "/sheet/operationslog/getpagelist", {"sheetId": sheetId,"sort":"create_time","rows":100,"page":1}, function (data) {
            if (data.RSP != null && (data.RSP.RSP_CODE === '0000')) {
                var ret = "";
                var rd = data.RSP.DATA;
                var length = rd.rows.length;
                var operLog = false;
                if(length == 1 ) {
                    operLog = rd.rows[0];
                }else if(length > 1 ) {
                    operLog = rd.rows[length-2];
                }
                if(operLog){
                    var rett = operLog.createTime;
                    ret = "<font title='"+rett+"'>" + rett + "<font>"

                }
                $('#span_actiontype_'+operLog.sheetId).html(ret);

                var operationContent ="";
                if(length > 0 ) {
                    operationContent = rd.rows[length-1].operationContent;
                    operationContent = top.hollyDataUtil.hollyData.getDictName('ACTION_TYPE',operationContent);
                    operationContent = "<font title='"+operationContent+"'>" + operationContent + "<font>";
                    $('#span_operationContent_'+ rd.rows[length-1].sheetId).html(operationContent);
                }

            }
        }, false);
        var cookieId=holly.cookies.get(rows[i].sheetCode.substring(6));
        // console.log(cookieId);
        if(cookieId=='1'){
            console.log($(g.getRowObj(i)).css("color",'MediumVioletRed'));
        }

    }
}

function selectSheetStatus(e) {
    $("input[name='sheetStatusMuti']").attr("checked",e.checked);
}
function workbenchQuery(){
    datagrid.search();
}
function resetData() {
    $('#queryForm')[0].reset();
    $("div[name='codeSheetTypeId']").setValue("", "");
    $("#codeSheetTypeId").selectTreeRender(setting);
    $("div[name='busScene']").setValue("", "");
    $("div[name='codeProcType']").setValue("", "");
    $("#codeProcType").selectTreeRender(setting1);
    $("div[name='acceptChannel']").setValue("", "");
    $("div[name='businessTypes']").setValue("", "");
    $("div[name='codeAreaCode']").setValue("", "");
    $("div[name='submitWay']").setValue("", "");
    $("div[name='sheetStatus']").setValue("", "");
    $("div[name='gainTypes']").setValue("", "");
    $("div[name='starlevel']").setValue("", "");
    $("div[name='complainArea']").setValue("", "");
    $("div[name='areaType']").setValue("", "");
    $("div[name='dealWay']").setValue("", "");
}

function initComplete(){
    hollyPage.parsDictCombobox();
    // loginUserGroups = datagrid.getLoginGroups();

    //初始化下拉框
    // $("#codeSheetTypeId").data("data", top.hollyDataUtil.getTreeList("CODE_SHEET_TYPE_ID"));//工单类型
    // $("#codeSheetTypeId").render();

    $("#codeProcType").data("data", top.hollyDataUtil.getTreeList("TREE_PROC_TYPE"));//产品类别
    $("#codeProcType").render();
    //初始化投诉归属地分类树
    var arr = top.hollyDataUtil.getTreeList("PCC_TREE_CITY");
    var dataArea = new Array();
    for(i = 0; i < arr.length; i++){
        if(arr[i].isParent){//父节点
            dataArea[i] = arr[i];
        }else{
            arr[i].id = arr[i].attributes.codeValue;
            dataArea[i] = arr[i];
        }
    }
    $("#complainArea").data("data", dataArea);//投诉归属地
    $("#complainArea").render();

    $("#codeSheetTypeId").selectTreeRender(setting);
    $("#codeProcType").selectTreeRender(setting1);
    $("#complainArea").selectTreeRender(setting2);

    //问题场景
    var newPointNodes = top.hollyDataUtil.getTreeList("PCC_NEW_POINT");
    var busSceneNodes = new Array();
    for (var i = 0; i < newPointNodes.length; i++) {
        if (newPointNodes[i].parentId == '') {
            var param = {};
            param.id = newPointNodes[i].id;
            param.name = newPointNodes[i].name;
            busSceneNodes.push(param);
        }
    }
    $("#busScene").data("data", busSceneNodes)
    $("#busScene").render();

    treeToSelect("acceptChannel","DICT_ACC_CHANNEL");//受理渠道
    treeToSelect("businessTypes","DICT_BUS_TYPE");//业务类别
    treeToSelect("submitWay","DICT_SUBMIT_WAY");//提交渠道
    treeToSelect("sheetStatus","SHEET_ACTUALITY");//工单状态
    treeToSelect("gainTypes","GAIN_TYPE");//认领方式
    treeToSelect("starlevel","DICT_STARLEVEL");//处理优先级
    treeToSelect("busProId","DICT_AREA_CODE");//业务省份
    treeToSelectList("areaType","TREE_QXZX_AREA_TYPE");//企业地区
    treeListType("codeSheetTypeId","CODE_SHEET_TYPE_ID");//工单类型
    treeToSelectList("codeAreaCode","TREE_QXZX_AREA_TYPE");//主办单位
    treeToSelect("shensu","DICT_DEAL_WAY_CODE");//申诉工单类型
}
//格式化
$.quiDefaults.Grid.formatters['enabled'] = function (value, column) {
    return value == "1"?"启用":"停用";
}
//格式化
$.quiDefaults.Grid.formatters['deptName'] = function (val, column) {
    return val?"<span title='"+val+"'>"+val+"</span>":"";
}

function openSheetDetail(index){

    var rowdata = g.getRow(index);
    var dealTaskId = rowdata.dealTaskId;
    var sheetId = rowdata.sheetId;
    var proId = rowdata.proId;
    var sheetTypeId = rowdata.codeSheetTypeId;
    var busScene = rowdata.busScene;
    var sheetCode = rowdata.sheetCode;
    var nodeKey = rowdata.nodeKey;
    var linkType = rowdata.linkType;
    var dealUnitId = rowdata.dealUnitId;
    var businessNo = rowdata.businessNo;
    var bussinessType = rowdata.codeBusinessType;
    var codeSponsorType=rowdata.customerArea;
    /*if(proId == '70'){
        var url = ctxPath+"sheet/sheetdetail/page/sheetdetail_qh.html?sheetId="+sheetId+"&dealTaskId="+dealTaskId+"&sheetTypeId="+sheetTypeId+"&nodeKey="+nodeKey+"&linkType="+linkType+"&dealUnitId="+dealUnitId+"&businessNo="+businessNo+"&bussinessType="+bussinessType+"&sheetCode="+sheetCode;
    }else{
        var url = ctxPath+"sheet/sheetdetail/page/sheetdetail.html?sheetId="+sheetId+"&dealTaskId="+dealTaskId+"&sheetTypeId="+sheetTypeId+"&nodeKey="+nodeKey+"&linkType="+linkType+"&dealUnitId="+dealUnitId+"&businessNo="+businessNo+"&bussinessType="+bussinessType+"&sheetCode="+sheetCode;
    }*/
    var url = ctxPath+"sheet/sheetdetail/page/sheetdetail.html?sheetId="+sheetId+"&dealTaskId="+dealTaskId+"&sheetTypeId="+sheetTypeId+"&nodeKey="+nodeKey+"&linkType="+linkType+"&dealUnitId="+dealUnitId+"&businessNo="+businessNo+"&bussinessType="+bussinessType+"&sheetCode="+sheetCode+"&codeSponsorType="+codeSponsorType;

    top.tabAddHandler(sheetId+"_workbench","工单详情"+sheetCode,url,true);
    var cookieid=sheetCode.substring(6);
    var clickedCookie=holly.cookies.get(cookieid);
    if(clickedCookie!='1'){
        holly.cookies.set(cookieid,'1',1/144);
    }
    console.log($(g.getRowObj(index)).css("color",'MediumVioletRed'));

//    var rowdata = g.getRow(index);
//    var dealTaskId = rowdata.dealTaskId;
//    var sheetId = rowdata.sheetId;
//    var sheetTypeId = rowdata.codeSheetTypeId;
//    var sheetCode = rowdata.sheetCode;
//    var nodeKey = rowdata.nodeKey;
//    var linkType = rowdata.thisLinkType;
//    var dealUnitId = rowdata.thisUnitId;
//    var businessNo = rowdata.businessNo;
//    var bussinessType = rowdata.codeBusinessType;
//    var diag = new top.Dialog();
//    diag.Modal = false;
//    diag.Title = sheetCode;
//    diag.Id = sheetId;
//    diag.ParamsObj = {
//        ID:diag.ID,
//        sheetId:sheetId
//    };
//    diag.style = "simple";
//    diag.URL  = ctxPath+"sheet/sheetdetail/page/sheetdetail.html?sheetId="+sheetId+"&dealTaskId="+dealTaskId+"&sheetTypeId="+sheetTypeId+"&nodeKey="+nodeKey+"&linkType="+linkType+"&dealUnitId="+dealUnitId+"&businessNo="+businessNo+"&bussinessType="+bussinessType+"&sheetCode="+sheetCode;
//    diag.ShowMaxButton=true;
//    diag.ShowMinButton=true;
//    diag.CancelEvent = function(){
//        datagrid.search();
//        diag.close();
//    };
//
////   diag.MinEvent = function(){
////
////   };
//
////   diag.ShowButtonRow=true;
//    diag.show();
//    diag.max();


}

var datagrid = {
    addTabs: function(id,title,url) {
        var option = {};
        option.id = id;
        option.title = title;
        option.url = url;
        top.tab.add(option);
    },
    getCurrentTab: function() {
        return $(".tabContainer .tab_title.tab_item2_selected").parents(".tab_item").attr("id");
    },
    showView: function(index) {
        var rowdata = g.getRow(index);
        var sheetId = rowdata.sheetId;

        var title =  "中途意见";
        var diag = new top.Dialog();
        diag.Title = title;
        diag.URL  = ctxPath+"sheet/workbench/page/show_view_list.html?sheetId="+sheetId;
        diag.Id = "show_view_list";
        diag.Height = 400;
        diag.Width = 900;
        diag.Top="70";
        diag.ShowMaxButton=true;
        diag.ShowMinButton=true;
        diag.ButtonAlign = "right";
        diag.OKEvent = function(){
            diag.close();
        };
        diag.OnLoad=function(){
            // var param = {};
            // param.sheetId=sheetId;
            // diag.innerFrame.contentWindow.data.loadFormData(param);
        };
        diag.CancelEvent = function(){
            diag.close();
        };
        diag.ShowButtonRow=true;
        diag.ShowOkButton = false;
        diag.CancelButtonText = " 关 闭 ";
        diag.show();
    },
    showUrge: function(index) {
        var rowdata = g.getRow(index);
        var sheetId = rowdata.sheetId;
        var title =  "催单";
        var diag = new top.Dialog();
        diag.Title = title;
        diag.URL  = ctxPath+"sheet/workbench/page/show_urge_list.html?sheetId="+sheetId;
        diag.Id = "show_urge_list";
        diag.Height = 400;
        diag.Width = 900;
        diag.Top="70";
        diag.ShowMaxButton=true;
        diag.ShowMinButton=true;
        //diag.ButtonAlign = "right";
        diag.OKEvent = function(){
            diag.close();
        };
        diag.OnLoad=function(){
            // var param = {};
            // param.sheetId=sheetId;
            // diag.innerFrame.contentWindow.data.loadFormData(param);
        };
        diag.CancelEvent = function(){
            diag.close();
        };
        diag.ShowButtonRow=true;
        diag.ShowOkButton = false;
        diag.CancelButtonText = " 关 闭 ";
        diag.show();
    },
    /**
     * 查询
     */
    search:function () {
        g.setOptions({ params : datagrid.getParams()});
        g.loadData();
        datagrid.querySheetLinkFlag();//查询红黄牌
    },

    /**
     * 列表参数
     */
    getParams:function  () {
        var param=holly.form2json($("#queryForm"));
        param.codeDealStatus='2';
        param.tenantId=userInfo.tenantId;
        param.dealUnitId=userInfo.orgId;
        param.proId=userInfo.proId;
        param.userCode = userInfo.userCode;

        return param;
    },
    getLoginGroups:function(){
        var result = "";
        holly.get(pccCoreService+"/userdetail/getloginuserinfo",{"type":"groups"},function (data) {
            if(data.RSP!=null && (data.RSP.RSP_CODE ==='0000')){
                var groups = data.RSP.DATA;
                var groupsArray = [];
                for(var idx in groups){
                    groupsArray.push(groups[idx].groupId);
                }
                result =  groupsArray.toString();

            }
        },true);
        return result;

    },
    //查询红黄牌
    querySheetLinkFlag:function(){
        var url = pccWorkbenchService+"/getLinkFlag";
        holly.post(url,datagrid.getParams(),function (data) {
            if(data.RSP!=null && (data.RSP.RSP_CODE ==='0000')){
                var sheetLinkFlagAarry = data.RSP.DATA;
                var redcount = 0;
                var yellowcount = 0;
                var greencount = 0;
                var total = 0;
                for(var sheetLinkFlagIdx in sheetLinkFlagAarry){
                    var sheetLinkFlagObj = sheetLinkFlagAarry[sheetLinkFlagIdx];
                    if(sheetLinkFlagObj.SHEET_LINK_FLAG=="GREEN"){
                        greencount =sheetLinkFlagObj.CNT;
                    }else if(sheetLinkFlagObj.SHEET_LINK_FLAG=="YELLOW"){
                        yellowcount = sheetLinkFlagObj.CNT;
                    }else if(sheetLinkFlagObj.SHEET_LINK_FLAG == "RED"){
                        redcount = sheetLinkFlagObj.CNT;
                    }

                }
                total = parseInt(greencount)+parseInt(yellowcount)+parseInt(redcount);
                $("#redcnt").text(redcount).next().text((total=== 0 ? 0: Math.round((redcount/(total))*100)));
                $("#yellowcnt").text(yellowcount).next().text((total=== 0 ? 0 : Math.round((yellowcount/(total))*100)));
                $("#greencnt").text(greencount).next().text((Math.round((total=== 0 ? 0 : greencount/(total))*100)));

            }
        },false);
    },
    //一键释放
    onoauthrelase:function(row){
        var selectData = g.getSelectedRows();
        if(selectData.length<1){
            top.Dialog.alert("请选择数据!");
            return;
        }
        var arr = new Array();
        for(var i in selectData){
            arr.push({
                dealTaskId: selectData[i].dealTaskId
            })
        }
        var title =  "一键释放";
        var diag = new top.Dialog();
        diag.Title = title;
        diag.URL  = ctxPath+"sheet/workbench/page/releasesheet.html";
        diag.Id = "workbench-release-sheet";
        diag.ShowMaxButton=true;
        diag.ShowMinButton=true;
        diag.Height = 280;
        diag.ButtonAlign = "center";
        diag.OKEvent = function(){
            var valid = $(diag.innerFrame.contentWindow.document.getElementById("myform")).validationEngine({returnIsValid: true});
            if(valid == true){
                var url= pccCoreService+'/workbenchcontroller/oauthReleaseSheet';
                var param = {"dealTaskIds":JSON.stringify(arr),"realseReason":diag.innerFrame.contentWindow.document.getElementsByName("releaseReason")[0].value};
                holly.post(url,param,function (data) {
                    if(data.RSP!=null && (data.RSP.RSP_CODE ==='0000')){
                        datagrid.search();
                        top.toastr.success("一键释放成功");
                    }else{
                        top.toastr.error("释放失败，原因:"+data.RSP.RSP_DESC);
                    }
                })
                diag.close();
            }else{
                top.toastr.error('表单填写不正确，请按要求填写！');
            }

        };

        diag.CancelEvent = function(){
            diag.close();
        };
        diag.ShowButtonRow=true;
        diag.show();
    },


    //释放
    onrelase:function(row){
        var rowdata = g.getRow(row);
        var dealTaskId = rowdata.dealTaskId;
        var title =  "释放";
        var diag = new top.Dialog();
        diag.Title = title;
        diag.URL  = ctxPath+"sheet/workbench/page/releasesheet.html";
        diag.Id = "workbench-release-sheet";
        diag.ShowMaxButton=true;
        diag.ShowMinButton=true;
        diag.Height = 280;
        diag.ButtonAlign = "center";
        diag.OKEvent = function(){
            var valid = $(diag.innerFrame.contentWindow.document.getElementById("myform")).validationEngine({returnIsValid: true});
            if(valid == true){
                datagrid.releaseSheet(dealTaskId,diag.innerFrame.contentWindow.document.getElementsByName("releaseReason")[0].value);
                diag.close();
            }else{
                top.toastr.error('表单填写不正确，请按要求填写！');
            }

        };

        diag.CancelEvent = function(){
            diag.close();
        };
        diag.ShowButtonRow=true;
        diag.show();
    },
    //释放提交方法
    releaseSheet:function(dealTaskIds,realeasecontent){
        var url= pccCoreService+'/workbenchcontroller/releasesheet';
        var param = {"dealTaskIds":dealTaskIds,"realseReason":realeasecontent};
        holly.post(url,param,function (data) {
            if(data.RSP!=null && (data.RSP.RSP_CODE ==='0000')){
                datagrid.search();
                top.toastr.success("释放成功");
            }else{
                top.toastr.error("释放失败，原因:"+data.RSP.RSP_DESC);
            }
        })
    },
    //提取更多工单
    onpickmore:function () {
        var url = pccCoreService+"/workbenchcontroller/workbenchwaitdo";
        var param= datagrid.getParams();
        param.userCode="";
        holly.post(url,param,function (data) {
            var title =  "提取更多";
            var diag = new top.Dialog();
            diag.Title = title;
            diag.Top="70";
            diag.URL  = ctxPath+"sheet/workbench/page/pickmore.html?num="+data.RSP.DATA.totalRows;
            diag.Id = "workbench-pickmore-sheet";
            diag.ShowMaxButton=true;
            diag.ShowMinButton=true;
            diag.Height = 400;
            diag.Width = 500;
            diag.ButtonAlign = "center";
            diag.OKEvent = function(){
                var valid = $(diag.innerFrame.contentWindow.document.getElementById("myform")).validationEngine({returnIsValid: true});
                if(valid == true){
                    datagrid.pickMoreSheet("",diag.innerFrame.contentWindow.document.getElementsByName("num")[0].value);
                }else{
                    top.toastr.error('表单填写不正确，请按要求填写！');
                }
                diag.close();
            };
            diag.OnLoad=function(){
                var param = datagrid.getParams();
                if (param.codeSheetTypeId) {
                    diag.innerFrame.contentWindow.document.getElementById("codeSheetTypeId").value=treeTransText(param.codeSheetTypeId,"CODE_SHEET_TYPE_ID","tree");
                }
                if(param.busScene){
                    diag.innerFrame.contentWindow.document.getElementById("busScene").value=treeTransText(param.busScene,'DICT_BUS_SCENE',"select");
                }
                if (param.codeProcType) {
                    diag.innerFrame.contentWindow.document.getElementById("codeProcType").value=treeTransText(param.codeProcType,"TREE_PROC_TYPE","tree");
                }
                if (param.busType) {
                    diag.innerFrame.contentWindow.document.getElementById("busType").value=treeTransText(param.busType,"DICT_BUS_TYPE","select");
                }
                if (param.acceptChannel) {
                    diag.innerFrame.contentWindow.document.getElementById("acceptChannel").value=treeTransText(param.acceptChannel,"DICT_ACC_CHANNEL","select");
                }
                if (param.submitWay) {
                    diag.innerFrame.contentWindow.document.getElementById("submitWay").value=treeTransText(param.submitWay,"DICT_SUBMIT_WAY","select");
                }
                if (param.sheetStatus) {
                    diag.innerFrame.contentWindow.document.getElementById("sheetStatus").value=treeTransText(param.sheetStatus,"SHEET_ACTUALITY","select");
                }
                if (param.codeGainType) {
                    diag.innerFrame.contentWindow.document.getElementById("codeGainType").value=treeTransText(param.codeGainType,"GAIN_TYPE","select");
                }
                if (param.businessNo) {
                    diag.innerFrame.contentWindow.document.getElementById("businessNo").value=param.businessNo;
                }
                if (param.sheetLinkFlag) {
                    diag.innerFrame.contentWindow.document.getElementById("sheetLinkFlag").value= param.sheetLinkFlag;
                }
                if (param.starlevel) {
                    diag.innerFrame.contentWindow.document.getElementById("starlevel").value= treeTransText(param.starlevel,"DICT_STARLEVEL","select");
                }
                if (param.complainArea) {
                    diag.innerFrame.contentWindow.document.getElementById("complainArea").value= treeTransText(param.complainArea,"B_CITY","select");
                }
            };
            diag.CancelEvent = function(){
                diag.close();
            };
            diag.ShowButtonRow=true;
            diag.show();
        })
    },
    //提取更多提交
    pickMoreSheet:function(workGroupId,num){
        var url = pccCoreService+"/workbenchcontroller/picksheet";
        //var param= {"workGroupId":loginUserGroups,"num":num};

        var param= {"workGroupId":userInfo.orgId,"num":num};
        holly.post(url,param,function (data) {
            if(data!=null && data.RSP.RSP_CODE ==='0000'){
                datagrid.search();
                top.toastr.success(data.RSP.RSP_DESC);
            }
        })
    },
    //挑选更多
    onchoosemore:function(){
        var title =  "挑选更多";
        var diag = new top.Dialog();
        diag.Title = title;
        diag.URL  = ctxPath+"sheet/workbench/page/choosemore.html";
        diag.Id = "workbench-release-sheet";
        diag.Height = 500;
        diag.Width = 1150;
        diag.Top="10";
        diag.ShowMaxButton=true;
        diag.ShowMinButton=true;
        diag.ButtonAlign = "right";
        diag.OKEvent = function(){
            var dataArray = diag.innerFrame.contentWindow.datagrid.getSelected();
            var dealTaskIdArray = [];
            for(var idx in dataArray){
                dealTaskIdArray.push(dataArray[idx].dealTaskId);
            }
            if(dealTaskIdArray!=null && dealTaskIdArray.length>0){
                datagrid.chooseMoreSheet(dealTaskIdArray.toString());
            }else{
                top.toastr.error("请筛选工单");
                return;
            }
            diag.close();
        };
        diag.OnLoad=function(){
            var param = datagrid.getParams();
            diag.innerFrame.contentWindow.data.loadFormData(param);
        };
        diag.CancelEvent = function(){
            diag.close();
        };
        diag.ShowButtonRow=true;
        diag.show();
    },
    chooseMoreSheet:function(dealTaskIds){
        var url = pccCoreService+"/workbenchcontroller/choosemoresheet";
        var param= {"dealTaskIds":dealTaskIds};
        holly.post(url,param,function (data) {
            if(data!=null && data.RSP.RSP_CODE ==='0000'){
                datagrid.search();
                top.toastr.success(data.RSP.RSP_DESC);
            }
        })
    },
    //全部释放
    onrelaseall:function () {
        var title =  "全部释放";
        var diag = new top.Dialog();
        diag.Title = title;
        diag.URL  = ctxPath+"sheet/workbench/page/releasesheet.html";
        diag.Id = "workbench-release-allsheet";
        diag.ShowMaxButton=true;
        diag.ShowMinButton=true;
        diag.Height = 280;
        diag.ButtonAlign = "center";
        diag.OKEvent = function(){
            var valid = $(diag.innerFrame.contentWindow.document.getElementById("myform")).validationEngine({returnIsValid: true});
            if(valid == true){
                datagrid.relaseallSheet(diag.innerFrame.contentWindow.document.getElementsByName("releaseReason")[0].value);
                diag.close();
            }else{
                top.toastr.error('表单填写不正确，请按要求填写！');
            }

        };

        diag.CancelEvent = function(){
            diag.close();
        };
        diag.ShowButtonRow=true;
        diag.show();

    },
    relaseallSheet:function (realseReason) {
        var url = pccCoreService+"/workbenchcontroller/relaseallsheet";
        var param= datagrid.getParams();
        param.realseReason=realseReason;

        holly.post(url,param,function (data) {
            if(data!=null && data.RSP.RSP_CODE ==='0000'){
                datagrid.search();
                top.toastr.success(data.RSP.RSP_DESC);
            }
        });
    }
}

var setting = {
    view: {
        selectedMulti: true,
        showLine: false
    },
    check: {
        enable: true,
    },
    callback:{
        onClick:  function (event, treeId, treeNode) {
            if(treeNode.isParent){
            }else{
                $("#codeSheetTypeId").setValue(treeNode.id);
                $("#codeSheetTypeId").selectTreeRender(setting);
            }
        }
    }
};
var setting1 = {
    view: {
        selectedMulti: true,
        showLine: false
    },
    check: {
        enable: true,
    },
    callback:{
        onClick:  function (event, treeId, treeNode) {
            if(treeNode.isParent){
            }else{
                $("#codeProcType").setValue(treeNode.id);
                $("#codeProcType").selectTreeRender(setting1);
            }
        }
    }
};
var setting2 = {
    view: {
        selectedMulti: true,
        showLine: false
    },
    check: {
        enable: true,
    },
    callback:{
        onClick:  function (event, treeId, treeNode) {
            if(treeNode.isParent){
                treeObj.expandNode(treeNode);
            }else{
                $("#complainArea").setValue(treeNode.attributes.codeValue);
                $("#complainArea").selectTreeRender(setting2);
            }
        }
    }
};

/**
 * 普通数据字典转换成树形平行下拉框
 * @param divId
 * @param dictType
 */
function treeToSelect(divId,dictType){
    var treeNodes = [];
    var result =top.hollyDataUtil.getDictList(dictType, true);
    for(var i=0;i<result.length;i++){
        var obj = {};
        obj.id = result[i].value;
        obj.name = result[i].name;
        treeNodes.push(obj);
    }
    $("#"+divId).data("data",treeNodes);
    $("#"+divId).render();

}

function treeListType(divId,dictType){
    var treeNodes = [];
    var result = top.hollyDataUtil.getTreeList(dictType);
    for (var i = 0; i < result.length; i++) {
        if (result[i].parentId == '') {
            var obj = {};
            obj.id = result[i].id;
            obj.name = result[i].name;
            treeNodes.push(obj);
        }
    }
    $("#"+divId).data("data", treeNodes)
    $("#"+divId).render();

}

function treeToSelectList(divId,dictType){
    var treeNodes = [];
    var result =top.hollyDataUtil.getTreeList(dictType, true);
    for(var i=0;i<result.length;i++){
        if (result[i].isParent == true && result[i].attributes.codeValue != '99') {//取所有父节点
            var obj = {};
            obj.id = result[i].attributes.codeValue;
            obj.name = result[i].name;
            treeNodes.push(obj);
        }
    }
    $("#"+divId).data("data",treeNodes);
    $("#"+divId).render();

}

function treeTransText(param,codeType,type){
    var dataText="";
    var data = param.toString().split(",");
    if (type == "tree") {
        for (var i = 0; i < data.length; i++) {
            dataText += top.hollyDataUtil.getTreeValueName(codeType,data[i])+",";
        }
    }else {
        for (var i = 0; i < data.length; i++) {
            dataText += top.hollyDataUtil.getDictName(codeType,data[i])+",";
        }
    }
    return dataText;
}

