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