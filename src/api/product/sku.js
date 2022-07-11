import request from '@/utils/request'

// 获取skuList  
// /admin/product/list/{page}/{limit}  get
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 下架
// /admin/product/cancelSale/{skuId}  get
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 上架
// /admin/product/onSale/{skuId}  get
export const reqOnsale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// 获取sku信息
// /admin/product/getSkuById/{skuId}  get
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })