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
export const deleteNote = (id)=>{
    return request.get('/notebook/deleteNoteBook?id='+id)
}

//获取单个笔记本的信息
export const getNoteBook = (id,reqResource)=>{
    return request.get('/notebook/getNoteBook?id='+id +'&reqResource='+reqResource)
}

//获取笔记本中的所有笔记
export const getNotes = (id,reqResource)=>{
    return request.get('/note/list?id='+id +'&reqResource='+reqResource)
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