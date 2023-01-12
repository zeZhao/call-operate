<template>
  <!-- 线路对接 -->
  <div class="lineDocking">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    >
      <template slot="other">
        <el-button type="primary" @click="advanced">高级配置</el-button>
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="lineName" label="线路名称" width="120" show-overflow-tooltip/>
      <el-table-column prop="corpName" label="供应商名称" width="120"/>
      <el-table-column prop="supplyAccountName" label="供应商账户" width="120"/>
      <el-table-column prop="linkType" label="对接方式">
        <template slot-scope="{row}">
          <span v-if="row.linkType === 0">SIP对接</span>
          <span v-if="row.linkType === 1">账号注册</span>
        </template>
      </el-table-column>
      <el-table-column prop="concurrentCount" label="线路并发数" />
      <el-table-column prop="ip" label="服务器IP地址" width="120"/>
      <el-table-column prop="port" label="端口" />
      <el-table-column prop="sipAccount" label="注册账号" />
      <el-table-column prop="status" label="可用状态" >
          <template slot-scope="{row}">
          <span v-if="row.status === 0">禁用</span>
          <span v-if="row.status === 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="落地省份" >
        <template slot-scope="{row}">
          <span>{{row.province}} - {{row.city}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operaId" label="归属运营商" >
        <template slot-scope="{row}">
          <span v-if="row.operaId === 0">非法</span>
          <span v-if="row.operaId === 1">移动</span>
          <span v-if="row.operaId === 2">联通</span>
          <span v-if="row.operaId === 3">电信</span>
          <span v-if="row.operaId === 4">国际</span>
        </template>
      </el-table-column>
      <el-table-column prop="lineType" label="线路类型" >
        <template slot-scope="{row}">
          <span v-if="row.lineType === 0">直连</span>
          <span v-if="row.lineType === 1">第三方</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'lineId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem('templateId', scope.row.lineId, false, true)
            "
            type="text"
            size="small"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        :labelWidth="100"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @selectChange="selectChange"
      ></FormItem>
    </el-dialog>

    <!-- 高级配置 -->
    <el-dialog
      title="高级设置"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <p>主叫改写规则</p>
        <div v-for="(item, index) in zj" :key="index" class="advanced">
          <div class="demo-input-suffix">
            <span>前缀：</span>
            <el-input placeholder="请输入前缀" v-model="item.preFix"> </el-input>
          </div>
          <div class="demo-input-suffix">
            <span>修改为：</span>
            <el-input placeholder="请输入前缀" v-model="item.preFixCorrection">
            </el-input>
          </div>
          <div>
            <el-button type="text" @click="deteleZj(index)" v-if="index > 0">删除</el-button>
            <el-button type="text" @click="addZj">增加</el-button>
          </div>
        </div>
        <el-divider></el-divider>
        <p>
          被叫改写规则<span
            style="color: rgb(175 170 170); font-size: 12px; padding-left: 10px"
            >开发说明：支持通配符。*表示所有，?表示单个字符</span
          >
        </p>
        <div v-for="(item, index) in bj" :key="index" class="advanced">
          <div class="demo-input-suffix">
            <span>前缀：</span>
            <el-input placeholder="请输入前缀" v-model="item.preFix"> </el-input>
          </div>
          <div class="demo-input-suffix">
            <span>修改为：</span>
            <el-input placeholder="请输入前缀" v-model="item.preFixCorrection">
            </el-input>
          </div>
          <div>
            <el-button type="text" @click="deteleBj(index)" v-if="index > 0">删除</el-button>
            <el-button type="text" @click="addBj">增加</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="callrulePut"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "供应商名称", key: "corpName" },
        { type: "input", label: "线路名称", key: "corpNames" },
        { type: "inputNum", label: "供应商账户", key: "userId" },
        {
          type: "select",
          label: "对接方式",
          key: "linkType",
          optionData: [
            { key: 0, value: "SIP对接" },
            { key: 1, value: "账号注册" },
          ],
        },
        {
          type: "select",
          label: "线路类型",
          key: "lineType",
          optionData: [
            { key: 0, value: "直连" },
            { key: 1, value: "第三方" },
          ],
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            // { key: 0, value: "非法" },
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
            { key: 4, value: "国际" },
          ],
        },
        {
          type: "select",
          label: "落地省份",
          key: "city",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "停用" },
            { key: "3", value: "有效" },
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: 0, value: "禁用" },
            { key: 1, value: "启用" },
          ],
        },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "linecfg",
        list: "get",
        add: "post",
        edit: "put",
        detele: "delete",
      },
      isParamsNotData: false,
      submitParamsIsData: false,
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "供应商名称",
          key: "supplyId",
          defaultValue: "",
          optionData:[]
        },
        {
          type: "select",
          label: "供应商账户",
          key: "userId",
          defaultValue: "",
          optionData:[]
        },
        {
          type: "input",
          label: "线路名称",
          key: "lineName",
          defaultValue: "",
        },
        {
          type: "select",
          label: "线路类型",
          key: "lineType",
          defaultValue: 0,
          initDefaultValue:0,
          optionData: [
            { key: 0, value: "直连" },
            { key: 1, value: "第三方" },
          ],
          colSpan:12
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          defaultValue: "",
          optionData: [
            // { key: 0, value: "非法" },
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
            { key: 4, value: "国际" },
          ],
          colSpan:12
        },
        {
          type: "select",
          label: "落地省份",
          key: "province",
          defaultValue: "",
          optionData:[],
          colSpan:12
        },
        {
          type: "select",
          label: "落地城市",
          key: "city",
          defaultValue: "",
          optionData:[],
          colSpan:12
        },
        // {
        //   type: "select",
        //   label: "落地城市",
        //   key: "userId",
        //   defaultValue: "",
        //   optionData: [
        //     { key: "1", value: "普通坐席" },
        //     { key: "2", value: "企业管理员" },
        //   ],
        //   colSpan:12
        // },
        {
          type: "select",
          label: "状态",
          key: "status",
          defaultValue: "",
          optionData: [
            { key: 0, value: "禁用" },
            { key: 1, value: "启用" },
          ],
          colSpan:12
        },
        {
          type: "input",
          label: "线路并发数",
          key: "concurrentCount",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "select",
          label: "对接方式",
          key: "linkType",
          defaultValue: "",
          optionData: [
            { key: 0, value: "SIP对接" },
            { key: 1, value: "账号注册" },
          ],
          colSpan:12
        },
        {
          type: "input",
          label: "服务器IP",
          key: "ip",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "input",
          label: "信令端口",
          key: "port",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "textarea",
          label: "备注",
          key: "remarks",
          defaultValue: "",
          colSpan:12
        },
        
      ],
      id: "",
      dialogVisible: false,
      zj: [{ preFix: "", preFixCorrection: "",callType:1 }],
      bj: [{ preFix: "", preFixCorrection: "",callType:2 }],
    };
  },
  created() {},
  mounted() {
    this.queryCorpByCorpType()
    this.provincecity()
    this.callruleGet()
  },
  computed: {},
  methods: {
    callrulePut(){
      let params = this.zj.concat(this.bj)
      console.log(params,'-----')
      this.$http.linecfg.callrulePut(params).then(res=>{
        if(res.state == 200){
          this.dialogVisible = false
          this.callruleGet()
          this.$message.success('设置成功')
        }
      })
    },
    //获取高级配置
    callruleGet(){
      this.zj = []
      this.bj = []
      this.$http.linecfg.callruleGet({}).then(res=>{
        if(res.state == 200){
          res.data.list.forEach(item=>{
            this.$nextTick(()=>{
              if(item.callType === 1){
                this.zj.push(item)
              }else{
                this.bj.push(item)
              }
            })
            
          })
        }
      })
    },
    //获取公司下拉
    queryCorpByCorpType(){
      this.$http.select.queryCorpByCorpType({corpType:2}).then(res=>{
        this._setDefaultValue(this.formConfig,res.data.records,'supplyId','corpId','corpName')
      })
    },
    corpListAll(corpId){
      this.$http.select.corpListAll({corpId}).then(res=>{
        this._setDefaultValue(this.formConfig,res.data.records,'userId','supplyId','userName')
      })
    },
    provincecity(province){
      this.$http.select.provincecity({province}).then(res=>{
        this._setDefaultValue(this.formConfig,res.data,'province','province','province')
      })
    },
    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if(item.key === 'supplyId'){
          this.corpListAll(item.defaultValue)
        }
      });
      
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    selectChange({val,item}){
      if(item.key === 'lineType'){
        this.operaId
        if(val == 0){
          this._setDisplayShow(this.formConfig,'operaId',false)
          this._setDisplayShow(this.formConfig,'province',false)
          this._setDisplayShow(this.formConfig,'city',false)
        }else{
          this._setDisplayShow(this.formConfig,'operaId',true)
          this._setDisplayShow(this.formConfig,'province',true)
          this._setDisplayShow(this.formConfig,'city',true)
        }
        
      }
      if(item.key === 'province'){
        if(val){
          this.$http.select.provincecity({province:val}).then(res=>{
            this._setDefaultValue(this.formConfig,res.data[0].cityList,'city','city','city')
            this._deleteDefaultValue(this.formConfig,'city')
          })
        }else{
          this._setDefaultValue(this.formConfig,[],'city','city','city')
          this._deleteDefaultValue(this.formConfig,'city')
        }
      }
      if(item.key === 'supplyId'){
        if(val){
          this.corpListAll(val)
          this._deleteDefaultValue(this.formConfig, 'userId')
        }else{
          this._setDefaultValue(this.formConfig,[],'userId','supplyId','userName')
          this._deleteDefaultValue(this.formConfig, 'userId')
        }
      }
      
    },
    advanced() {
      this.dialogVisible = true;
      this.callruleGet()
      if(this.zj.length === 0){
        this.zj = [{ preFix: "", preFixCorrection: "",callType:1 }];
      }
      if(this.bj.length === 0){
        this.bj = [{ preFix: "", preFixCorrection: "",callType:2 }];
      }
      
      // this.bj = [{ val: "", newVal: "" }];
    },
    handleClose() {
      this.dialogVisible = false;
    },
    addZj() {
      let obj = { preFix: "", preFixCorrection: "",callType:1 };
      this.zj.push(obj);
    },
    deteleZj(index) {
      this.zj.splice(index, 1);
    },
    addBj() {
      let obj = { preFix: "", preFixCorrection: "",callType:2 };
      this.bj.push(obj);
    },
    deteleBj(index) {
      this.bj.splice(index, 1);
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.advanced{
  display: flex;
  margin-top: 20px;
  .el-input{
    width: 70%;
  }
}
</style>
