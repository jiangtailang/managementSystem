// Spu管理相关接口
import request from '@/utils/request'

// 获取spu列表数据的接口
// /admin/product/{page}/{limit}  get  三个参数：page，limit，category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}?category3Id=${category3Id}`, method: 'get' })

// 获取某一个SPU信息
// /admin/product/getSpuById/{spuId}  get
export const reqSpuInfo = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 品牌的数据需要发请求
// /admin/product/baseTrademark/getTrademarkList  get
export const reqTrademarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取SPU图片
// /admin/product/spuImageList/{spuId}  get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台中全部的销售属性（3个）
// /admin/product/baseSaleAttrList  get
export const reqSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 保存添加和修改的spu  post 
// 对于修改或者添加spu，携带给服务器参数大致一样，惟一的区别就是携带的参数是否有id
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 携带的参数带有id---修改spu
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        // 携带的参数不带id---添加spu
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

// 确认删除spu
// /admin/product/deleteSpu/{spuId}  delete
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })