/* eslint-disable*/
import Server from '../../plugin/Server';

class Api extends Server {

    getCreatorData(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary',
            data,
        })
    }
    getCodeTable(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupActivityCode/queryGroupActivityCodePage',
            data,
        })
    }

    deleteCodeTable(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupActivityCode/deleteByKey/${id}`,
        })
    }

    getDetailFirst(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupActivityCode/getGroupActivityCodeInfoById/${id}`,
        })
    }
    getDetailBanner(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupActivityCode/getDataOverview/${id}`,
        })
    }

    getChartsData(data) {
        return this.HttpPost({
            url: `/api/scrm-web/scrm-basic/groupChangeRecord/getActivityGroupRecordByDate`,
            data,
        })
    }

    getCodeSelect(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupActivityCodeqywxRef/getQywxRefListByGroupActivityId/${id}`,
        })
    }

    getGroupSelect(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupInfo/getGroupListByGroupActivityId/${id}`,
        })
    }
    getTableData(data) {
        return this.HttpPost({
            url: `/api/scrm-web/scrm-basic/groupChangeRecord/groupActivityStatisticsByGroup`,
            data
        })
    }
}

export default new Api();
