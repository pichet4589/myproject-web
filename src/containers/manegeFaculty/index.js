import React, { useState, useEffect } from 'react'
import { Space, Table, Popconfirm, message, Button, Spin } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import ModalUpdateFaculty from 'components/modalUpdateFaculty'
import { httpClient } from 'HttpClient.js'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const ManageFaculty = () => {
  const [data, setData] = useState('')
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [dataFacultyId, setDataFacultyId] = useState('')
  const [dataFacultyName, setDataFacultyName] = useState('')

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    httpClient
      .get('/faculty')
      .then(function (response) {
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
  const deleteFaculty = (record) => {
    httpClient
      .delete('/delete_faculty/' + record.faculty_id)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('ลบหน่วยงานสำเร็จ')
          getData()
        } else {
          message.error('ลบหน่วยงานไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const cancelModalUpdate = () => {
    setVisibleUpdate(false)
    window.location.reload()
  }

  const onModal = (e) => {
    setDataFacultyId(e.faculty_id)
    setDataFacultyName(e.faculty_name)
    setVisibleUpdate(true)
  }

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'key',
    },
    {
      title: 'รหัสหน่วยงาน',
      dataIndex: 'faculty_id',
    },
    {
      title: 'ชื่อหน่วยงาน',
      dataIndex: 'faculty_name',
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
              onConfirm={() => deleteFaculty(record)}
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
        จัดการข้อมูลหน่วยงาน
      </p>
      <Button type="primary" href="/insertFaculty">
        เพิ่มหน่วยงาน
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
      <ModalUpdateFaculty
        dataFacultyId={dataFacultyId}
        dataFacultyName={dataFacultyName}
        visible={visibleUpdate}
        cancelModalUpdate={() => cancelModalUpdate()}
      ></ModalUpdateFaculty>
    </>
  )
}

export default ManageFaculty
