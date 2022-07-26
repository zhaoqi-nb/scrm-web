/* eslint-disable*/
import Server from '../../plugin/Server';
import { REQUEST } from './components/templateLibrary/helper'

class Api extends Server {
    // 获取群列表
    // getGroupData(data = {}) {
    //     return this.HttpPost({
    //         url: '/api/scrm-web/scrm-basic/groupInfo/queryGroupListByPage',
    //         data,
    //     })
    // }
    // export const TYPE = {
    //     6: '文字',
    //     2: '图片',
    //     0: '文件',
    //     3: '视频',
    //     5: '链接',
    // }
    getGroupList(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-material/category/categorylist',
            data,
        })
    }

    addGroupList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-material/category/save',
            data,
        })
    }

    deleteGroupList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-material/category/remove',
            data,
        })
    }

    getTableData(data = {}, type) {
        return this.HttpPost({
            url: `/api/scrm-web/scrm-material/${REQUEST?.[type] || ''}/page`,
            data,
        })
    }

    deletTableData(data = {}, type) {
        return this.HttpPost({
            url: `/api/scrm-web/scrm-material/${REQUEST?.[type] || ''}/remove`,
            data,
        })
    }
    queryAllDepartAndAllMemberAddRoleBoundary() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
        })
    }
}

export default new Api();
