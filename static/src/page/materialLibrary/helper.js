import { cloneDeep } from 'lodash'

export const TYPENUM = [
    { key: 0, name: '企业素材' },
    { key: 1, name: '个人素材' },
]

export const dataSourceFormat = (datas) => {
    let departList = []
    if (!datas || !datas.length) return departList
    const formaterMemberInfoList = (data) =>
        cloneDeep(data).map((v) => {
            const { subDepartList, departName, id } = v
            v.key = id
            v.value = id
            v.title = departName
            v.label = departName
            // v.disabled = !permissionsFlag
            if (subDepartList) v.children = formaterMemberInfoList(subDepartList)
            // else v.children = []
            return v
        })
    departList = formaterMemberInfoList(datas)
    return departList
}
