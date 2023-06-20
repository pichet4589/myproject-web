import React, { useState, useEffect } from 'react'
import {
  Select,
  Space,
  Tabs,
  Table,
  Popconfirm,
  message,
  Button,
  Spin,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons'

import { httpClient } from 'HttpClient'
import ModalUpdateCategory from 'components/modalUpdateCategory'


const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
function callback(key) {
  console.log(key)
}

const ManageCategory = () => {
  const [data, setData] = useState('')
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [dataCategoryId, setDataCategoryId] = useState('')
  const [dataCategoryName, setDataCategoryName] = useState('')

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    httpClient
      .get('/category')
      .then(function (response) {
        console.log(`response.data`, response.data.data)
        if (response.status === 200) {
          const dataLetter = response.data.data
          const dataMap = dataLetter?.map((item, i) => {
            item.nameRecipient = item.user_fname + ' ' + item.user_lname
            item.key = i + 1
            return item
          })
          setData(dataMap)
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }
  const deleteCategory = (record) => {
    console.log(`record`, record.category_id)
    httpClient
      .delete('/delete_category/' + record.category_id)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('ลบประเภทสำเร็จ')
          getData()
        } else {
          message.error('ลบประเภทไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onModal = (e) => {
    console.log(`e`, e)
    setDataCategoryId(e.category_id)
    setDataCategoryName(e.category_name)
    setVisibleUpdate(true)
  }
  const cancelModalUpdate = () => {
    setVisibleUpdate(false)
    window.location.reload()
  }

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'key',
    },
    {
      title: 'รหัสประเภท',
      dataIndex: 'category_id',
    },
    {
      title: 'ชื่อประเภท',
      dataIndex: 'category_name',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => (
        <div>
          <Space>
            <div onClick={() => onModal(record)}>
              <EditOutlined style={{ color: '#0092ff' }} />
            </div>
            <Popconfirm
              title="ยืนยันการลบข้มูล?"
              onConfirm={() => deleteCategory(record)}
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
  return (
    <>
      <p style={{ fontSize: '20px', textAlign: 'center' }}>
        จัดการข้อมูลประเภทจดหมาย
      </p>

      <Button type="primary" href="/insertCategory">
        เพิ่มประเภทจดหมาย
      </Button>
      <br />
      <br />
      {data ? (
        <div>
          <Table columns={columns} dataSource={data}></Table>
        </div>
      ) : (
        <div className="loding">
          <Spin indicator={antIcon} />
        </div>
      )}

      <ModalUpdateCategory
        dataCategoryId={dataCategoryId}
        dataCategoryName={dataCategoryName}
        visible={visibleUpdate}
        cancelModalUpdate={() => cancelModalUpdate()}
      ></ModalUpdateCategory>
    </>
  )
}

export default ManageCategory
