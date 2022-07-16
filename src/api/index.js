// 将四个模块请求的接口函数统一暴露
import * as trademark from './product/trademark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

// 权限管理相关
import permission from './acl/permission'
import role from './acl/role'
import * as user from './acl/user'

// 对外暴露
export default {
    trademark,
    attr,
    sku,
    spu,
    permission,
    role,
    user
}