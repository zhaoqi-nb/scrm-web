import React, { useState, useEffect } from 'react'
import { Form, Button, message, TimePicker, Input } from 'antd'
import RsIcon from '@RsIcon'
import { difference } from 'lodash'
import moment from 'moment'
import CheckSelect from '../../comments/publicView/checkSelect'
import DragSortingUpload from '../../comments/publicView/upload'
import PhoneView from '../../comments/publicView/phoneView'

const weekList = [
  { label: '星期一', value: '1' },
  { label: '星期二', value: '2' },
  { label: '星期三', value: '3' },
  { label: '星期四', value: '4' },
  { label: '星期五', value: '5' },
  { label: '星期六', value: '6' },
  { label: '星期日', value: '7' },
]

const timeForMat = 'HH:mm'
const fieldKey = 'splitTimeRefVos'
// 验证时间段的方法
const timeCheckOut = (list) => {
  // pass 表示验证通过
  const validatorObj = { pass: true, info: {} }

  list.forEach((item, index) => {
    // 判断是否都有值
    if (item.weeks && item.weeks.length > 0 && item.timeList && item.timeList.length > 0) {
      list.forEach((nextItem, newIndex) => {
        const weeksList = difference(item.weeks, nextItem.weeks)
        if (index !== newIndex) {
          // 不和自己比
          if (weeksList && weeksList.length > 0) {
            // 表示选择 周几有重合
            // 表示日期有重合
            const itemTimeList = item.timeList.map((itemTime) => moment(itemTime).format(timeForMat))
            const nextItemTimeList = nextItem.timeList.map((itemTime) => moment(itemTime).format(timeForMat))
            if (
              (itemTimeList[0] < nextItemTimeList[0] && itemTimeList[1] > nextItemTimeList[0]) ||
              (itemTimeList[0] < nextItemTimeList[1] && itemTimeList[1] > nextItemTimeList[1])
            ) {
              // 时间区间比较
              validatorObj.pass = false
              validatorObj.info = { index, newIndex }
            }
          }
        }
      })
    }
  })
  return validatorObj
}

function FormItemList(props) {
  const { formRef, listData } = props
  // 预览对象
  const [viewList, setViewList] = useState([[]])
  // 文件对象
  const [files, setFiles] = useState([[]])
  // message 操作对象
  const [messageList, setMessageList] = useState([])

  // const [textValueData, setTextValueData] = useState({})

  const [isValidator, setIsValidator] = useState(true)

  // 编辑的时候处理
  useEffect(() => {
    const listDataFormat = () => {
      const setObj = {}
      const fileDataList = []
      const messageDataList = []
      const newList = listData.map((item) => {
        const fileListItem = item.attachmentContents ? JSON.parse(item.attachmentContents) : []
        fileDataList.push(fileListItem)
        messageDataList.push(item.message)
        return {
          ...item,
          weeks: item.weeks.split(','),
          message: item.message,
          timeList: [moment(item.startingTime, timeForMat), moment(item.endTime, timeForMat)],
          fileList: fileListItem,
        }
      })
      setFiles(fileDataList)
      setViewList(fileDataList)
      setMessageList(messageDataList)

      setObj[fieldKey] = newList
      formRef.current.setFieldsValue(setObj)
    }
    if (listData && listData.length > 0) {
      listDataFormat()
    }
  }, [listData])

  // 更新form 表单数据
  const optionDataList = (index, value, key) => {
    const setObj = {}
    const list = formRef.current.getFieldValue(fieldKey)
    if (list && list.length > 0) {
      const newList = list.map((item, itemIndex) => {
        if (itemIndex == index) {
          item[key] = value
        }
        return item
      })
      setObj[fieldKey] = newList
      formRef.current.setFieldsValue(setObj)
    }
  }

  // 添加前置操作
  const addFormItem = () => {
    let optionList = [...viewList]
    optionList.push([])
    setViewList(optionList)

    optionList = [...files]
    optionList.push([])
    setFiles(optionList)

    optionList = [...messageList]
    optionList.push('')
    setMessageList(messageList)
  }
  // 删除前置操作
  const removeFormItemList = (index) => {
    // 预览的处理
    let optionList = [...viewList]
    optionList.splice(index, 1)
    setViewList(optionList)
    // 文件的处理
    optionList = [...files]
    optionList.splice(index, 1)
    setFiles(optionList)
    // 文本的处理
    optionList = [...messageList]
    optionList.splice(index, 1)
    setMessageList(messageList)
  }
  // 预览图数据更新
  const updateViewList = (index, list) => {
    const optionList = [...viewList]
    optionList[index] = list
    setViewList(optionList)
  }
  // 图数据更新
  const updateFilesList = (index, list) => {
    const optionList = [...files]
    optionList[index] = list
    setFiles(optionList)
  }
  //
  const onFileChange = (index, list, key) => {
    // 添加附件 更新操作完成之后每次回传的数据
    updateViewList(index, list)
    updateFilesList(index, list)
    // 预览视图
    optionDataList(index, list, key)
  }
  const onDataMessge = (index, e, key) => {
    // const textData = { ...textValueData }
    // textData[index] = e
    // setTextValueData(textData)
    const messageListNew = [...messageList]
    messageListNew[index] = e
    setMessageList([...messageListNew])
    optionDataList(index, e, key)
  }

  const validatorFn = ({ field }) => {
    // 整个数据验证，时间段验证
    // 添加新的item时候不需要 验证所以isValidator设置成false 处理完以后isValidator 设置成true
    // 验证数据

    const list = formRef.current.getFieldValue(field)
    if (list && list.length > 0) {
      if (isValidator) {
        if (list && list.length > 1) {
          let conentText = '验证失败:'
          const validatorObj = timeCheckOut(list)
          if (!validatorObj.pass) {
            conentText = `${conentText}分时段欢迎语设置第${validatorObj.info.index + 1}项和第${
              validatorObj.info.newIndex + 1
            }项 时段设置冲突请修改`
            message.error(conentText)
            return Promise.reject(new Error(conentText))
          }
        }
      }
    } else {
      message.error({ content: '至少添加一项欢迎语项目!', duration: 2 })
      return Promise.reject(new Error('至少添加一项欢迎语项目'))
    }

    setIsValidator(true)
    return Promise.resolve()
  }
  // async 如果被删除 ，不会触发onFinish 验证通过
  return (
    <Form.List
      name="splitTimeRefVos"
      rules={[
        {
          validator: async (_, names) => validatorFn(_, names),
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }, index) => (
            <div key={key}>
              <div
                className="full-w padt8 padb8 mb20 mt30 flex-box middle-a flex-between"
                style={{ borderBottom: '1px dashed #E1E8F0' }}
              >
                时段{index + 1}
                {fields.length > 1 ? (
                  <RsIcon
                    type="icon-shanchu"
                    className="f18"
                    onClick={() => {
                      removeFormItemList(index)
                      remove(name)
                    }}
                  />
                ) : null}
              </div>
              <Form.Item required={false} label="发送日期">
                <Form.Item
                  {...restField}
                  name={[name, 'weeks']}
                  rules={[
                    {
                      required: true,
                      message: '选择日期',
                    },
                  ]}
                >
                  <CheckSelect placeholder="请选择" mode="multiple" list={weekList} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'timeList']}
                  rules={[
                    {
                      required: true,
                      message: '请选择时段',
                    },
                  ]}
                >
                  <TimePicker.RangePicker
                    placeholder={['请选择开始时间', '请选择结束时间']}
                    className="full-w"
                    format={timeForMat}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'message']}
                  className="textAreaItem"
                  rules={[
                    {
                      required: true,
                      message: '请添加一条欢迎语',
                    },
                  ]}
                >
                  <Input.TextArea
                    showCount
                    placeholder="请输入欢迎语"
                    // style={{ height: 248 }}
                    autoSize={{ minRows: 12, maxRows: 12 }}
                    // bordered
                    defaultValue={messageList[index]}
                    maxLength={300}
                    onChange={(e) => {
                      onDataMessge(index, e.target.value, 'message')
                    }}
                  />
                  <div className="pr mt-26">
                    <DragSortingUpload
                      files={files[index]}
                      key={index}
                      onChange={(e) => {
                        onFileChange(index, e, 'fileList')
                      }}
                    />
                    <div className="pa" style={{ right: '-300px', top: '-400px' }}>
                      <PhoneView messageValue={messageList[index]} list={viewList[index]} key={index} />
                    </div>
                  </div>
                </Form.Item>
              </Form.Item>

              <Form.ErrorList errors={errors} />
            </div>
          ))}
          <Form.Item>
            <div className="padt8 mt24" style={{ borderTop: '1px dashed #E1E8F0' }}>
              <Button
                type="text"
                className="text-link"
                onClick={() => {
                  // setIsValidator(false)
                  addFormItem()
                  add()
                }}
                icon={<RsIcon type="icon-tianjia" />}
              >
                添加分时段欢迎语
              </Button>
            </div>
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}

export default FormItemList
