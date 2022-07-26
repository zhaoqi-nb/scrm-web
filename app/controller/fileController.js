const ServiceController = require('./serviceController'),
    apiConfig = require('../../config/apiConfig');

class fileController extends ServiceController {
    // 上传文件
    async fileUpload() {
        const { ctx, config } = this;
        // const file = await this.ctx.getFileStream()
        let result = await ctx.service.uploadFiler.filer(ctx, config, apiConfig.FILEUPLOAD);
        this.returnData(result);
    }
}

module.exports = fileController;