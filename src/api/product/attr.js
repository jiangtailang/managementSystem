// 平台属性管理模块相关的接口

import request from '@/utils/request'

// 获取一级分类数据
// /admin/product/getCategory1  get
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

// 获取二级分类数据
// /admin/product/getCategory2/{category1Id}  get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级分类数据
// /admin/product/getCategory3/{category2Id}  get
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 获取商品基础属性
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 删除平台属性
// /admin/product/deleteAttr/{attrId} delete
export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })

// 添加修改并保存平台属性
// /admin/product/saveAttrInfo  post
/* 
data:{
    attrName: "",  //属性名
    attrValueList: [  //属性值，因为属性值可以有多个，因此用数组，每一个属性值都是一个对象需要attrId、valueName
        attrId: 0,   //属性的id
        valueName: ""  //属性值
    ],  
    categoryId: 0,  //三级分类的id
    categoryLevel: 3, //三级分类（服务器也需要区分几级id
}
*/
export const reqSaveAttrInfo = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })