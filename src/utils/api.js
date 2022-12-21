import request from "./http"

export default {
  //登录
  login: {
    login(data) {
      return request('/sysLogin/login', 'post', data)
    }
  },
  //账户
  sysUser: {
    //列表
    list(data) {
      return request('/sysUser/list', 'post', data)
    },
    //新增、修改
    save(data) {
      return request('/sysUser/save', 'put', data)
    },
    //删除
    delete(data) {
      return request('/sysUser/delete', 'get', data)
    },
    //更新密码
    updatePwd(data) {
      return request('/sysUser/updatePwd', 'post', data)
    },
  },
  //坐席
  attend: {
    //列表
    list(data) {
      return request('/attend/list', 'post', data)
    },
    //新增、修改
    updateAndSaveAttend(data) {
      return request('/attend/updateAndSaveAttend', 'post', data)
    },
    //删除
    delete(data) {
      return request('/attend/delete', 'get', data)
    },
  },
  //分机
  extensions: {
    //列表
    list(data) {
      return request('/extensions/list', 'post', data)
    },
    //新增
    saveExtensions(data) {
      return request('/extensions/saveExtensions', 'post', data)
    },
    //修改
    updateExtensions(data) {
      return request('/extensions/updateExtensions', 'post', data)
    },
    //删除
    delete(data) {
      return request('/extensions/delete', 'get', data)
    },
  },
  //合作方管理、公司
  corp: {
    //列表
    list(data) {
      return request('/corp/list', 'post', data)
    },
    //新增、修改
    save(data) {
      return request('/corp/save', 'put', data)
    },
    //删除
    delete(data) {
      return request('/corp/delete', 'get', data)
    },
  },
  //商家
  corpUser: {
    //列表
    list(data) {
      return request('/corpUser/list', 'post', data)
    },
    //新增、修改
    updateAndSaveCorpUser(data) {
      return request('/corpUser/updateAndSaveCorpUser', 'post', data)
    },
    //充值
    cropUserRecharge(data) {
      return request('/corpUser/cropUserRecharge', 'post', data)
    },
    //删除
    delete(data) {
      return request('/corpUser/delete', 'get', data)
    },
  },
  //供应商
  corpSupply: {
    //列表
    list(data) {
      return request('/corpSupply/list', 'post', data)
    },
    //新增、修改
    updateAndSaveCorpSupply(data) {
      return request('/corpSupply/updateAndSaveCorpSupply', 'post', data)
    },
    //充值
    cropSupplyRecharge(data) {
      return request('/corpSupply/cropSupplyRecharge', 'post', data)
    },
    //删除
    delete(data) {
      return request('/corpSupply/delete', 'get', data)
    },
  },
  //供应商
  corpAgent: {
    //列表
    list(data) {
      return request('/corpAgent/list', 'post', data)
    },
    //新增、修改
    updateAndSaveCorpAgent(data) {
      return request('/corpAgent/updateAndSaveCorpAgent', 'post', data)
    },
    //充值
    cropAgentRecharge(data) {
      return request('/corpAgent/cropAgentRecharge', 'post', data)
    },
    //删除
    delete(data) {
      return request('/corpAgent/delete', 'get', data)
    },
  },
  //费率
  costRate: {
    //列表
    get(data) {
      return request('/costRate/get', 'post', data)
    },
    //新增、
    post(data) {
      return request('/costRate/post', 'post', data)
    },
    //修改
    put(data) {
      return request('/costRate/put', 'put', data)
    },
    //删除
    delete(data) {
      return request(`/costRate/delete/${data}`, 'delete')
    },
  },
  //套餐
  combo: {
    //列表
    get(data) {
      return request('/combo/get', 'post', data)
    },
    //新增、
    post(data) {
      return request('/combo/post', 'post', data)
    },
    //修改
    put(data) {
      return request('/combo/put', 'put', data)
    },
    //删除
    delete(data) {
      return request(`/combo/delete/${data}`, 'delete')
    },
  },
  //线路
  linecfg: {
    //列表
    get(data) {
      return request('/linecfg/get', 'post', data)
    },
    //新增、
    post(data) {
      return request('/linecfg/post', 'post', data)
    },
    //修改
    put(data) {
      return request('/linecfg/put', 'put', data)
    },
    //删除
    delete(data) {
      return request(`/linecfg/delete/${data}`, 'delete')
    },
  },
  //呼入配置
  inboundcfg: {
    //列表
    get(data) {
      return request('/inboundcfg/get', 'post', data)
    },
    //新增、
    post(data) {
      return request('/inboundcfg/post', 'post', data)
    },
    //修改
    put(data) {
      return request('/inboundcfg/put', 'put', data)
    },
    //删除
    delete(data) {
      return request(`/inboundcfg/delete/${data}`, 'delete')
    },
    //导入
    batchcreate(data) {
      return request('/inboundcfg/excel/batchcreate', 'post', data)
    },
    //导出
    exportExcel(data) {
      return request('/inboundcfg/exportExcel', 'post', data , true)
    },
  },
}