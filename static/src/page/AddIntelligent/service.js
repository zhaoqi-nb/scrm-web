/* eslint-disable*/
import Server from '../../plugin/Server';

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
    getStaffData(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/getMemberList',
            data,
        })
    }
    getPerson(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/qywx-market/smartMarketing/queryCount',
            data,
        })
    }

    saveMarketing(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/qywx-market/smartMarketing/save',
            data,
        })
    }

    getDetail(data = '') {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/queryById/${data}`,
        })
    }

    queryAllDepartAndAllMemberAddRoleBoundary() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
        })
    }

    saveOrUpdate(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/qywx-market/bulkMessage/saveOrUpdate',
            data,
        })
    }
    getVisibleData(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/friendCircleInfo/getFriendCircleEstimateNum',
            data
        })
    }
    //获取群主
    getMainGroupDepartTree(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/departInfo/getMainGroupDepartTree',
            data,
        })
    }


}

export default new Api();

