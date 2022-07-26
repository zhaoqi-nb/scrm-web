'use strict';

import Server from '@plugin/Server';

class Api extends Server {
    async queryAllDepartAndAllMemberAddRoleBoundary() {
        return await this.Http({
            url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
        })
    }
}

export default new Api();
