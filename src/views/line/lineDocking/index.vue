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
      <el-table-column prop="lineName" label="线路名称" />
      <el-table-column prop="userName" label="供应商名称" />
      <el-table-column prop="userId" label="供应商账户" />
      <el-table-column prop="linkType" label="对接方式">
        <template slot-scope="{row}">
          <span v-if="row.linkType === 0">SIP对接</span>
          <span v-if="row.linkType === 1">账号注册</span>
        </template>
      </el-table-column>
      <el-table-column prop="concurrentCount" label="线路并发数" />
      <el-table-column prop="ip" label="服务器IP地址" />
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
      <el-table-column prop="remarks" label="备注" />
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
        @choose="choose"
      ></FormItem>
    </el-dialog>

    <!-- 高级配置 -->
    <el-dialog
      title="高级设置"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div>
        <p>主叫改写规则</p>
        <div v-for="(item, index) in zj" :key="index" class="advanced">
          <div class="demo-input-suffix">
            前缀：
            <el-input placeholder="请输入前缀" v-model="item.val"> </el-input>
          </div>
          <div class="demo-input-suffix">
            修改为：
            <el-input placeholder="请输入前缀" v-model="item.newVal">
            </el-input>
          </div>
          <div>
            <el-button type="text" @click="deteleZj(index)">删除</el-button>
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
            前缀：
            <el-input placeholder="请输入前缀" v-model="item.val"> </el-input>
          </div>
          <div class="demo-input-suffix">
            修改为：
            <el-input placeholder="请输入前缀" v-model="item.newVal">
            </el-input>
          </div>
          <div>
            <el-button type="text" @click="deteleBj(index)">删除</el-button>
            <el-button type="text" @click="addBj">增加</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
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
            { key: 0, value: "非法" },
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
          type: "input",
          label: "供应商名称",
          key: "supplyId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "供应商账户",
          key: "userId",
          defaultValue: "",
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
          defaultValue: "",
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
            { key: 0, value: "非法" },
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
            { key: 4, value: "国际" },
          ],
          colSpan:12
        },
        {
          type: "input",
          label: "落地省份",
          key: "province",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "input",
          label: "落地城市",
          key: "city",
          defaultValue: "",
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
      ],
      id: "",
      dialogVisible: false,
      zj: [{ val: "", newVal: "" }],
      bj: [{ val: "", newVal: "" }],
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    advanced() {
      this.dialogVisible = true;
      this.zj = [{ val: "", newVal: "" }];
      this.bj = [{ val: "", newVal: "" }];
    },
    handleClose() {
      this.dialogVisible = false;
    },
    addZj() {
      let obj = { val: "", newVal: "" };
      this.zj.push(obj);
    },
    deteleZj(index) {
      this.zj.splice(index, 1);
    },
    addBj() {
      let obj = { val: "", newVal: "" };
      this.bj.push(obj);
    },
    deteleBj(index) {
      this.bj.splice(index, 1);
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
