import React, { useState } from 'react'
import { Modal } from 'antd'
import PhoneView from '../phoneView'

function TablePhoneView(props) {
  const { files, messageValue = '' } = props
  const [isModalVisible, setIsModalVisible] = useState(false)
  return files && files.length > 0 ? (
    <div className="flex-box middle-a">
      <div
        onClick={() => {
          setIsModalVisible(true)
        }}
        className="pointer"
      >
        {`共${files.length}条`}{' '}
        <span className="text-link padl8" style={{ textDecoration: 'underline' }}>
          预览
        </span>
      </div>
      <Modal
        visible={isModalVisible}
        title="预览"
        onCancel={() => {
          setIsModalVisible(false)
        }}
        footer={[]}
      >
        <div className="flex-box middle">
          <PhoneView messageValue={messageValue} list={files} />
        </div>
      </Modal>
    </div>
  ) : null
}

export default TablePhoneView
