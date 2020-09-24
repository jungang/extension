<template>
    <div v-if="boxStatus" :class="(show?'openBox':'') + ' box'">
        <el-button-group>
            <el-button type="primary" size="mini">插件v0.2</el-button>
            <el-button round type='primary' size="mini" @click="toggle()">{{show?'缩小':'展开'}}</el-button>
        </el-button-group>
        <div v-show="show">
            <el-table max-height="450" :data="goodsList" border stripe>
                <el-table-column show-overflow-tooltip v-for="col in columns"
                    :prop="col.id"
                    :key="col.id"
                    :label="col.label"
                    :width="col.width">
                    <template slot-scope="scope">
                        <img class="img" v-if="col.id == 'picUrl'" :src="scope.row.picUrl" alt="">
                        <a target="_blank" v-else-if="col.id == 'url'" :href="scope.row.url">点击跳转</a>
                        <p v-else>{{scope.row[col.id]}}</p>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" size="mini" @click="clean()">清空</el-button>
        </div>

    </div>
</template>

<script>
import {getElementsByAttr} from './utils/utils'
import axios from 'axios'
import {loadElmBtn, addGood, cleanGood, getGoodsList} from './utils/good'
import {IGood} from './utils/good'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let src = ''
  for (let item in data) {
    console.log('item:', item)
    src += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
  }
  return src
}]

export default {
    data: function(){
        return {
          timing:{},
            n:0,
            autoSave:true,
            saveNum:0,
            dealTaskIds:'',
            pccCoreService:'/jd15/pcc/ac/core',
            matchArr : [],
            boxStatus:false,
            runStatus:false,
            msg: '',
            goodsList: [],
            show: false,
            columns: [],
            labels: ['编号', '图片', '价格', '标题', '地址', '来源']
        }
    },
    mounted(){



      if(location.pathname === '/jd15/pcc/ac/visitor/sheet/workbench/page/complainsheet-gky.html'){
        // console.log('location.pathname:', location.pathname)
        console.log('工单工作台。。。')

        let n=0
        console.log('datagrid:', datagrid)

        window.addEventListener('storage',function(e){
          console.log(e.key, e.oldValue, e.newValue);
          datagrid.search()
        });

      }



      if(location.pathname === '/jd15/pcc/ac/visitor/sheet/workbench/page/choosemore.html'){
        console.log('选择弹窗。。。')
        // 显示box
        // this.boxStatus = true
        // 构造按钮
        const btnEl = `

                    自动领单:<input type="checkbox" id="autoSave" value="1" checked />

                    默认领单数量 <input id="saveNum" type="number" max="10" value="3" />
                    <button type="button" id="exBtn"
                    class="h_grid_imgbtn"
                    style="padding:0 10px; border-radius: 4px; margin-right: 10px">
                        <label style="cursor: pointer;">开始抢单</label>
                        </button>`
        $('button.grid_imgbtn.h_grid_imgbtn').before(btnEl);
        $('#exBtn').on('click',()=>this.handleStart())

        //更新数据
        setTimeout( ()=>{
          window.g = g
          g.bind("success", (data)=>this.match(data));

        },0)
      }

    },

  created() {
    // this.getList()
  },
    methods: {

      chooseMoreSheet(dealTaskIds){
        var url = this.pccCoreService+"/workbenchcontroller/choosemoresheet";
        var param= {"dealTaskIds":dealTaskIds};
        holly.post(url,param, (data)=> {
          console.log('保存成功:')
          this.$notify({
            type: 'success',
            title: '领单成功',
            message: `保存: ${this.saveNum}`,
            duration: 10000
          });

          localStorage.refresh = new Date()
        })
      },
      // 匹配处理
      match(data){

        if(!this.runStatus)return

        this.runStatus = false
        clearInterval(this.timing)
        $('#exBtn').text('开始抢单')

        console.log('结束抢单')

        // console.log('data:', data)
        this.matchArr = []
        this.dealTaskIds = []
        data.rows.forEach(item=>{
          // sheetFlag 工单标识为空
          if(!item.sheetFlag){
            //servContent 开头是 【
            if(item.servContent.substr(0, 1) === '【'){
              this.matchArr.push(item)
              this.dealTaskIds.push(item.dealTaskId)
            }
          }
        })

        console.log('符合条件数量:', this.dealTaskIds.length)

        this.$notify({
          type: 'success',
          title: '查询完成',
          message: `符合条件数量: ${this.dealTaskIds.length}`,
          duration: 10000
        });
        // 保存

        if(this.autoSave){
          const saveIds = this.dealTaskIds.slice(0,this.saveNum)
          this.chooseMoreSheet(saveIds.toString())
        }


      },
      handleStart(){

        if(this.runStatus)return
        this.runStatus = true
        $('#exBtn').text('正在抢单中...')

        this.saveNum = $('#saveNum').val()
        this.saveNum = this.saveNum <= 10 ? this.saveNum : 10
        $('#saveNum').val(this.saveNum)

        this.autoSave = $('#autoSave').prop("checked")

        console.log('自动保存:', this.autoSave)
        console.log('设定保存数量:', this.saveNum)

        this.timing = setInterval(()=>{
          console.log('抢单次数:', this.n++)
          // $('button.grid_imgbtn.h_grid_imgbtn').click()
          this.getList()
        },3000)


      },

      getList(){
        console.log('getList...:')
        // console.log('datagrid.search:', datagrid.search)
        // console.log('document', document.getElementById('sheetCode').value)

        var param = holly.form2json($("#queryForm"));
        param.tenantId = userInfo.tenantId;
        param.proId = userInfo.proId;
        param.dealUnitId = userInfo.orgId;
        param.sheetCode = document.getElementById('sheetCode').value;
        // console.log('param:', param)

        g.setOptions({params: param});
        g.options.pageSize = 1000
        g.loadData();

      },
      load(){
            loadElmBtn(this.addGood)
        },
        addGood(event){
            addGood(event, this.goodsList)
        },
        toggle(){
            this.show = !this.show
        },
        clean(){
            cleanGood()
            this.goodsList = []
        }
    }
}
</script>


<style>
.notice{
    width: 300px;
    background: rgba(255, 255, 255);
}
.box{
    position: fixed;
    height: 0;
    right: 0;
    top: 0;
    background: rgba(225, 225, 225, 0);
    z-index: 999999999;
    transition: all 0.3s;
}
.openBox{
    width: 600px;
    background: #fff;
    height: 550px;
    overflow-y: scroll;
    overflow: hidden;
    padding: 10px;
    transition: all 0.3s;
    box-shadow: 0 0 10px 0 #ccc;
}
.img{
    height: 100px;
}
#toolBtn{
    position: relative;
    bottom: 20px;
    left: 0;
    z-index: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background: #409EFF;
    transition: all 0.5s;
}
#toolBtn:hover{
    width: 100%;
    border-radius: 0;
}
#toolBtn:hover::after{
    content: '添加'
}
</style>

<style>
#saveNum{
  font-size: 12px;
  width: 50px;
  text-align: center;
  border-color: #BEC0C9;
  border-style: solid;
  border-width: 1px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
}
.el-notification {white-space:pre !important; }

#autoSave[type="checkbox"]:not(:checked), #autoSave[type="checkbox"]:checked {
  position: static;
  left: 0;
}
</style>
