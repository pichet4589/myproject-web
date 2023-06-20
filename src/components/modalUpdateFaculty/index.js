import React, { useState } from 'react'
import { Form, Modal, Button, Space, message, Input } from 'antd'
import { httpClient } from 'HttpClient.js'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const ModalUpdateFaculty = (props) => {
  const { visible, cancelModalUpdate, dataFacultyId, dataFacultyName } = props
  const [form] = Form.useForm()
  const [newFacultyName, setNewFacultyName] = useState('')

  const handleCancel = (event) => {
    cancelModalUpdate(false)
  }

  const onFinish = (values) => {
    const params = {
      faculty_id: dataFacultyId,
      faculty_name: newFacultyName,
    }
    console.log(`params`, params)
    httpClient
      .put('/update_faculty', params)
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
      <div>
        <Modal
          title="แก้ไขข้อมูลคณะ"
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
          {' '}
          <Form
            form={form}
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
          >
            <Form.Item
              name="faculty_id"
              label="รหัสคณะ"
            >
              <Input
                style={{ width: 300 }}
                disabled
                defaultValue={dataFacultyId}
              />
            </Form.Item>
            <Form.Item
              name="faculty_name"
              label="ชื่อคณะ"
              rules={[{ required: true, message: 'กรุณากรอกชื่อคณะ!' }]}
            >
              <Input
                style={{ width: 300 }}
                onChange={(e) => setNewFacultyName(e.target.value)}
                defaultValue={dataFacultyName}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default ModalUpdateFaculty
