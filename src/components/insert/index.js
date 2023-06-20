import React, { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  message,
  Table,
  DatePicker,
} from 'antd'
import { httpClient } from 'HttpClient.js'
import moment from 'moment'

const { Option } = Select

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
}

const InsertLetter = () => {
  const [NameRecipient, setNameRecipient] = useState('')
  const [dataRecip, setDataRecip] = useState('')
  const [dataCategory, setDataCategory] = useState('')
  const [userId, setUserId] = useState(0)
  const [nameUser, setNameUser] = useState('')
  const [form] = Form.useForm()
  const [dataDate, setDataDate] = useState('')

  useEffect(() => {
    getCategory()
  }, [])

  const getCategory = () => {
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

  const onFinish = () => {
    const params = {
      user_id: userId,
      export_name: form.getFieldValue('exportName'),
      category_id: parseInt(form.getFieldValue('category_id')),
      date: dataDate,
    }
    console.log(`params`, params)
    httpClient
      .post('/add_letter', params)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('เพิ่มข้อมูลสำเร็จ')
          setTimeout(function () {
            window.location.reload()
          }, 3000)
        } else {
          message.error('เพิ่มข้อมูลไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onSearch = (e) => {
    var formData = new FormData()
    formData.append('name', e.target.value)
    httpClient
      .post('/search_user', formData)
      .then(function (response) {
        const data = response.data.data
        setDataRecip(data)
        const dataMap = data.map((item, i) => {
          item.nameRecipient = item.user_fname + ' ' + item.user_lname
          item.num = i + 1
          return item
        })
        setNameRecipient(dataMap)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const columns = [
    {
      title: 'ชื่อ-สกุล',
      dataIndex: 'nameRecipient',
    },
    {
      title: 'รหัส',
      dataIndex: 'member_id',
    },
    {
      title: 'ประเภท',
      dataIndex: 'userType_name',
    },
    {
      title: 'หน่วยงานย่อย',
      dataIndex: 'department_name',
    },
  ]

  const onClickSelect = (record, _) => {
    setNameUser(record.nameRecipient)
    setUserId(record.user_id)
  }

  const pagination = {
    pageSize: 20,
    showSizeChanger: false,
  }

  const onSelectDate = (date, _) => {
    setDataDate(date.format('YYYY-MM-DD H:mm:ss '))
  }

  const disabledDate = (current) => {
    return current && current > moment().endOf('day')
  }

  return (
    <>
      <p style={{ fontSize: '20px', textAlign: 'center' }}>
        เพิ่มข้อมูลจดหมายด้วยคีบอร์ด
      </p>

      <Form form={form} {...layout} name="nest-messages" onFinish={onFinish}>
        <Form.Item name="user_id" label="ค้นหาผู้รับ :">
          <Input
            style={{ width: '60%' }}
            placeholder="กรุณากรอกชื่อผู้รับ"
            onChange={onSearch}
          />
          <br />
          <br />
          {NameRecipient ? (
            <div>
              <Table
                style={{ width: '90%' }}
                columns={columns}
                dataSource={dataRecip}
                size="small"
                pagination={pagination}
                scroll={{ y: 240 }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => onClickSelect(record, rowIndex), //click row
                  }
                }}
              />
              <Space>
                ชื่อ-สกุลผู้รับที่เลือก
                <Input value={nameUser} />
              </Space>
            </div>
          ) : (
            ''
          )}
        </Form.Item>

        <Form.Item name="exportName" label="ชื่อ-สกุลผู้ส่ง :">
          <Input style={{ width: '60%' }} placeholder="กรุณากรอกชื่อผู้ส่ง" />
        </Form.Item>

        <Form.Item name="date" label="วันที่รับ">
          <DatePicker
            onChange={onSelectDate}
            disabledDate={disabledDate}
            placeholder="--- โปรดเลือก ---"
          />
        </Form.Item>

        <Form.Item name="category_id" label="ประเภท">
          <Select placeholder="--- โปรดเลือก ---" style={{ width: '40%' }}>
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

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 9 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              เพิ่มข้อมูล
            </Button>
            <Button htmlType="button" href="/home">
              ยกเลิก
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default InsertLetter
