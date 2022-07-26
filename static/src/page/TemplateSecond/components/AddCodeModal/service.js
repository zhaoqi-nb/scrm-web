/* eslint-disable*/
import Server from '../../../../plugin/Server';

class Api extends Server {

    submitData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupActivityCodeqywxRef/saveQWActivityCode',
            data,
        })
    }

}

export default new Api();
