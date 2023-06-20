import React from 'react'
import { Tabs } from 'antd'
import InsertUser from '../../components/insertUser'
import EditUser from '../../components/editUser'

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const App = () => {
  return (
    <>
      <p style={{ fontSize: '20px', textAlign: 'center' }}>จัดการผู้ใช้งาน</p>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="เพิ่มข้อมูล" key="1">
          <InsertUser />
        </TabPane>
        <TabPane tab="แก้ไข/ลบข้อมูล" key="2">
          <EditUser />
        </TabPane>
      </Tabs>
    </>
  )
}

export default App
