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
}