import React from 'react'
import { Form, Input, Button, Row, Col, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { httpClient } from 'HttpClient.js'
// import { sha256 } from 'js-sha256'

const NormalLoginForm = (props) => {
  const onFinish = (values) => {
    // props.history.push('/')
    console.log(`values`, values)

    localStorage.setItem('myUsername', values.username)

    const params = {
      username: values.username,
      password: values.password,
      // password: sha256.hmac("sil-dkigx]ujpocx]'my=", values.password),
    }

    httpClient
      .post('/login', params)
      .then(function (response) {
        console.log(`token`, response.data.auth_token)
        localStorage.setItem(`token`, response.data.auth_token)

        console.log(`response`, response)
        const resMessage = response.status
        if (resMessage === 200) {
          message.success('เข้าสู่ระบบสำเร็จ', 1.5).then(() => {
            props.history.push('/home')
            // window.location.reload()
          })
        } else {
          message.error('เข้าสู่ระบบไม่สำเร็จ')
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  return (
    <Row justify="center">
      <Col span={8}></Col>
      <Col span={6} align="middle">
        <div className="box-login">
          <p style={{ fontSize: '24px' }}>สำหรับผู้ดูแลระบบ</p>

          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your Username!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                เข้าสู่ระบบ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
      <Col span={8}></Col>
    </Row>
  )
}

export default NormalLoginForm
