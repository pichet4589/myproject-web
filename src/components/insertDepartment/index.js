import React, { useEffect, useState } from 'react'
import { Select, Space, message, Button, Input, Form } from 'antd'
import { httpClient } from 'HttpClient'

const { Option } = Select
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const InsertDepartMent = (props) => {
  const [facultyId, setFacultyId] = useState('')
  const [dataFaculty, setFaculty] = useState('')
  const [form] = Form.useForm()

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

  const onFinish = () => {
    const params = {
      department_id: form.getFieldValue('department_id'),
      department_name: form.getFieldValue('department_name'),
      faculty_id: facultyId,
    }

    console.log(`params`, { params })
    httpClient
      .post('/add_department', params)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('เพิ่มข้อมูลสำเร็จ')
          setTimeout(function () {
            props.history.push('/manegeDepartment')
          }, 2000)
        } else {
          message.error('เพิ่มข้อมูลไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }
  const onSetFacultyId = (value) => {
    setFacultyId(value)
  }
  return (
    <>
      <div>
        <h3>เพิ่มหน่วยงานย่อย</h3>
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          labelCol={{ span: 9 }}
        >
          <Form.Item
            name="department_id"
            label="รหัสหน่วยงานย่อย:"
            rules={[{ required: true, message: 'กรอกรหัสหน่วยงานย่อย!' }]}
          >
            <Input placeholder="กรอกรหัสหน่วยงานย่อย" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item
            name="department_name"
            label="ชื่อหน่วยงานย่อย :"
            rules={[{ required: true, message: 'กรุณากรอกชื่อหน่วยงานย่อย!' }]}
          >
            <Input placeholder="กรอชื่อหน่วยงานย่อย" style={{ width: 350 }} />
          </Form.Item>
          <Form.Item
            name="faculty_id"
            label="หน่วยงาน"
            rules={[{ required: true, message: 'กรุณาเลือกคณะ!' }]}
          >
            <Select
              style={{ width: 350 }}
              placeholder="--กรุณาเลือก--"
              onChange={onSetFacultyId}
            >
              {dataFaculty &&
                dataFaculty.map((e, i) => {
                  return (
                    <Option key={i} value={e.faculty_id}>
                      {e.faculty_name}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                เพิ่มข้อมูล
              </Button>
              <Button htmlType="button" href="/manegeDepartment">
                ยกเลิก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default InsertDepartMent
