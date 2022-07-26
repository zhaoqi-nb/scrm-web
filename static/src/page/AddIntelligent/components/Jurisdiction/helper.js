/* eslint-disable*/

import { cloneDeep } from 'lodash'

export const RADIO = [{ title: '全部成员', key: 1 }, { title: '指定成员', key: 2 }, { title: '仅自己', key: 3 }];
export const options = [{ label: '仅查看', value: 1 }, { label: '可编辑', value: 2 }]
export const initStaffData = (datas) => {
    let departList = []
    let obj = {};
    if (!datas || !datas.length) return departList;
    const resultData = [];
    const formaterMemberInfoList = (data) =>
        cloneDeep(data).map((v) => {
            const { memberInfoList, name, departName, id, qywxDepartName } = v
            v.key = id
            v.value = id
            v.title = departName || name || qywxDepartName
            obj[id] = v;
            v.label = departName || name || qywxDepartName
            if (name) {
                resultData.push(v);
            }
            // v.disabled = !permissionsFlag
            if (memberInfoList) v.children = formaterMemberInfoList(memberInfoList)
            // else v.children = []
            return v
        })
    departList = formaterMemberInfoList(datas)
    return { departList, resultData, enumObj: obj }
}

