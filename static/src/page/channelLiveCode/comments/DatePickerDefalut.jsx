import { DatePicker } from 'antd'
import React, { useState, useEffect } from 'react'
import moment from 'moment'

const { RangePicker } = DatePicker

function DatePickerDefalut(props) {
  const { onChange } = props
  const [dates, setDates] = useState(null)
  const [hackValue, setHackValue] = useState([...props.value])
  const [value, setValue] = useState(null)

  const disabledDate = (current) => {
    // 后期改造 isAstrict=true 执行下面逻辑，如果isAstrict=false 不限制时间范围。
    if (!dates) {
      return false
    }
    // 后期改造 type =‘days’，diffNum=30   允许选择的时间跨度

    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30
    const toolNow = moment().subtract(1, 'days').diff(current) < 0

    return !!tooEarly || !!tooLate || !!toolNow
  }
  useEffect(() => {
    setHackValue(props.value)
  }, [props.value])

  const onOpenChange = (open) => {
    if (open) {
      setHackValue([null, null])
      setDates([null, null])
    } else {
      setHackValue(null)
    }
  }

  return (
    <div className={props.className}>
      <RangePicker
        value={hackValue || value}
        disabledDate={disabledDate}
        onCalendarChange={(val) => setDates(val)}
        allowClear={false}
        onChange={(val) => {
          setValue(val)
          onChange && onChange(val)
        }}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export default DatePickerDefalut
