import React, { useState, useEffect } from 'react'
import { Button, Spin, Space, Table, Popconfirm, message } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { httpClient } from 'HttpClient'
import ModalUpdateDepartment from 'components/modalUpdateDepartment'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const ManageDepartment = () => {
  const [data, setData] = useState('')
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [dataDepartmentId, setDataDepartmentId] = useState('')
  const [dataDepartmentName, setDataDepartmentName] = useState('')
  const [dataFacultyId, setDataFacultyId] = useState('')

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    httpClient
      .get('/department')
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
  const onModal = (e) => {
    console.log(`e`, e)
    setDataDepartmentId(e.department_id)
    setDataDepartmentName(e.department_name)
    setDataFacultyId(e.faculty_id)
    setVisibleUpdate(true)
  }
  const cancelModalUpdate = () => {
    setVisibleUpdate(false)
    window.location.reload()
  }
  const deleteDepartment = (record) => {
    console.log(`record`, record.department_id)
    httpClient
      .delete('/delete_department/' + record.department_id)
      .then(function (response) {
        console.log(`response`, response)
        const code = response.status
        if (code === 200) {
          message.success('ลบหน่วยงานย่อยสำเร็จ')
          getData()
        } else {
          message.error('ลบหน่วยงานย่อยไม่สำเร็จ')
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
      title: 'รหัสหน่วยงานย่อย',
      dataIndex: 'department_id',
    },
    {
      title: 'ชื่อหน่วยงานย่อย',
      dataIndex: 'department_name',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => (
        <div>
          <Space>
            <div>
              <EditOutlined
                onClick={() => onModal(record)}
                style={{ color: '#0092ff' }}
              />
            </div>
            <Popconfirm
              title="ยืนยันการลบข้มูล?"
              onConfirm={() => deleteDepartment(record)}
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

  const pagination = {
    showSizeChanger: false,
  }

  return (
    <>
      <p style={{ fontSize: '20px', textAlign: 'center' }}>จัดการข้อมูลหน่วยงานย่อย</p>
      <Button type="primary" href="/insertDepartment">
        เพิ่มหน่วยงานย่อย
      </Button>
      <br />
      <br />
      {data ? (
        <div>
          <Table
            bordered
            columns={columns}
            dataSource={data}
            pagination={pagination}
          ></Table>
        </div>
      ) : (
        <div className="loding">
          <Spin indicator={antIcon} />
        </div>
      )}
      <ModalUpdateDepartment
        dataDepartmentId={dataDepartmentId}
        dataDepartmentName={dataDepartmentName}
        dataFacultyId={dataFacultyId}
        visible={visibleUpdate}
        cancelModalUpdate={() => cancelModalUpdate()}
      ></ModalUpdateDepartment>
    </>
  )
}

export default ManageDepartment
