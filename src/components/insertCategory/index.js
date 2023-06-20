import React, { useEffect, useState } from 'react'
import { Space, Select, Input, Button, Form, message } from 'antd'
import { httpClient } from 'HttpClient'
const { Option } = Select
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const InsertCategory = (props) => {
  const [form] = Form.useForm()

  const onFinish = () => {
    const params = {
      category_id: form.getFieldValue('category_id'),
      category_name: form.getFieldValue('category_name'),
    }

    console.log(`params`, { params })
    httpClient
      .post('/add_category', params)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('เพิ่มข้อมูลสำเร็จ')
          setTimeout(function () {
            // window.location.reload()
            props.history.push('/manegeCategory')
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
        <h3>เพิ่มประเภทจดหมาย</h3>
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          labelCol={{ span: 9 }}
        >
          <Form.Item
            name="category_id"
            label="รหัสประเภท :"
            rules={[{ required: true, message: 'กรุณากรอกรหัสประเภท!' }]}
          >
            <Input placeholder="กรุณากรอกรหัสประเภท" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item
            name="category_name"
            label="ชื่อประเภท :"
            rules={[{ required: true, message: 'กรุณากรอกประเภท!' }]}
          >
            <Input placeholder="กรุณากรอกประเภท" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                เพิ่มข้อมูล
              </Button>
              <Button htmlType="button" href="/manegeCategory">
                ยกเลิก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default InsertCategory
