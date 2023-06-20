import React, { useState, useEffect } from 'react'
import { Form, Modal, Button, Space, message, Input, Select } from 'antd'

import { httpClient } from 'HttpClient.js'
const { Option } = Select

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const ModalUpdateDepartment = (props) => {
  const {
    visible,
    cancelModalUpdate,
    dataDepartmentId,
    dataDepartmentName,
    dataFacultyId,
  } = props
  const [form] = Form.useForm()
  const [dataFaculty, setFaculty] = useState('')

  const [newDepartmentName, setNewDepartmentName] = useState('')

  const handleCancel = (event) => {
    cancelModalUpdate(false)
  }

  useEffect(() => {
    getFaculty()
  }, [])

  const getFaculty = () => {
    httpClient
      .get('/faculty')
      .then(function (response) {
        const data = response.data.data
        setFaculty(data)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onFinish = (values) => {
    const params = {
      department_id: dataDepartmentId,
      department_name: newDepartmentName,
      faculty_id: dataFacultyId,
    }
    console.log(`params`, params)
    httpClient
      .put('/update_department', params)
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
          title="แก้ไขข้อมูลสาขา"
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
            <Form.Item name="faculty_id" label="รหัสสาขา">
              <Input
                style={{ width: 300 }}
                disabled
                defaultValue={dataDepartmentId}
              />
            </Form.Item>
            <Form.Item
              name="faculty_name"
              label="ชื่อสาขา"
              rules={[{ required: true, message: 'กรุณากรอกชื่อสาขา!' }]}
            >
              <Input
                style={{ width: 300 }}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                defaultValue={dataDepartmentName}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default ModalUpdateDepartment
