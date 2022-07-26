/* eslint-disable*/
import Server from '../../plugin/Server';

class Api extends Server {
    // 获取群列表
    getTableData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/qywx-market/smartMarketing/list',
            data,
        })
    }

    getOpen(data = '') {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/start/${data}`,
        })
    }

    getPause(data = '') {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/pause/${data}`,
        })
    }

    getDetail(data = '') {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/queryById/${data}`,
        })
    }

    getDelete(data = '') {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/delete/${data}`,
        })
    }

    getDataChartTrend(data = {}) {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/detail/dataChartTrend`,
            data
        })
    }

    getDataSummary(data = {}) {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/detail/dataSummary`,
            data
        })
    }

    getQueryActionList(data = {}) {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/detail/queryActionList`,
            data
        })
    }

    getBannerData() {
        return this.HttpPost({
            url: `/api/scrm-web/qywx-market/smartMarketing/summary`,
        })
    }

    // 群发，群群发详情
    getBulkMessageDetail(data = {}) {
        return this.Http({
            url: '/api/scrm-web/qywx-market/bulkMessage/detail',
            data
        })
    }

    // 朋友圈详情
    getFriendCircleInfoById(id) {
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
}

export default new Api();
