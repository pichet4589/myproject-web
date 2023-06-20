import React, { useState, useEffect } from 'react'
import { Space, Table, Popconfirm, message, Button, Spin } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { httpClient } from 'HttpClient'
import ModalUpdatePrefix from 'components/modalUpdatePrefix'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const ManagePrefix = () => {
  const [data, setData] = useState('')
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [dataPrefixId, setDataPrefixId] = useState(false)
  const [dataPrefixName, setDataPrefixName] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    httpClient
      .get('/prefix')
      .then(function (response) {
        console.log(`response.data`, response.data.data)
        if (response.status === 200) {
          const dataLetter = response.data.data
          const dataMap = dataLetter?.map((item, i) => {
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
  const deletePrefix = (record) => {
    console.log(`record`, record.prefix_id)
    httpClient
      .delete('/delete_prefix/' + record.prefix_id)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('ลบคณะสำเร็จ')
          getData()
        } else {
          message.error('ลบคณะไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const onModal = (e) => {
    console.log(`e`, e)
    setDataPrefixId(e.prefix_id)
    setDataPrefixName(e.prefix_name)
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
      title: 'รหัสคำนำหน้า',
      dataIndex: 'prefix_id',
    },
    {
      title: 'ชื่อคณะ',
      dataIndex: 'prefix_name',
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
              onConfirm={() => deletePrefix(record)}
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
        จัดการข้อมูลคำนำหน้า
      </p>
      <Button type="primary" href="/insertPrefix">
        เพิ่มคำนำหน้า
      </Button>{' '}
      <br />
      <br />
      {data ? (
        <div>
          <Table bordered columns={columns} dataSource={data}></Table>
        </div>
      ) : (
        <div className="loding">
          <Spin indicator={antIcon} />
        </div>
      )}
      <ModalUpdatePrefix
        dataPrefixId={dataPrefixId}
        dataPrefixName={dataPrefixName}
        visible={visibleUpdate}
        cancelModalUpdate={() => cancelModalUpdate()}
      ></ModalUpdatePrefix>
    </>
  )
}

export default ManagePrefix
