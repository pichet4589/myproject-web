import React, { useState, useEffect } from 'react'
import { Layout, Menu, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import {
  ApiOutlined,
  HomeOutlined,
  LoginOutlined,
  MailOutlined,
} from '@ant-design/icons'
const { Sider } = Layout
const { SubMenu } = Menu

const Sidebar = (props) => {
  const [activeMenu, setActiveMenu] = useState(props.location.pathname)

  useEffect(() => {
    setActiveMenu(props.location.pathname)
  }, [props.location.pathname])

  return (
    <Sider
      className="Sider sider-custom"
      trigger={null}
      collapsed={props.collapsed}
    >
      <div className="logo">
        <Row justify="space-around">
          <Col className="fonthead">
            {!props.collapsed ? (
              'POST OFFICE'
            ) : (
              <img src="logo_rmuti.png" width="27" />
            )}
          </Col>
        </Row>
      </div>

      <Menu
        className="Sider-Menu"
        theme="dark"
        defaultSelectedKeys={[activeMenu]}
        mode="inline"
      >
        {localStorage.getItem('token') ? (
          ''
        ) : (
          <Menu.Item
            key="/track"
            icon={<HomeOutlined />}
            onClick={() => setActiveMenu('/track')}
          >
            <Link to="/track">หน้าแรก</Link>
          </Menu.Item>
        )}
        {localStorage.getItem('token') ? (
          <Menu.Item
            key="/home"
            icon={<HomeOutlined />}
            onClick={() => setActiveMenu('/home')}
          >
            <Link to="/home">รายการจดหมาย</Link>
          </Menu.Item>
        ) : (
          ''
        )}

        {localStorage.getItem('token') ? (
          <SubMenu
            key="sub1"
            icon={<MailOutlined />}
            title="จัดการข้อมูลพื้นฐาน"
          >
            <Menu.Item
              key="/manageUsers"
              onClick={() => setActiveMenu('/manageUsers')}
            >
              <Link to="/manageUsers">จัดการผู้ใช้งาน</Link>
            </Menu.Item>
            <Menu.Item
              key="/manegeFaculty"
              onClick={() => setActiveMenu('/manageUsers')}
            >
              <Link to="/manegeFaculty">จัดการหน่วยงาน </Link>
            </Menu.Item>
            <Menu.Item
              key="/manegeDepartment"
              onClick={() => setActiveMenu('/manageUsers')}
            >
              <Link to="/manegeDepartment">จัดการหน่วยงานย่อย </Link>
            </Menu.Item>
            <Menu.Item
              key="/manegePrefix"
              onClick={() => setActiveMenu('/manegePrefix')}
            >
              <Link to="/manegePrefix">จัดการคำนำหน้า </Link>
            </Menu.Item>
            <Menu.Item
              key="/manegeCategory"
              onClick={() => setActiveMenu('/manegeCategory')}
            >
              <Link to="/manegeCategory">จัดการประเภท </Link>
            </Menu.Item>
          </SubMenu>
        ) : (
          ''
        )}

        <Menu.Item
          key="/documentApi"
          icon={<ApiOutlined />}
          onClick={() => setActiveMenu('/documentApi')}
        >
          <Link to="/documentApi">คู่มือการใช้งาน </Link>
        </Menu.Item>

        {localStorage.getItem('token') ? (
          ''
        ) : (
          <Menu.Item
            key="/login"
            icon={<LoginOutlined />}
            onClick={() => setActiveMenu('/login')}
          >
            <Link to="/login">เข้าสู่ระบบ</Link>
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  )
}

export default Sidebar
