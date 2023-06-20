import React, { useEffect, useState } from 'react'
import { Space, Input, Button, Form, message } from 'antd'
import { httpClient } from 'HttpClient'
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const InsertPrefix = (props) => {
  const [form] = Form.useForm()

  const onFinish = () => {
    const params = {
      prefix_id: form.getFieldValue('prefix_id'),
      prefix_name: form.getFieldValue('prefix_name'),
    }

    console.log(`params`, { params })
    httpClient
      .post('/add_prefix', params)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('เพิ่มข้อมูลสำเร็จ')
          setTimeout(function () {
            // window.location.reload()
            props.history.push('/manegePrefix')
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
        <h3>เพิ่มข้อมูลคำนำหน้า</h3>
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          labelCol={{ span: 9 }}
        >
          <Form.Item
            name="prefix_id"
            label="รหัสคำนำหน้า:"
            rules={[{ required: true, message: 'กรุณากรอกรหัสคำนำหน้า!' }]}
          >
            <Input placeholder="กรุณากรอกรหัสคำนำหน้า" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item
            name="prefix_name"
            label="คำนำหน้า:"
            rules={[{ required: true, message: 'กรุณากรอกคำนำหน้า!' }]}
          >
            <Input placeholder="กรุณากรอกคำนำหน้า" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                เพิ่มข้อมูล
              </Button>
              <Button htmlType="button" href="/manegePrefix">
                ยกเลิก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default InsertPrefix
