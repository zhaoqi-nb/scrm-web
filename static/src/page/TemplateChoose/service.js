/* eslint-disable*/
import Server from '../../plugin/Server';

class Api extends Server {

    addCode(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-basic/groupActivityCode/saveGroupActivityCode',
            data,
        })
    }

}

export default new Api();
