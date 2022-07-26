/* eslint-disable*/
import Server from '../../plugin/Server';

class Api extends Server {

    getDetailTable(id = '') {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/groupActivityCode/getByKey/${id}`,
        })
    }
    getCreatorData(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary',
            data,
        })
    }
    addCode(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupActivityCode/saveGroupActivityCode',
            data,
        })
    }
    addGroupCode(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupActivityCodeRef/saveGroupCode',
            data,
        })
    }
    deleteFn(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupActivityCode/delete',
            data,
        })
    }

    stopFn(data) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupActivityCode/disabled',
            data,
        })
    }

}
export default new Api();

