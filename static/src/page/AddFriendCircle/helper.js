import { cloneDeep } from 'lodash'

export const initStaffData = (datas) => {
    let departList = []
    if (!datas || !datas.length) return departList;
    const resultData = [];
    const formaterMemberInfoList = (data) =>
        cloneDeep(data).map((v) => {
            const { memberInfoList, name, departName, id, qywxDepartName } = v
            v.key = id
            v.value = id
            v.title = departName || name || qywxDepartName
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
    return { departList, resultData }
}

export const RADIO = [
    { label: '立即发布', value: 1 },
    { label: '定时发布', value: 2 },
]
