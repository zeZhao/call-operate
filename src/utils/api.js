import request from "./http"

export default {
  //登录
  login: {
    login(data) {
      return request('/sysLogin/login', 'post', data)
    }
  },
  // 下拉接口
  select: {
    //获取公司
    // corpType（0:商家,1:代理商,2:供应商）
    queryCorpByCorpType(data) {
      return request('/corp/queryCorpByCorpType', 'get', data)
    },
    // 获取供应商
    corpListAll(data) {
      return request('/corpSupply/listAll', 'post', data)
    },
    // 获取商户
    userListAll(data) {
      return request('/corpUser/listAll', 'post', data)
    },
    // 获取代理商
    agentListAll(data) {
      return request('/corpAgent/listAll', 'post', data)
    },
    // 获取省份
    provincecity(data) {
      return request('/provincecity/get', 'post', data)
    },
    // 获取坐席
    attendlistAll(data) {
      return request('/attend/listAll', 'post', data)
    },
    // 获取技能组下拉
    IVRlistAll(data) {
      return request('/skillGroup/listAll', 'get', data)
    },
    // 获取线路下拉
    linecfgList(data) {
      return request('/linecfg/getList', 'get', data)
    },
    // 获取外呼任务下拉
    listTask(data) {
      return request('/callTask/listTask', 'get', data)
    },
     //  IVR下拉数据
    listScene(params) {
      return request("/scene/listScene", 'post', params);
    },
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
    //获取角色
    sysRoleLlist(data) {
      return request('/sysRole/list', 'post', data)
    },
    //修改角色
    addOrUpdateRole(data) {
      return request('/sysUserRole/addOrUpdate', 'post', data)
    },
  },
  // 权限
  sysRole:{
    //获取角色
    sysRoleLlist(data) {
      return request('/sysRole/list', 'post', data)
    },
    //新增修改角色
    save(data) {
      return request('/sysRole/save', 'post', data)
    },
    //删除角色
    delete(data) {
      return request('/sysRole/delete', 'get', data)
    },
    //获取所有菜单列表
    sysMenuList(data) {
      return request('/sysMenu/list', 'post', data)
    },
    //当前角色对应权限列表
    sysRoleMenuList(data) {
      return request('/sysRoleMenu/list', 'get', data)
    },
    //更新角色权限
    sysRoleMenuSave(data) {
      return request('/sysRoleMenu/save', 'post', data)
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
    // 下拉分机列表
    extensionsList(data) {
      return request('/extensions/extensionsList', 'get', data)
    },
  },
  //外呼数据管理-列表
  outboundata: {
    //列表
    list(data) {
      return request('/outboundata/list', 'post', data)
    },
    //外呼数据管理-导出
    export(data) {
      return request(`/outboundata/export`, 'post', data, true)
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
    //删除
    updateSecretKey(data) {
      return request('/corp/updateSecretKey', 'get', data)
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
  //代理商
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
    //获取高级配置
    callruleGet(data) {
      return request('/callrule/get', 'post', data)
    },
    //提交高级配置
    callrulePut(data) {
      return request('/callrule/put', 'put', data)
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
  rechargeWater:{
    //短信充值记录
    smsRechargeLog(data){  
      return request('/smsRechargeLog/get/rechargeWater/detail', 'post', data)
    },
    //语音充值记录
    speechRechargeLog(data){  
      return request('/speechRechargeLog/get/rechargeWater/detail', 'post', data)
    },
  },
  //审核管理
  auditManage: {
    //查询所有菜单
    listSceneAuditByPage(params) {
      return request("/scene/listSceneAuditByPage", 'post', params);
    },
    //场景审核
    updateAuditStatus(params) {
      return request("/scene/updateAuditStatus", 'post', params);
    },
  },
  // 技能组
  skillGroup: {
    //获取技能组列表
    listAll(params) {
      return request("/skillGroup/listAll", 'get', params);
    },
    // 获取本企业所有坐席
    listAttendAll(params) {
      return request("/skillGroup/listAttendAll", 'get', params);
    },
    // 获取本技能组所有坐席
    listAttendAllBySkillGroup(params) {
      return request("/skillGroup/listAttendAllBySkillGroup", 'get', params);
    },
    // 分页查询技能组
    listByPage(params) {
      return request("/skillGroup/listByPage", 'post', params);
    },
    // 新增技能组
    save(params) {
      return request("/skillGroup/save", 'post', params);
    },
    // 更新技能组
    update(params) {
      return request("/skillGroup/update", 'post', params);
    },
    // 更新技能组状态
    updateState(params) {
      return request("/skillGroup/updateState", 'post', params);
    },
    // 删除技能组
    delete(params) {
      return request("/skillGroup/delete", 'delete', params);
    },
  },
  // 场景管理
  scene: {
    // 合成
    synthesisBranchVoice(params) {
      return request("/scene/branch/synthesisBranchVoice", 'post', params);
    },
    // 试听变量上传的语音
    getSegment(params) {
      return request("/scene/branch/segment/getSegment", 'post', params);
    },
    // 上传变量文件后保存
    updateSegment(params) {
      return request("/scene/branch/segment/updateSegment", 'post', params);
    },
    // 场景列表
    listSceneByPage(params) {
      return request("/scene/listSceneByPage", 'post', params);
    },
    // 场景添加
    addScene(params) {
      return request("/scene/addScene", 'post', params);
    },
    // 场景修改
    updateScene(params) {
      return request("/scene/updateScene", 'post', params);
    },
    // 场景删除
    deleteScene(params) {
      return request("/scene/deleteScene", 'post', params);
    },
    // 场景公开，不公开
    updateSceneByOpenFlag(params) {
      return request("/scene/updateSceneByOpenFlag", 'post', params);
    },
    // 场景发布
    enableScene(params) {
      return request("/scene/enableScene", 'post', params);
    },
    // 场景复制
    copyScene(params) {
      return request("/scene/copyScene", 'post', params);
    },
    // 场景重新发布
    releaseScene(params) {
      return request("/scene/releaseScene", 'post', params);
    },
    //  111111111111111111111111111111111111、
    //  场景详情话术设置添加
    addBranch(params) {
      return request("/scene/branch/addBranch", 'post', params);
    },
    //  场景详情话术设置修改
    updateBranch(params) {
      return request("/scene/branch/updateBranch", 'post', params);
    },
    //  场景详情话术设置列表
    listBranch(params) {
      return request("/scene/branch/listBranch", 'post', params);
    },
    //  场景详情话术设置删除
    deleteBranch(params) {
      return request("/scene/branch/deleteBranch", 'post', params);
    },
    //  场景详情话术设置标题文本配置
    listMatchRule(params) {
      return request("/scene/branch/matchRule/listMatchRule", 'post', params);
    },
    //  场景详情话术设置标题文本配置添加
    addMatchRule(params) {
      return request("/scene/branch/matchRule/addMatchRule", 'post', params);
    },
    //  场景详情话术设置标题文本选项添加
    addOption(params) {
      return request("/scene/branch/option/addOption", 'post', params);
    },
    //  场景详情话术设置选项删除
    deleteOption(params) {
      return request("/scene/branch/option/deleteOption", 'post', params);
    },
    //  场景详情话术设置选项列表
    listOption(params) {
      return request("/scene/branch/option/listOption", 'post', params);
    },
    //  场景详情话术设置选项修改
    updateOption(params) {
      return request("/scene/branch/option/updateOption", 'post', params);
    },
    //  场景详情话术设置 上传修改
    updateBranchFile(params) {
      return request("/scene/branch/updateBranchFile", 'post', params);
    },
    //  场景详情话术设置选项       文本配置
    listOptionMatchRule(params) {
      return request(
        "/sceneOptionMatchRule/listOptionMatchRule", 'post',
        params
      );
    },
    //  场景详情话术设置选项规则       文本配置添加
    addOptionMatchRule(params) {
      return request(
        "/sceneOptionMatchRule/addOptionMatchRule", 'post',
        params
      );
    },
    //  场景详情话术设置选项规则       文本配置校验
    checkOptionRuleExist(params) {
      return request(
        "/sceneOptionMatchRule/checkOptionRuleExist", 'post',
        params
      );
    },
    //  场景详情话术设置选项规则       文本配置删除
    deleteOptionMatchRule(params) {
      return request(
        "/sceneOptionMatchRule/deleteOptionMatchRule", 'post',
        params
      );
    },
    // 1
    //  场景详情话术设置标题文本配置删除
    deleteMatchRule(params) {
      return request("/scene/branch/matchRule/deleteMatchRule", 'post', params);
    },
    //  场景详情话术设置标题文本 判断当前场景下是否存在
    checkMatchRule(params) {
      return request("/scene/branch/matchRule/checkMatchRule", 'post', params);
    },
    //  场景详情变量设定 列表
    listVarAlias(params) {
      return request("/varAlias/listVarAlias", 'post', params);
    },
    //  场景详情变量设定 添加
    addVarAlias(params) {
      return request("/varAlias/addVarAlias", 'post', params);
    },
    //  场景详情知识库选项 列表
    listKnowledge(params) {
      return request("/scene/knowledge/listKnowledge", 'post', params);
    },
    //  场景详情知识库 知识库列表信息
    listKnowledgeClass(params) {
      return request("/scene/knowledgeClass/listKnowledgeClass", 'post', params);
    },
    //  场景详情知识库 知识库状态
    updateKnowledgeStatus(params) {
      return request("/scene/knowledge/updateKnowledgeStatus", 'post', params);
    },
    //  场景详情知识库 知识点文件上传
    updateKnowledgeFile(params) {
      return request("/scene/knowledge/updateKnowledgeFile", 'post', params);
    },
    //  场景详情知识库 知识点添加
    addKnowledge(params) {
      return request("/scene/knowledge/addKnowledge", 'post', params);
    },
    //  场景详情知识库 知识点删除
    deleteKnowledge(params) {
      return request("/scene/knowledge/deleteKnowledge", 'post', params);
    },
    //  场景详情知识库 知识点修改
    updateKnowledge(params) {
      return request("/scene/knowledge/updateKnowledge", 'post', params);
    },
    //  场景详情知识库 知识点  添加规则校验
    checkKnowledgeRuleExist(params) {
      return request(
        "/scene/knowledge/matchRule/checkKnowledgeRuleExist", 'post',
        params
      );
    },
    //  场景详情知识库 知识点  添加规则提交
    addKnowledgeRule(params) {
      return request("/scene/knowledge/matchRule/addKnowledgeRule", 'post', params);
    },
    //  场景详情知识库 知识点  添加规则删除
    deleteKnowledgeRule(params) {
      return request(
        "/scene/knowledge/matchRule/deleteKnowledgeRule", 'post',
        params
      );
    },
    //  场景详情标签 列表
    listTagBySceneId(params) {
      return request("/scene/tag/listTagBySceneId", 'post', params);
    },
    //  场景详情标签 添加
    addTag(params) {
      return request("/scene/tag/addTag", 'post', params);
    },
    //  场景详情标签 删除
    deleteTag(params) {
      return request("/scene/tag/deleteTag", 'post', params);
    },
    //  场景详情标签 是否关联标签
    checkBranchIsHaveTag(params) {
      return request("/scene/tag/checkBranchIsHaveTag", 'post', params);
    },
    //  场景详情标签 编辑提交
    updateTag(params) {
      return request("/scene/tag/updateTag", 'post', params);
    },

    //  场景详情多标签 列表
    listTag(params) {
      return request("/sceneCombinationTag/listTag", 'get', params,);
    },
    //  场景详情多标签添加
    moreAddTag(params) {
      return request("/sceneCombinationTag/addTag", 'post', params);
    },
    //  场景详情多标签删除
    moreDeleteTag(params) {
      return request("/sceneCombinationTag/deleteTag", 'post', params);
    },
    //  场景详情多标签编辑
    moreUpdateTag(params) {
      return request("/sceneCombinationTag/updateTag", 'post', params);
    },
    //  更新标签顺序接口
    updateTagAll(params) {
      return request("/sceneCombinationTag/updateTagAll", 'post', params);
    },
    //  标签table页选择接口
    updateSceneTag(params) {
      return request("/scene/updateSceneTag", 'post', params);
    },

    ////////////////////////////////////////////////////
    // 语义引擎管理列表
    listSemanticsSourceByPage(params) {
      return request("/semantic/provider/listSemanticsSourceByPage", 'post', params);
    },
    // 语义引擎添加
    addSemanticsSource(params) {
      return request("/semantic/provider/addSemanticsSource", 'post', params);
    },
    // 语义引擎修改
    updateSemanticsSource(params) {
      return request("/semantic/provider/updateSemanticsSource", 'post', params);
    },
    // 语义引擎删除
    deleteSemanticsSource(params) {
      return request("/semantic/provider/deleteSemanticsSource", 'post', params);
    },
    // 合成语音配置列表
    listConvertConfig(params) {
      return request("/tts/config/listConvertConfig", 'post', params);
    },
    // 合成语音配置 人声列表
    listVoiceLib(params) {
      return request("/tts/config/listVoiceLib", 'post', params);
    },
    // 合成语音配置 修改
    updateConvertConfig(params) {
      return request("/tts/config/updateConvertConfig", 'post', params);
    },
    // 场景学习列表
    listSceneLogByPage(params) {
      return request("/scene/log/listSceneLogByPage", 'post', params);
    },
    // 场景学习处理
    updateSceneLog(params) {
      return request("/scene/log/updateSceneLog", 'post', params);
    },
    // 修改发布状态
    skipSceneInformation(params) {
      return request("/scene/skipSceneInformation", 'post', params);
    },
    //语音验证码列表
    voiceListSceneByPage(params) {
      return request("/voiceMessageScene/listSceneByPage", 'post', params);
    },
    //新增场景
    voiceAddScene(params) {
      return request("/voiceMessageScene/addScene", 'post', params);
    },
    //新增场景
    voiceDeleteScene(params) {
      return request("/voiceMessageScene/deleteScene", 'post', params);
    },
    //修改场景
    voiceUpdateScene(params) {
      return request("/voiceMessageScene/updateScene", 'post', params);
    },
    //修改场景状态
    updateSceneStatus(params) {
      return request("/scene/updateSceneStatus", 'post', params);
    },

  },
  // 短信
  note:{
    // 短信模板选项列表
    listSmsTemplate(params) {
      return request("/sms/template/listSmsTemplate", 'post', params);
    },
  },
  // 商户管理
  merchant: {
    // 商户（用户）列表
    listClient(params) {
      return request("/client/listClient", 'post', params);
    },
  },
  //数据表管理
  dataSheet: {
    //表管理列表
    listClientTableByPage(params) {
      return request("/client/table/listClientTableByPage", 'post', params);
    },
    //表管理添加
    createClientTable(params) {
      return request("/client/table/createClientTable", 'post', params);
    },
    //表管理删除
    deleteClientTable(params) {
      return request("/client/table/deleteClientTable", 'post', params);
    },
  },
  //表数据管理
  dataTable: {
    //表数据列表
    listClientTableData(params) {
      return request("/client/table/listClientTableData", 'post', params);
    },
    //表数据列表
    selectClientTable(params) {
      return request("/client/table/selectClientTable", 'post', params);
    },
    //表数据删除
    deleteDoc(params) {
      return request("/client/table/deleteDoc", 'post', params);
    },
    //表数据更新
    updateDoc(params) {
      return request("/client/table/updateDoc", 'post', params);
    },
    //表数据导出
    exportTableData(params) {
      return request("/client/table/exportTableData", 'get', params ,true);
    },
    //表数据导入
    importClientData(params) {
      return request("/client/table/importClientData", 'post', params);
    },
    //下载模板和导出数据
    downloadExcelTemplate(params) {
      return request("/client/table/downloadExcelTemplate", 'get', params ,true);
    },
    //导入数据
    importClientData(params) {
      return request("/client/table/importClientData", 'post', params);
    },
    //字段列表
    getTableColumnList(params) {
      return request("/client/table/getTableColumnList", 'post', params);
    },
  },
  // 外呼管理
  outbound: {
    //通话记列表
    listCallLogByPage(params) {
      return request("/call/log/listCallLogByPage", 'post', params);
    },
    //通话记对话详情
    listSceneLogByLogId(params) {
      return request("/scene/log/listSceneLogByLogId", 'post', params);
    },
    //  呼叫名单 录列表
    listCallDataByPage(params) {
      return request("/call/data/listCallDataByPage", 'post', params);
    },
    //任务管理 列表
    listCampaignByPage(params) {
      return request("/call/campaign/listCampaignByPage", 'post', params);
    },
    //任务管理 列表模板下载
    downloadTemplate(params) {
      return request("/call/campaign/downloadTemplate", 'get', params,true);
    },
    //任务管理 清空数据
    clearData(params) {
      return request("/callTask/clearData", 'post', params);
    },
    //任务管理 添加
    addCampaign(params) {
      return request("/call/campaign/addCampaign", 'post', params);
    },
    //任务管理 查询可用号码列表
    listMobileByAccess(params) {
      return request("/client/listMobileByAccess", 'post', params);
    },
    //任务管理 修改
    updateCampaign(params) {
      return request("/call/campaign/updateCampaign", 'post', params);
    },
    //语义引擎列表
    listSemanticProvider(params) {
      return request("/semantic/provider/listSemanticProvider", 'post', params);
    },
    //查询启用和重复发布的场景列表
    listSceneByState(params) {
      return request("/scene/listSceneByState", 'post', params);
    },
    //修改
    updateCampaignStatus(params) {
      return request("/call/campaign/updateCampaignStatus", 'post', params);
    },
    //呼叫统计列表
    statCallData(params) {
      return request("/call/campaign/statCallData", 'post', params);
    },
    //呼叫名单导出
    exportCallData(params) {
      return request("/call/data/exportCallData",'get', params,true);
    },
    //活动列表
    listCampaign(params) {
      return request("/call/campaign/listCampaign", 'post', params);
    },
    //活动列表
    listInbound(params) {
      return request("/inbound/listInbound", 'post', params);
    },
    //呼入管理列表
    listInboundIdByPage(params) {
      return request("/inbound/listInboundIdByPage", 'post', params);
    },
    //  呼入管理
    listInboundDataByPage(params) {
      return request("/inboundData/listInboundDataByPage", 'post', params);
    },
    //新增呼入
    addInbound(params) {
      return request("/callTask/addTask", 'post', params);
    },
    //检查呼入是否重复使用同一个号码
    checkInboundMobile(params) {
      return request("/inbound/checkInboundMobile", 'post', params);
    },

    //编辑呼入
    updateInbound(params) {
      return request("/callTask/updateTask", 'post', params);
    },

    //更新呼入状态
    updateInboundStatus(params) {
      return request("/callTask/updateTaskStatus", 'post', params);
    },
    //上传语音文件
    importWav(params) {
      return request("/inbound/importWav", 'post', params);
    },
    //统计
    taskStatistics(params) {
      return request("/call/campaign/taskStatistics", 'post', params);
    },
    //导入记录
    listCallDataImportLogByPage(params) {
      return request("/call/data/listCallDataImportLogByPage", 'post', params);
    },
    //查看记录
    listMobile(params) {
      return request("/call/data/listMobile", 'post', params);
    },
    //下载记录
    exportMobile(params) {
      return request("/call/data/exportMobile", 'get', params, true);
    },
    //  队列管理表头
    getSceneVariable(params) {
      return request("/call/data/getSceneVariable", 'post' , params);
    },
    //  IVR下拉数据
    listScene(params) {
      return request("/scene/listScene", 'post', params);
    },
    //  获取外呼任务列表
    listTaskByPage(params) {
      return request("/callTask/listTaskByPage", 'post', params);
    },
  },
  //通话详单
  dataquery: {
    //外呼列表
    voicetalkList(data) {
      return request('/dataquery/voicetalk/list', 'post', data)
    },
    //坐席列表
    attendLogList(data) {
      return request('/attendLog/list', 'post', data)
    },
    //通话详单-AI对话详情
    voicetalkAiList(data) {
      return request(`/dataquery/voicetalk/ai/${data}`, 'post')
    },
  },
  //坐席角色
  role: {
    //列表
    list(data) {
      return request('/attend/role/list', 'post', data)
    },
    //新增
    post(data) {
      return request(`/attend/role/post`, 'post', data)
    },
    //修改
    put(data) {
      return request(`/attend/role/put`, 'put', data)
    },
    //删除
    del(data) {
      return request(`/attend/role/del`, 'post', data)
    },
    //角色权限
    permissionsList(data) {
      return request(`/attend/role/permissions/list`, 'post', data)
    },
    //设置权限
    permissionsPost(data) {
      return request(`/attend/role/permissions/post`, 'post', data)
    },
    // //获取所有菜单列表
    // sysMenuList(data) {
    //   return request('/attend/role/permissions/list', 'post', data)
    // },
  },
  logs:{
    //导入记录
    callDataImportLog(data){
      return request(`/callDataImportLog/list`, 'post', data)
    },
    //操作日志记录
    operationLog(data){
      return request(`/operationLog/list`, 'post', data)
    },
  },
}
