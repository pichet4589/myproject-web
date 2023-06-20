import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Space,
  Table,
  Select,
  Input,
  Form,
  message,
  Modal,
  Result,
  Popconfirm,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { httpClient } from 'HttpClient.js'
import Search from 'antd/lib/input/Search'

import { Button } from 'antd/lib/radio'
const { Option } = Select

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
}

const EditUser = () => {
  const [data, setData] = useState('')
  const [dataRecip, setDataRecip] = useState('')
  const [userId, setUserId] = useState(0)
  const [prefix, setPrefix] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [memberId, setMemberId] = useState('')
  const [faculty, setFaculty] = useState('')
  const [department, setDepartment] = useState('')
  const [type, setType] = useState('')
  const [prefixId, setPrefixId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [userTypeId, setUserTypeId] = useState('')
  const [dataFaculty, setDataFaculty] = useState()
  const [dataPrefix, setDataPrefix] = useState()
  const [dataUserType, setDataUserType] = useState()
  const [searchFaculty, setSearchFaculty] = useState('')
  const [form] = Form.useForm()

  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    getFaculty()
    getPrefix()
    getUserType()
  }, [])

  const getFaculty = () => {
    httpClient
      .get('/faculty')
      .then(function (response) {
        const data = response.data.data
        setDataFaculty(data)
      })
      .catch(function (error) {
        console.log('error', error)
      })
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

  const onSearchDepartment = (value) => {
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

  const columns = [
    {
      title: 'คำนำหน้า',
      dataIndex: 'prefix_name',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'user_fname',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'user_lname',
    },
    {
      title: 'รหัสประจำตัว',
      dataIndex: 'member_id',
    },
    {
      title: 'ประเภท',
      dataIndex: 'userType_name',
    },
    {
      title: 'คณะ',
      dataIndex: 'faculty_name',
      width: 350,
    },
    {
      title: 'สาขา',
      dataIndex: 'department_name',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => (
        <div>
          <Space>
            {' '}
            <div onClick={() => onEditForm(record)}>
              <EditOutlined style={{ color: '#0092ff' }} />
            </div>
            <Popconfirm
              title="ยืนยันการลบข้มูล?"
              onConfirm={() => onDeleteUser(record)}
            >
              <div>
                <DeleteOutlined style={{ color: '#FE0410' }} />
              </div>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ]

  const onDeleteUser = (record) => {
    httpClient
      .delete('/delete_user/' + record.user_id)
      .then(function (response) {
        console.log(`response`, response.status)
        const code = response.status
        if (code === 200) {
          message.success('ลบข้อมูลผู้ใช้งานสำเร็จ')
          setTimeout(function () {
            window.location.reload()
          }, 2000)
        } else {
          message.error('ลบข้อมูลผู้ใช้งานไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onEditForm = (e) => {
    console.log('e', e)
    setUserId(e.user_id)
    setPrefix(e.prefix_name)
    setFname(e.user_fname)
    setLname(e.user_lname)
    setMemberId(e.member_id)
    setFaculty(e.faculty_name)
    setDepartment(e.department_name)
    setType(e.userType_name)
    setPrefixId(e.prefix_id)
    setDepartmentId(e.department_id)
    setUserTypeId(e.usertype_id)
    onReset()
  }

  const onSubmit = (e) => {
    const params = {
      id: userId,
      member_id: memberId,
      prefix_id: prefixId,
      user_fname: fname,
      user_lname: lname,
      department_id: departmentId,
      usertype_id: userTypeId,
    }
    console.log(`params`, params)
    httpClient
      .put('/update_user', params)
      .then(function (response) {
        console.log('response', response.data.data)
        const data = response.data.data
        const code = response.status
        if (code === 200) {
          const dataMap = data.map((item, i) => {
            item.name = item.user_fname + ' ' + item.user_lname
            return item
          })
          setData(dataMap)
          showModal()
        } else {
          message.error('อัพเดทข้อมูลไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onSearchId = (e) => {
    console.log(`e`, e)
    var formData = new FormData()
    formData.append('id', e)
    httpClient
      .post('/search_id', formData)
      .then(function (response) {
        console.log(`response`, response)
        const dataSearch = response.data.data
        const dataMap = dataSearch.map((item, i) => {
          setUserId(item.user_id)
          return item
        })
        console.log(`dataMap`, dataMap)
        setDataRecip(dataMap)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onSearchName = (e) => {
    var formData = new FormData()
    formData.append('name', e)
    httpClient
      .post('/search_user', formData)
      .then(function (response) {
        console.log(`response`, response)
        const dataSearch = response.data.data
        const dataMap = dataSearch.map((item, i) => {
          item.name = item.prefix_name + item.user_fname + ' ' + item.user_lname
          return item
        })
        console.log(`dataMap`, dataMap)
        setDataRecip(dataMap)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const pagination = {
    pageSize: 20,
    showSizeChanger: false,
  }

  const onReset = () => {
    form.resetFields()
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showModal = () => {
    setIsModalVisible(true)
    setTimeout(() => {
      handleCancel()
      onReset()
      window.location.reload()
    }, 3000)
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
          title="อัพเดทข้อมูลสำเร็จ!"
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
      <div>
        <Space>
          ค้นหาด้วยรหัสประจำตัว :
          <Search
            style={{ width: 250 }}
            placeholder="กรุณากรอกรหัสประจำตัว"
            onSearch={(e) => {
              onSearchId(e)
            }}
          />
          ค้นหาด้วยชื่อ :
          <Search
            style={{ width: 250 }}
            placeholder="กรุณากรอกรหัสประจำตัว"
            onSearch={(e) => {
              onSearchName(e)
            }}
          />
        </Space>
      </div>
      <br />
      <Row>
        {dataRecip ? (
          <div>
            <Table
              bordered
              style={{ textAlign: 'center' }}
              columns={columns}
              dataSource={dataRecip}
              size="small"
              pagination={pagination}
              scroll={{ y: 240 }}
            />
          </div>
        ) : (
          ''
        )}
      </Row>

      {dataRecip ? (
        <div>
          <Form form={form} {...layout} labelCol={{ span: 9 }}>
            <Row>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="prefix_id"
                  label="คำนำหน้า :"
                  rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้า!' }]}
                >
                  <Select
                    style={{ width: 120 }}
                    placeholder="--กรุณาเลือก--"
                    defaultValue={prefix}
                    value={prefixId}
                    onChange={setPrefixId}
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
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    name="user_fname"
                    label="ชื่อ :"
                    rules={[{ required: true, message: 'กรุณากรอกชื่อ!' }]}
                  >
                    <Input
                      defaultValue={fname}
                      style={{ width: 180 }}
                      onChange={(e) => setFname(e.target.value)}
                    />
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
                    <Input
                      defaultValue={lname}
                      style={{ width: 180 }}
                      onChange={(e) => setLname(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    name="member_id"
                    label="รหัสประจำตัว :"
                    rules={[
                      { required: true, message: 'กรุณากรอกรหัสประจำตัว!' },
                    ]}
                  >
                    <Input
                      defaultValue={memberId}
                      style={{ width: 120 }}
                      onChange={(e) => setMemberId(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="faculty_id"
                  label="คณะ"
                  rules={[{ required: true, message: 'กรุณาเลือกคณะ!' }]}
                >
                  <Select
                    style={{ width: 350 }}
                    defaultValue={faculty}
                    onChange={onSearchDepartment}
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
              </Col>
              <Col className="gutter-row" span={12}>
                <div>
                  <Form.Item
                    name="department_id"
                    label="สาขา :"
                    rules={[{ required: true, message: 'กรุณาเลือกสาขา!' }]}
                  >
                    <Select
                      style={{ width: 300 }}
                      defaultValue={department}
                      onChange={setDepartmentId}
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
                      defaultValue={type}
                      style={{ width: 140 }}
                      onChange={setUserTypeId}
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
                <Button
                  className="btnSubmit"
                  type="primary"
                  onClick={onSubmit}
                  style={{ color: '#1b849e', borderColor: '#1b849e' }}
                >
                  บันทึกข้อมูล
                </Button>
                <Button htmlType="button" danger href="/home">
                  ยกเลิก
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default EditUser
