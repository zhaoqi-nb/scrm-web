/* eslint-disable*/
import Server from '../../../../plugin/Server';

class Api extends Server {

    getTableData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupInfo/queryGroupList',
            data,
        })
    }

}

export default new Api();
