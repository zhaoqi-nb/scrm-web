/* eslint-disable*/

import Api from './server'

export const initSelectData = (data) => {
    const _data = data?.map((item) => ({
        ...item,
        label: item?.name || '',
        value: item?.id || '0'
    }))
    return _data;
}
export const REQUEST = {
    6: 'text',
    2: 'poster',
    0: 'file',
    3: 'video',
    5: 'link',
}
export const VIEW = {
    2: 'img',
    0: 'file',
    3: 'video',
    5: 'link',
}
export const RULES = [
    {
        required: true,
        message: '不能存在空项!',
    },
]
export const TYPE = {
    'img': { accept: 'image/jpeg,image/jpg,image/png', key: 'picture', titleRender: '图片支持10M以内，jpg/png 格式', size: 10 },
    'file': {
        key: 'text',
        titleRender: '类型支持(PDF、PPT、文档、表格大小在20M以内)',
        size: 20,
        accept: [
            'application/pdf',
            'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel, application/x-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ]
    },
    'video': {
        key: 'text',
        titleRender: '支持MP4类型,文件大小10M以内',
        size: '10',
        accept: 'video/*'
    },
    'link': {
        accept: 'image/jpeg,image/jpg,image/png',
        size: 10
    }
}

export const compute = (name) => {
    let data = name.split('.');
    let str = data?.[data.length - 1] || ''
    if (str === 'doc' || str === 'docx') {
        return 0
    } else if (str === 'xls' || str === 'xlsx') {
        return 1
    } else if (str === 'pdf') {
        return 3
    } else if (str === 'ppt' || str === 'pptx') {
        return 2
    } else {
        return null
    }
}
// export const TYPE = {
//     6: '文字',
//     2: '图片',
//     0: '文件',
//     3: '视频',
//     5: '链接',
// }

// export const addServer = async (data, type) => {
//     return new Promise(async (resolve, reject) => {
//         let requestObj = {}
//         if (type === '6') {
//             const res = await Api.addText(data);
//             requestObj = res;
//         } else if (type === '2') {
//             const res = await 
//         }
//         resolve(requestObj);
//         reject(requestObj)
//     })
//     if (type === '6') {

//     }
// }
