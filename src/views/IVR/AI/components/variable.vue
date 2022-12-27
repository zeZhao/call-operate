<!--  -->
<template>
  <div id="variableSetting" style="width:100%">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        prop="date"
        label="变量名称"
        min-width="180"
      >
        <template slot-scope="scope">
          <el-input
            v-model="tableData[scope.$index].varName"
            placeholder="请输入内容"
            :maxlength="10"
            show-word-limit
            size="mini"
            :disabled="auditStatus"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="变量类型"
        min-width="180"
      >
        <template slot-scope="scope">
          <el-select
            clearable
            placeholder="请选择场景状态"
            size="mini"
            v-model="tableData[scope.$index].varType"
            :disabled="auditStatus"
          >
            <el-option label="入口变量" :value="1"></el-option>
            <el-option label="自定义变量" :value="2"></el-option>
            <!-- <el-option
              v-for="(item, index) in tableData"
              :label="index + 1"
              :value="index + 1"
              :key="index"
            ></el-option> -->
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="auditStatus"
            @click="del(scope.$index)"
            >删除</el-button
          >
          <el-divider
            direction="vertical"
            v-if="tableData.length >= 2 && scope.$index + 1 == tableData.length"
          ></el-divider>
          <el-button
            type="text"
            size="small"
            @click="add(scope.$index + 1)"
            :disabled="auditStatus"
            v-if="scope.$index + 1 == tableData.length"
            >添加</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-button
      type="primary"
      style="float: right;margin-top:20px"
      @click="varSubmit"
      :disabled="auditStatus"
      >保存</el-button
    >
    <el-button
      type="primary"
      style="float: right;margin-top:20px;margin-right:30px"
      @click="add"
      :disabled="auditStatus"
      v-if="tableData.length == 0"
      >现在添加</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    auditStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { tableData: [], sceneId: "" };
  },
  created() {
    this.sceneId = this.$route.query.sceneId;
    this.VallLis();
  },

  components: {},

  computed: {},

  methods: {
    /*
    变量设定保存提交
    */
    varSubmit() {
      const self = this;
      let sum = 0
      // 判断提交内容是否为空;
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].varName == "") {
          this.$message.error("变量名称为必填项！");
          return;
        }
        if (this.tableData[i].varType == "") {
          this.$message.error("所有变量必须选择变量类型！");
          return;
        }
      }

      // 判断提交内容是否重复;
      for (var i = 0; i < this.tableData.length; i++) {
        var varName = this.tableData[i].varName;
        var varType = this.tableData[i].varType;
        // 用来取出当前项后面的每一项(被比较每一项)
        if (varType == 1) {
          sum += 1;
        }
        for (var j = i + 1; j < this.tableData.length; j++) {
          if (varName === this.tableData[j].varName) {
            this.$message.error("所有变量名称不能重复！");
            return;
          }

          // if (varType === this.tableData[j].varType) {
          //   this.$message.error("所有变量序号不能重复使用！");
          //   return;
          // }
        }
      }
      if (sum > 10) {
        this.$message.error("入口变量不能超过10个！");
        return;
      }

      var data = {
        data: {
          sceneId: self.sceneId,
          variableList: self.tableData,
        },
        version: "1.0",
      };
      this.$http.scene.addVarAlias(data).then((res) => {
        if (res.state == "200") {
          self.$message({
            type: "success",
            message: "保存成功!",
          });
        } else {
          self.$message.error(res.msg);
        }
      });
    },

    /*
    变量设定删除
    */
    del(index) {
      this.tableData.splice(index, 1);
      // for (let i = 0; i < this.tableData.length; i++) {
      //   if (this.tableData[i].varType == index + 1) {
      //     this.tableData[i].varType = "";
      //   }
      // }
    },
    /*
    变量设定添加
    */
    add(index) {
      // if (index == 8) {
      //   this.$message.error("变量设置已达最大条数！");
      //   return;
      // }

      this.tableData.push({ varType: "", varName: "" });
    },
    /*
     标签列表
     */

    VallLis() {
      const self = this;

      var data = {
        data: {
          sceneId: self.sceneId,
        },
        version: "1.0",
      };
      this.$http.scene.listVarAlias(data).then((res) => {
        if (res.state == "200") {
          self.tableData = [];
          res.data.forEach((val) => {
            self.tableData.push({
              varType: val.varType,
              varName: val.varName,
            });
          });
          //   self.tableData = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="les" scoped></style>
