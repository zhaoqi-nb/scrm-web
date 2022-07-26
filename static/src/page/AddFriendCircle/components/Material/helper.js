export const initSelectData = (data) => {
    const _data = data?.map((item) => ({
        ...item,
        label: item?.name || '',
        value: item?.id || 0
    }))
    return _data;
}

const TYPEENUM = {
    2: '图片',
    3: '视频',
    5: '链接',
}
const TABLE = {
    title: '素材标题',
    type: '素材类型'
}
export const initColumns = (data, type) => {
    const columns = Object.keys(TABLE)?.map((item) => {
        const obj = {
            key: item,
            dataIndex: item,
            title: TABLE?.[item] || ''
        }
        if (item === 'type') {
            obj.render = () => TYPEENUM?.[type] || ''
        }
        return obj
    })
    const dataSource = data?.map((item) => ({ ...item, key: item?.id || '' }))
    return { columns, dataSource }
}
