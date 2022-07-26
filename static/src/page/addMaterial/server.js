/* eslint-disable*/
import Server from '../../plugin/Server';

class Api extends Server {
    // 获取群列表
    // getGroupData(data = {}) {
    //     return this.HttpPost({
    //         url: '/api/scrm-web/scrm-basic/groupInfo/queryGroupListByPage',
    //         data,
    //     })
    // }
    // export const TYPE = {
    //     6: '文字',
    //     2: '图片',
    //     0: '文件',
    //     3: '视频',
    //     5: '链接',
    // }
    getGroupList(data = {}) {
        return this.Http({
            url: '/api/scrm-web/scrm-material/category/categorylist',
            data,
        })
    }

    addGroupList(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-material/category/save',
            data,
        })
    }

    addRequest(data = {}, type) {
        return this.HttpPost({
            url: `/api/scrm-web/scrm-material/${type}/save`,
            data,
        })
    }


}

export default new Api();
