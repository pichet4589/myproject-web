import React, { useState } from 'react'
import { Form, Modal, Button, Space, message, Input } from 'antd'

import { httpClient } from 'HttpClient.js'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const ModalUpdateCategory = (props) => {
  const { visible, cancelModalUpdate, dataCategoryId, dataCategoryName } = props
  const [form] = Form.useForm()

  const [newCategoryName, setNewCategoryName] = useState('')

  const handleCancel = (event) => {
    cancelModalUpdate(false)
  }

  const onFinish = (values) => {
    const params = {
      category_id: dataCategoryId,
      category_name: newCategoryName,
    }
    console.log(`params`, params)
    httpClient
      .put('/update_category', params)
      .then(function (response) {
        console.log(`response`, response.status)
        const code = response.status
        if (code === 200) {
          message.success('อัพเดทข้อมูลสำเร็จ')
          setTimeout(function () {
            window.location.reload()
          }, 3000)
        } else {
          message.error('อัพเดทข้อมูลไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  return (
    <>
      <div className="test">
        <Modal
          title="แก้ไขข้อมูลประเภทจดมหาย"
          width="600px"
          visible={visible}
          onCancel={handleCancel}
          footer={[
            <Space>
              <Button className="btnCancel" key="close" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button type="primary" onClick={onFinish}>
                บันทึก
              </Button>
            </Space>,
          ]}
        >
          <Form
            form={form}
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
          >
            <Form.Item name="prefix_id" label="รหัสประเภท">
              <Input
                style={{ width: 300 }}
                disabled
                defaultValue={dataCategoryId}
              />
            </Form.Item>
            <Form.Item
              name="prefix_name"
              label="ชื่อประเภท"
              rules={[{ required: true, message: 'กรุณากรอกประเภท!' }]}
            >
              <Input
                style={{ width: 300 }}
                onChange={(e) => setNewCategoryName(e.target.value)}
                defaultValue={dataCategoryName}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
     
    </>
  )
}

export default ModalUpdateCategory
