// 这个模块主要获取的是品牌管理的数据
// 引入axios（axios进行二次封装）
import request from '@/utils/request'

// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit} get
export const reqTrademarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 修改品牌
// /admin/product/baseTrademark/update  put   携带三个参数：id、品牌名称：tmName、品牌LOGO：logoUrl
// 切记：对于修改某一品牌的操作，携带的参数需要带上ID，你需要告诉服务器修改的是哪一个品牌

// 添加品牌
// /admin/product/baseTrademark/save  post  携带两个参数：品牌名称：tmName、品牌LOGO：logoUrl 
// 切记：对于添加的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成

export const reqAddOrUpdateTrademark = (tradeMark) => {
    // 如果携带ID，就是修改品牌
    if (tradeMark.id) {
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark })
    } else {
        // 添加品牌
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
    }
}

// 删除品牌
// /admin/product/baseTrademark/remove/{id} delete
export const reqDeleteTrademark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })