import React, { useState } from 'react'
import { Modal, message } from 'antd'

function Index(props) {
  const { children, onOk, onCancel, visible, title, okText, cancelButtonProps, okButtonProps = {}, type, width, messageText = '操作成功' } = props
  const [confirmLoading, setConfirmLoading] = useState(false)

  return (
    <Modal
      width={width}
      visible={visible}
      onOk={() => {
        setConfirmLoading(true)
        onOk()
          .then((res) => {
            onCancel()
            message.success(res || messageText)
          })
          .finally(() => {
            setConfirmLoading(false)
          })
      }}
      onCancel={onCancel}
      title={title}
      cancelButtonProps={cancelButtonProps || { type: 'text' }}
      okText={okText || (type != 'delete' ? '确定' : '删除')}
      confirmLoading={confirmLoading}
      okButtonProps={type == 'delete' ? { ...okButtonProps, danger: true } : okButtonProps}
    >
      {children}
    </Modal>
  )
}

export default Index
