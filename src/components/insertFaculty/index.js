import React, { useEffect, useState } from 'react'
import { Space, Input, Button, Form, message } from 'antd'
import { httpClient } from 'HttpClient'
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const InsertFaculty = (props) => {
  const [form] = Form.useForm()

  const onFinish = () => {
    const params = {
      faculty_id: form.getFieldValue('faculty_id'),
      faculty_name: form.getFieldValue('faculty_name'),
    }

    console.log(`params`, { params })
    httpClient
      .post('/add_faculty', params)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('เพิ่มข้อมูลสำเร็จ')
          setTimeout(function () {
            props.history.push('/manegeFaculty')
          }, 2000)
        } else {
          message.error('เพิ่มข้อมูลไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }
  return (
    <>
      <div>
        <h3>เพิ่มหน่วยงาน</h3>
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          labelCol={{ span: 9 }}
        >
          <Form.Item
            name="faculty_id"
            label="รหัสหน่วยงาน :"
            rules={[{ required: true, message: 'กรุณากรอกรหัสหน่วยงาน!' }]}
          >
            <Input placeholder="กรุณากรอกรหัสหน่วยงาน" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item
            name="faculty_name"
            label="ชื่อหน่วยงาน :"
            rules={[{ required: true, message: 'กรุณากรอกชื่อหน่วยงาน!' }]}
          >
            <Input placeholder="กรุณากรอกหน่วยงาน" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                เพิ่มข้อมูล
              </Button>
              <Button htmlType="button" href="/manegeFaculty">
                ยกเลิก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default InsertFaculty
