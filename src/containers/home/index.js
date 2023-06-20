import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Row,
  Col,
  Space,
  message,
  Popconfirm,
  Spin,
  Form,
  Select,
  Modal,
} from 'antd'
import {
  CameraOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { httpClient } from 'HttpClient.js'
import Search from 'antd/lib/input/Search'

const { Option } = Select
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const Home = () => {
  const [dataMap, setDataMap] = useState('')
  const [dataSearchName, setDataSearchName] = useState('')
  const [dataSearchId, setDataSearchId] = useState('')
  const [idLetter, setIdLetter] = useState('')
  const [exportName, setExportName] = useState('')
  const [statusName, setStatusName] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [dataStatus, setDataStatus] = useState('')
  const [dataCategory, setDataCategory] = useState('')
  const [statusId, setStatusId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [userId, setUserId] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    APIshowFile()
    getCatedory()
    getStatus()
  }, [dataSearchId, dataSearchName])

  const getStatus = () => {
    httpClient
      .get('/status')
      .then(function (response) {
        const data = response.data.data
        setDataStatus(data)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const getCatedory = () => {
    httpClient
      .get('/category')
      .then(function (response) {
        const data = response.data.data
        setDataCategory(data)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const APIshowFile = () => {
    const params = {
      id: dataSearchId,
      name: dataSearchName,
    }
    httpClient
      .get('/check_letter', { params })
      .then(function (response) {
        console.log(`response.data`, response.data.data)

        if (response.status === 200) {
          const dataLetter = response.data.data
          const dataMap = dataLetter?.map((item, i) => {
            item.nameRecipient = item.user_fname + ' ' + item.user_lname
            item.key = i + 1
            const date = new Date(item.date)
            item.dataDate = date.toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'UTC',
            })
            return item
          })
          setDataMap(dataMap)
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const deleteParcel = (record) => {
    console.log(`record.user_id`, record.id)
    httpClient
      .delete('/delete_letter/' + record.id)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('ลบข้อมูลจดหมายสำเร็จ')
          APIshowFile()
        } else {
          message.error('ลบข้อมูลจดหมายไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const showModalUpdate = (e) => {
    setIdLetter(e.id)
    setUserId(e.user_id)
    setExportName(e.export_name)
    setCategoryName(e.category_name)
    setCategoryId(e.category_id)
    setStatusName(e.status_name)
    setStatusId(e.status_id)
    setIsModalVisible(true)
    onReset()
  }

  const onReset = () => {
    form.resetFields()
  }

  const onDataSearchName = (e) => {
    setDataSearchName(e.target.value)
    APIshowFile()
  }

  const onDataSearchId = (e) => {
    setDataSearchId(e.target.value)
    APIshowFile()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onSetCategory = (value) => {
    setCategoryId(value)
  }

  const onSetStatus = (value) => {
    setStatusId(value)
  }

  const onUpdate = () => {
    const params = {
      user_id: userId,
      export_name: exportName,
      id: idLetter,
      category_id: categoryId,
      status_id: statusId,
    }
    console.log(`params`, params)
    httpClient
      .put('/update_letter', params)
      .then(function (response) {
        const code = response.status
        if (code === 200) {
          message.success('อัพเดทข้อมูลสำเร็จ')
          setTimeout(function () {
            APIshowFile()
            handleCancel()
          }, 3000)
        } else {
          message.error('อัพเดทข้อมูลไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'key',
    },
    {
      title: 'วันที่รับจดหมาย',
      dataIndex: `dataDate`,
    },
    {
      title: 'ชื่อ-สกุลผู้ส่ง',
      dataIndex: 'export_name',
    },
    {
      title: 'ชื่อ-สกุลผู้รับ',
      dataIndex: 'nameRecipient',
    },
    {
      title: 'สังกัดผู้รับ',
      dataIndex: 'organization_name',
    },
    {
      title: 'รหัสประจำตัว',
      dataIndex: 'member_id',
    },
    {
      title: 'ประเภท',
      dataIndex: 'category_name',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status_name',
      render: (status) => {
        return status === 'มารับแล้ว' ? (
          <font style={{ color: '#009900' }}>มารับแล้ว</font>
        ) : (
          <font style={{ color: '#C0C0C0' }}>ยังไม่ได้มารับ</font>
        )
      },
    },
    {
      title: 'operation',
      dataIndex: 'status_name',
      render: (status, record) => {
        return status === 'มารับแล้ว' ? (
          <div>
            {localStorage.getItem('token') ? (
              <div onClick={() => showModalUpdate(record)}>
                <EditOutlined style={{ color: '#0092ff' }} />
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          <div>
            {localStorage.getItem('token') ? (
              <Space>
                <div onClick={() => showModalUpdate(record)}>
                  <EditOutlined style={{ color: '#0092ff' }} />
                </div>
                <Popconfirm
                  title="ยืนยันการลบข้มูล?"
                  onConfirm={() => deleteParcel(record)}
                >
                  <div>
                    <DeleteOutlined style={{ color: '#FE0410' }} />
                  </div>
                </Popconfirm>
              </Space>
            ) : (
              ''
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Modal
        title="แก้ไขข้อมูลจดหมายและพัสดุ"
        width="600px"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Space>
            <Button
              className="btnCancel"
              key="close"
              htmlType="button"
              onClick={handleCancel}
            >
              ยกเลิก
            </Button>
            <Button type="primary" onClick={onUpdate}>
              บันทึก
            </Button>
          </Space>,
        ]}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 8 }}
        >
          <Form.Item name="category_id" label="ประเภท">
            <Select
              placeholder="--กรุณาเลือก--"
              defaultValue={categoryName}
              value={categoryId}
              onChange={onSetCategory}
            >
              {dataCategory &&
                dataCategory.map((e, i) => {
                  return (
                    <Option key={i} value={e.category_id}>
                      {e.category_name}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Form.Item name="status_id" label="สถานะ">
            <Select
              placeholder="--- โปรดเลือก ---"
              defaultValue={statusName}
              onChange={onSetStatus}
              value={statusId}
            >
              {dataStatus &&
                dataStatus.map((e, i) => {
                  return (
                    <Option key={i} value={e.status_id}>
                      {e.status_name}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <p style={{ fontSize: '20px' }}>
        ระบบจำแนกและตรวจสอบจดหมายและพัสดุไปรษณีย์ของ มทร.อีสาน ด้วยการ
        ประมวลผลภาพ
      </p>
      <div>
        <Row justify="space-between">
          <Col span="16">
            <Space>
              ชื่อ-สกุล :
              <Search
                placeholder="กรุณากรอก ชื่อ-สกุล"
                onChange={(e) => {
                  onDataSearchName(e)
                }}
              />
              รหัสประจำตัว :
              <Search
                placeholder="กรุณากรอกรหัสประจำตัว"
                onChange={(e) => {
                  onDataSearchId(e)
                }}
              />
            </Space>
          </Col>
          <Col>
            <div>
              {localStorage.getItem('token') ? (
                <Space>
                  <Button type="primary" href="/openCamera">
                    <CameraOutlined />
                    เพิ่มข้อมูลจดหมาย/พัสดุ
                  </Button>
                </Space>
              ) : (
                ''
              )}
            </div>
          </Col>
        </Row>
      </div>
      <br />
      {dataMap ? (
        <div>
          <Table
            bordered
            style={{ textAlign: 'left' }}
            columns={columns}
            dataSource={dataMap}
            editTable="true"
          />
        </div>
      ) : (
        <div className="loding">
          <Spin indicator={antIcon} />
        </div>
      )}
    </>
  )
}

export default Home
