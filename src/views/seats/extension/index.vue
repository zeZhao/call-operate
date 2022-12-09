<template>
  <!-- 分机 -->
  <div class="extension">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="corpId" label="商家账户" />
      <el-table-column prop="corpId" label="分机号" />
      <el-table-column prop="corpId" label="分机密码" />
      <el-table-column prop="corpId" label="分机类型" />
      <el-table-column prop="corpId" label="绑定座席" />
      <el-table-column prop="corpId" label="外呼主叫" />
      <el-table-column prop="corpId" label="外呼线路" />
      <el-table-column prop="corpId" label="分机昵称" />
      <el-table-column prop="corpId" label="作为批量外呼主叫" />
      <el-table-column prop="corpId" label="是否录音" />
      <el-table-column prop="corpId" label="状态" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem('templateId', scope.row.templateId, false, true)
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
      <el-form :model="form" label-position="left" label-width="80px" ref="form">
        <el-form-item label="商家名称：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分机号：">
          <el-row>
            <el-col :span="2">
              <el-input v-model="form.name"></el-input>
            </el-col>
            <el-col :span="2" style="text-align:center">
              <span>-</span>
            </el-col>
            <el-col :span="2">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="分机密码：">
          <el-row>
            <el-col :span="9"
              ><el-radio-group v-model="form.passWord">
                <el-radio :label="1">随机生成</el-radio>
                <el-radio :label="2">指定密码</el-radio>
              </el-radio-group></el-col>
            <el-col :span="6">
              <el-input
                v-model="form.passwd"
                v-if="form.passWord == 2"
              ></el-input
            ></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="分机类型：">
          <el-select v-model="form.type">
            <el-option :value="1">网页电话</el-option>
            <el-option :value="2">SIP话机</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外呼线路：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="外呼主叫：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="是否录音：">
          <el-select v-model="form.type">
            <el-option :value="1">是</el-option>
            <el-option :value="2">否</el-option>
          </el-select>
        </el-form-item>
        <el-checkbox v-model="form.extension"
          >按照分机信息生成并绑定座席</el-checkbox
        >
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addChannel = false">取 消</el-button>
        <el-button type="primary" @click="addChannel = false">确 定</el-button>
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
        { type: "input", label: "商家账号", key: "corpName" },
        { type: "input", label: "分机号", key: "corpNames" },
        {
          type: "select",
          label: "分机类型",
          key: "sign",
          optionData: [
            { key: "1", value: "全部" },
            { key: "1", value: "SIP话机" },
            { key: "2", value: "网页电话" },
          ],
        },
        {
          type: "select",
          label: "外呼线路",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "线路A" },
            { key: "3", value: "线路B" },
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "有效" },
            { key: "3", value: "停用" },
          ],
        },
        {
          type: "select",
          label: "是否录音",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "是" },
            { key: "3", value: "否" },
          ],
        },
        {
          type: "select",
          label: "绑定座席",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "张三" },
            { key: "3", value: "李四" },
          ],
        },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "smslongnum",
        list: "list",
        detele: "delete",
      },
      // 列表参数
      namespace: "configs",
      namespaceType: "Array",
      // 表单配置
      form: {
        name: "",
        type: "",
        password: "",
        passwd: "",
      },
      id: "",
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped></style>
