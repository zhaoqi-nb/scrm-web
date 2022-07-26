import Server from '../../plugin/Server';

class Api extends Server {
    // 获取群列表
    getGroupData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/queryGroupListByPage',
            data,
        })
    }

    getSync() {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/groupInfo/groupAllSync',
        })
    }

    queryLabelList(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/labelGroupRef/list',
            data,
        })
    }

    getOwner(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/departInfo/getMainGroupDepartTree',
            data,
        })
    }

    hidTag(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupLabelRef/batchSave',
            data,
        })
    }

    getDetail(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupInfo/getByKey/${id}`
        })
    }

    getChartsData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/groupRecordStatistics',
            data,
        })
    }

    getTableData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/queryGroupMemberListByPage',
            data,
        })
    }

    updateRemark(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/updateGroupRemark',
            data,
        })
    }

    batchUpdateRegion(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/batchUpdateRegion',
            data,
        })
    }
}

export default new Api();
