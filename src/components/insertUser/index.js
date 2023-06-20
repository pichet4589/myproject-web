import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  message,
  Row,
  Col,
  Result,
  Modal,
} from 'antd'
import { httpClient } from 'HttpClient.js'

const { Option } = Select

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const App = () => {
  const [data, setData] = useState('')
  const [dataPrefix, setDataPrefix] = useState('')
  const [dataFaculty, setFaculty] = useState('')
  const [dataUserType, setDataUserType] = useState('')
  const [prefixId, setPrefixId] = useState('')
  const [departmentId, setDataDepartmentId] = useState('')
  const [userTypeId, setUserTypeId] = useState('')
  const [searchFaculty, setSearchFaculty] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    getPrefix()
    getFaculty()
    getUserType()
  }, [])

  const onReset = () => {
    form.resetFields()
  }
  const onSetPrefixId = (value) => {
    setPrefixId(value)
  }

  const onSetDepartmectId = (value) => {
    setDataDepartmentId(value)
  }

  const onSetUserTypeId = (value) => {
    setUserTypeId(value)
  }

  const getPrefix = () => {
    httpClient
      .get('/prefix')
      .then(function (response) {
        const data = response.data.data
        setDataPrefix(data)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

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

  const getUserType = () => {
    httpClient
      .get('/usertype')
      .then(function (response) {
        const data = response.data.data
        setDataUserType(data)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onSearch = (value) => {
    var formData = new FormData()
    formData.append('id', value)
    httpClient
      .post('/search_department', formData)
      .then(function (response) {
        const dataSearch = response.data.data
        setSearchFaculty(dataSearch)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onSubmit = (values) => {
    const params = {
      member_id: form.getFieldValue('member_id'),
      prefix_id: prefixId,
      user_fname: form.getFieldValue('user_fname'),
      user_lname: form.getFieldValue('user_lname'),
      department_id: departmentId,
      usertype_id: userTypeId,
    }
    httpClient
      .post('/adduser', params)
      .then(function (response) {
        const data = response.data.data
        const code = response.data.code
        if (code === 200) {
          const dataMap = data.map((item, i) => {
            item.name = item.user_fname + ' ' + item.user_lname
            return item
          })
          setData(dataMap)
          showModal()
        } else {
          message.error('เพิ่มข้อมูลไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const showModal = () => {
    setIsModalVisible(true)
    setTimeout(() => {
      handleCancel()
      onReset()
    }, 4000)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        title={null}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Result
          status="success"
          title="เพิ่มข้อมูลสำเร็จ!"
          subTitle={
            data &&
            data.map((e, i) => {
              return (
                <div>
                  {'รหัส ' +
                    e.member_id +
                    ' ชื่อ ' +
                    e.name +
                    ' ประเภท ' +
                    e.userType_name +
                    ' หน่วยงาน ' +
                    e.faculty_name +
                    ' หน่วยงานย่อย ' +
                    e.department_name}
                </div>
              )
            })
          }
        />
      </Modal>
      <Form
        form={form}
        {...layout}
        name="nest-messages"
        onFinish={onSubmit}
        labelCol={{ span: 9 }}
      >
        <Row>
          <Col className="gutter-row" span={6}>
            <div>
              <Form.Item
                name="prefix_id"
                label="คำนำหน้า :"
                rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้า!' }]}
              >
                <Select
                  style={{ width: 120 }}
                  placeholder="--กรุณาเลือก--"
                  onChange={onSetPrefixId}
                >
                  {dataPrefix &&
                    dataPrefix.map((e, i) => {
                      return (
                        <Option key={i} value={e.prefix_id}>
                          {e.prefix_name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div>
              <Form.Item
                name="user_fname"
                label="ชื่อ :"
                rules={[{ required: true, message: 'กรุณากรอกชื่อผู้รับ!' }]}
              >
                <Input placeholder="กรุณากรอกชื่อ" style={{ width: 180 }} />
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div>
              <Form.Item
                name="user_lname"
                label="นามสกุล :"
                rules={[{ required: true, message: 'กรุณากรอกสกุล!' }]}
              >
                <Input placeholder="กรุณากรอกสกุล" style={{ width: 180 }} />
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div>
              <Form.Item
                name="member_id"
                label="รหัสประจำตัว :"
                rules={[{ required: true, message: 'กรุณากรอกรหัสประจำตัว!' }]}
              >
                <Input style={{ width: 120 }} placeholder="กรุณากรอก" />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="faculty_id"
              label="หน่วยงาน"
              rules={[{ required: true, message: 'กรุณาเลือกหน่วยงาน!' }]}
            >
              <Select
                style={{ width: 350 }}
                placeholder="--กรุณาเลือก--"
                onChange={onSearch}
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

            <div>
              <Form.Item
                name="department_id"
                label="หน่วยงานย่อย"
                rules={[{ required: true, message: 'กรุณาเลือกหน่วยงานย่อย!' }]}
              >
                <Select
                  style={{ width: 300 }}
                  placeholder="--กรุณาเลือก--"
                  onChange={onSetDepartmectId}
                >
                  {searchFaculty &&
                    searchFaculty.map((e, i) => {
                      return (
                        <Option key={i} value={e.department_id}>
                          {e.department_name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" span={6}>
            <div>
              <Form.Item
                name="usertype_id"
                label="ประเภท :"
                rules={[{ required: true, message: 'กรุณาเลือกประเภท!' }]}
              >
                <Select
                  placeholder="--กรุณาเลือก--"
                  style={{ width: 140 }}
                  onChange={onSetUserTypeId}
                >
                  {dataUserType &&
                    dataUserType.map((e, i) => {
                      return (
                        <Option key={i} value={e.usertype_id}>
                          {e.userType_name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              เพิ่มข้อมูล
            </Button>
            <Button htmlType="button" href="/home" danger>
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                onReset()
              }}
            >
              ล้าง
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default App
