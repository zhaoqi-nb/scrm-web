'use strict';

import Server from '@plugin/Server';

class Api extends Server {
    getStaffData() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
        })
    }

    getSWitch() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/friendCircleInfo/getFriendCircleRemind'
        })
    }

    changeSwitch(switchId) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/friendCircleInfo/updateMemberSwitchStatus/${switchId}`
        })
    }

    getTableData(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/friendCircleInfo/filterFriendCircleList',
            data
        })
    }

    getCancel(switchId) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/friendCircleInfo/cancelFriendCircleJobById/${switchId}`
        })
    }

    getDetailData(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/friendCircleInfo/getFriendCircleInfoById/${id}`
        })
    }

    getDetailTableData(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/friendCircleImplementInfo/friendCircleMemberSendStatusList',
            data
        })
    }

    getRemind(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/friendCircleImplementInfo/sendRemindToMember/${id}`
        })
    }

    getDiscuss(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/friendCircleImplementInfo/getFriendCircleMemberInteractDataById/${id}`
        })
    }
}

export default new Api();
