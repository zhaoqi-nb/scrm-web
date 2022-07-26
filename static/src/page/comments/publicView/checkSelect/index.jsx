import React, { useState } from 'react'
import { Select, Checkbox } from 'antd'

const { Option } = Select
function CheckSelect(props) {
  const { list, onChange, defaultValue = [] } = props
  const [selectList, setSelectList] = useState(defaultValue)
  const setOnChange = (values) => {
    setSelectList(values)
    onChange && onChange(values)
  }
  const checkedFn = (item) => {
    if (selectList && selectList.length > 0 && selectList.indexOf(item) !== -1) {
      return true
    }
    return false
  }
  return (
    <Select mode="multiple" {...props} onChange={setOnChange} optionLabelProp="label">
      {list.map((item) => (
        <Option key={item.value} value={item.value} label={item.label}>
          <div className="flex-box" aria-label={item.label}>
            <div className="mr5">
              <Checkbox checked={checkedFn(item.value)} disabled={item.disabled} />
            </div>
            <div>{item.Labelrender ? item.labelRender() : item.label}</div>
          </div>
        </Option>
      ))}
    </Select>
  )
}
export default CheckSelect
