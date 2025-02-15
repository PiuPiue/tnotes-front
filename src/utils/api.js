import request from '@/utils/request'



//登录
export const login = (user)=>{
    return request.post('/user/login',user)
}

//登出
export const logout = ()=>{
    return request.get('/user/logout')
}


//获取登录人的笔记本信息
export const getNotebooks = ()=>{
    return request.get('/notebook/list')
}


//新增或修改笔记本
export const saveOrUpdateNote = (notebook)=>{
    return request.post('/notebook/addOrUpdateNoteBook',notebook)
}

//删除笔记本
export const deleteNoteBook1 = (id,deleteType)=>{
    return request.get('/notebook/deleteNoteBook?id='+id +'&deleteType='+deleteType)
}

//获取单个笔记本的信息
export const getNoteBook = (id,reqResource)=>{
    return request.get('/notebook/getNoteBook?id='+id +'&reqResource='+reqResource)
}

//获取笔记本中的所有笔记
export const getNotes = (id,reqResource)=>{
    return request.get('/note/list?id='+id +'&reqResource='+reqResource)
}

//生成笔记本协作链接
export const getShareCode = (notesShareDto)=>{
    return request.post('/notebook/getShareCode',notesShareDto)
}

//笔记本加入协作
export const joinNoteBook = (notesCodeAuthDto)=>{
    return request.post('/notebook/authCode',notesCodeAuthDto)
}

//修改权限
export const changeUserPermission = (permission)=>{
    return request.post('/notebook/changePermission',permission)
}

//删除协作者
export const deleteCoopUser = (userId,notebookId)=>{
    return request.get('/notebook/deleteCoopUser?userId='+ userId +'&notebookId='+notebookId)
}

//内容的保存
export const addNoteContent = (note)=>{
    return request.post('/note/addNoteContent',note)
}
//笔记的创建
export const addNote = (note)=>{
    return request.post('/note/addNote',note)
}

//获取笔记的内容
export const getNote = (id,reqResource)=>{
    return request.get('/note/getNote?id='+id +'&reqResource='+reqResource)
}

//删除笔记或随笔
export const deleteNote = (id)=>{
    return request.get('/note/deleteNote?id='+id)
}

//获取笔记的所有协作者
export const getNoteCoopUsers = (id)=>{
    return request.get('/note/getNoteCoopUser?id='+id)
}

//笔记权限修改
export const changeNotePermission = (permission)=>{
    return request.post('/note/changePermission',permission)
}

//删除笔记权限
export const deleteNotePermission = (userId,noteId)=>{
    return request.get('/note/deletePermission?userId='+userId +'&noteId='+noteId)
}

//生成笔记协作连接
export const getNoteShareCode = (notesShareDto)=>{
    return request.post('/note/getShareCode',notesShareDto)
}

//笔记协作接入
export const joinNote = (notesCodeAuthDto)=>{
    return request.post('/note/authCode',notesCodeAuthDto)
}

//获取协作的笔记
export const getCoopNote = ()=>{
    return request.get('/note/getCoopNote')
}

//笔记的修改
export const updateNote = (note)=>{
    return request.post('/note/updateNote',note)
}

//删除协作笔记
export const deleteCoopNote = (id)=>{
    return request.get('/note/deleteJoinNote?id='+id)
}


//随笔的新增
export const addEssay = (essay)=>{
    return request.post('/essay/add',essay)
}

//获取所有随笔
export const getEssays = ()=>{
    return request.get('/essay/list')
}

//删除随笔
export const deleteEssay = (id)=>{
    return request.get('/essay/delete?id='+id)
}

//获取单个随笔
export const getEssay = (id)=>{
    return request.get('/essay/get?id='+id)
}

//ai生成文章总结
export const getEssaySummary = (essay)=>{
    return request.post('/ai/summary',essay)
}


//文件合并
export const mergeFile = (file)=>{
    return request.post('/tcloud/merge',file)
}

//获取根目录下文件夹
export const getRootDir = ()=>{
    return request.get('/dict/list')
}

//根据id获取子文件夹及文件
export const getDir = (id)=>{
    return request.get('/dict/getChildDict?id='+id)
}

//新增文件夹
export const addDir = (parentId,name)=>{
    return request.get('/dict/createDict?parentId='+parentId +'&name='+name)
}

//预览文件
export const previewFile = (id)=>{
    return request.get('/tcloud/preview?id='+id)
}

//获取基本信息
export const getBaseInfo = ()=>{
    return request.get('/dict/getCloudInfo')
}

//修改文件名
export const updateFileName = (id,name)=>{
    return request.get('/dict/updateDict?id='+id +'&name='+name)
}

//删除文件
export const deleteFile = (id)=>{
    return request.get('/dict/deleteDict?id='+id)
}

//获取回收站文件
export const getRecycleFile = ()=>{
    return request.get('/dict/getDeletedDict')
}

//恢复文件夹问价
export const recoverFile = (id)=>{
    return request.get('/dict/recycleDict?id='+id)
}

//彻底删除
export const deleteFileCompletely = (id)=>{
    return request.get('/dict/completeDelete?id='+id)
}

//清空回收站
export const clearRecycleBin = ()=>{
    return request.get('/dict/clearRecycle')
}

//发送验证码
export const sendVerificationCode = (email)=>{
    return request.get('/user/sendAuthCode?email='+email)
}

//注册
export const register = (user)=>{
    return request.post('/user/register',user)
}

//修改个人资料
export const updateUserInfo = (user)=>{
    return request.post('/user/updateUser',user)
}

//发送密码验证码
export const sendPasswordVerificationCode = ()=>{
    return request.get('/user/sendPwdCode')
}

//修改密码
export const updatePassword = (user)=>{
    return request.post('/user/modifyPassword',user)
}


//发送解绑验证码
export const sendUnbindVerificationCode = ()=>{
    return request.get('/user/sendEmailCode')
}

//解绑邮箱
export const unbindEmail = (code)=>{
    return request.get('/user/unbindEmail?code='+code)
}

//修改邮箱
export const updateEmail = (user)=>{
    return request.post('/user/modifyEmail',user)
}

//发送新邮箱验证码
export const sendNewEmailVerificationCode = (email)=>{
    return request.get('/user/sendNewEmailCode?email='+email)
}