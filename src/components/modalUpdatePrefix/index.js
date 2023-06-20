import React, { useState } from 'react'
import { Form, Modal, Button, Space, message, Input } from 'antd'
import { httpClient } from 'HttpClient.js'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const ModalUpdatePrefix = (props) => {
  const { visible, cancelModalUpdate, dataPrefixId, dataPrefixName } = props
  const [form] = Form.useForm()
  const [newPrefixName, setNewPrefixName] = useState('')

  const handleCancel = (event) => {
    cancelModalUpdate(false)
  }

  const onFinish = () => {
    const params = {
      prefix_id: dataPrefixId,
      prefix_name: newPrefixName,
    }
    console.log(`params`, params)
    httpClient
      .put('/update_prefix', params)
      .then(function (response) {
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
          title="แก้ไขข้อมูลคำนำหน้า"
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
            <Form.Item name="prefix_id" label="รหัสคำนำหน้า">
              <Input
                style={{ width: 300 }}
                disabled
                defaultValue={dataPrefixId}
              />
            </Form.Item>
            <Form.Item
              name="prefix_name"
              label="คำนำหน้า"
              rules={[{ required: true, message: 'กรุณากรอกคำนำหน้า!' }]}
            >
              <Input
                style={{ width: 300 }}
                onChange={(e) => setNewPrefixName(e.target.value)}
                defaultValue={dataPrefixName}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default ModalUpdatePrefix
