import React, { useEffect, useState } from 'react'
import { Space, Form, Table, Result, Row, Col } from 'antd'
import { httpClient } from 'HttpClient.js'

import Search from 'antd/lib/input/Search'

const DocumentAPI = () => {
  const [data, setData] = useState('')

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
  ]

  const APIshowFile = (e) => {
    var formData = new FormData()
    formData.append('member', e)
    httpClient
      .post('/search_member', formData)
      .then(function (response) {
        console.log(`response.data`, response.data.data)
        const code = response.data.code
        const data = response.data.data
        if (code === 200) {
          const dataMap = data?.map((item, i) => {
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
          // setData(dataMap)
          Success(data)
        } else {
          Error(data)
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const pagination = {
    pageSize: 5,
    showSizeChanger: false,
  }

  const [alert, setAlert] = useState('')

  const Success = (data) => {
    console.log(`data`, data)
    setAlert(
      <div style={{ padding: '24px', backgroundColor: '#E5E7E9 ' }}>
        <Space>
          <Result status="success" subTitle="พบข้อมูล"></Result>
          <Table columns={columns} dataSource={data} pagination={pagination} />
        </Space>
      </div>
    )
  }
  const Error = () => {
    setAlert(
      <div style={{ padding: '24px', backgroundColor: '#E5E7E9 ' }}>
        <Result status="error" subTitle="ไม่พบข้อมูล"></Result>
      </div>
    )
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 50 }}>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</p>
        <p style={{ fontSize: 30 }}>
          ระบบจำแนกจดหมายและพัสดุไปรษณีย์ของ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน
        </p>

        <Space>
          <Search
            allowClear
            style={{ width: 600 }}
            placeholder="กรุรากรอกเบอร์โทร, รหัสประจำจัว"
            enterButton="ค้นหา"
            onSearch={(e) => {
              APIshowFile(e)
            }}
          />
        </Space>
        <br />
        <br />
      </div>
      <div style={{ textAlign: 'center' }}>{alert}</div>
    </>
  )
}

export default DocumentAPI
