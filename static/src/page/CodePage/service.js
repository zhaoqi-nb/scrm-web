/* eslint-disable*/
import Server from '../../plugin/Server';

class Api extends Server {
    getDeital(id) {
        return this.Http({
            url: `/api/scrm-web/scrm-basic/activity/api/noAuth/getInfo/${id}`,
        })
    }

}

export default new Api();
