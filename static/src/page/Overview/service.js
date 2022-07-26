/* eslint-disable*/
import Server from '../../plugin/Server';

class Api extends Server {
    getStatisticInfo(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/statistical/data/dataSummary',
            data,
        })
    }
    getMap(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/statistical/data/regionProvinceDataChart',
            data,
        })
    }

    getChartsData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/statistical/data/regionDataChart',
            data,
        })
    }

    getTableData(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/statistical/data/regionDataList',
            data,
        })
    }

    getExport(data = {}) {
        return this.HttpPost({
            url: '/api/scrm-web/scrm-service/statistical/data/exportRegionDataList',
            data,
        })
    }

}

export default new Api();
