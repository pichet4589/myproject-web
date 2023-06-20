import React, { useState, useEffect } from 'react'
import { Card, Col, Row, Skeleton, Space, Spin } from 'antd';
import config from 'config'
import { httpClient } from 'HttpClient';
import { Chart } from 'react-charts'
import moment from 'moment'

const Dashboard = (props) => {
  const [totalfile, setTotalfile] = useState('')
  const [activefile, setActivefile] = useState('')
  const [deletefile, setDeletefile] = useState('')
  const [dataChart, setDataChart] = useState([])
  const [dataUpload, setDataUpload] = useState([])
  const [dataGet, setDataGet] = useState([])

  useEffect(() => {
    if (!dataChart.length) {
      APIDashboard()
    }
  }, [dataChart])

  const APIDashboard = () => {
    httpClient.get(config.fileURL + '/dashboard')
      .then(function (result) {
        const code = result.data.code
        const data = result.data.data
        const totalfile1 = data.total_file
        const activefile1 = data.file_active
        const deletefile1 = data.file_deleted
        setTotalfile(totalfile1)
        setActivefile(activefile1)
        setDeletefile(deletefile1)
        if (code === 200) {
          const getFile = data.getfile_day
          const uploadFile = data.uploadfile_day
          const dataMapGet = getFile.map((item, key) => {
            const arr = []
            const formatDate = moment(item.date * 1000).format("DD/MM")
            arr.push(formatDate)
            arr.push(item.value)
            return arr
          })

          const dataMapUpload = uploadFile.map((item, key) => {
            const arr = []
            const formatDate = moment(item.date * 1000).format("DD/MM")
            arr.push(formatDate)
            arr.push(item.value)
            return arr
          })

          let formatUploadDataChart = [{
            label: 'num ',
            data: dataMapUpload
          }]

          let formatGetDataChart = [{
            label: 'num ',
            data: dataMapGet,
          }]
          setDataUpload(formatUploadDataChart)
          setDataGet(formatGetDataChart)
          setDataChart(dataMapUpload)
        }
      })
      .catch(function (error) {
        console.log('error', error)
        // localStorage.setItem('myUsername', '')
        // localStorage.setItem('token', '')
        // localStorage.setItem('myUsername', '')
        // props.history.push('/login')
        // window.location.reload()
      })
  }

  const series = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { position: 'left', type: 'linear', stacked: false }
    ],
    []
  )

  return (
    <>
      <div>
        <Row justify="center" gutter="150" >
          <Col xs={2} sm={4} md={6} lg={8} xl={6}>
            <Card className="card"  >
              {totalfile.length === 0 ? <div><Spin /></div> : totalfile}
              <p>จำนวนไฟล์ทั้งหมด</p>
            </Card>
          </Col>
          <Col xs={2} sm={4} md={6} lg={8} xl={6}>
            <Card className="card">
              {activefile.length === 0 ? <div><Spin /></div> : activefile}
              <p>จำนวนไฟล์ที่ใช้งาน</p>
            </Card>
          </Col>
          <Col xs={2} sm={4} md={6} lg={8} xl={6}>
            <Card className="card">
              {deletefile.length === 0 ? <div><Spin /></div> : deletefile}
              <p>จำนวนไฟล์ที่ถูกลบ</p>
            </Card>
          </Col>
        </Row>
      </div>
      <br /><br /><br />
      <div>
        <Row justify="center" gutter={[100]}>
          <Space>
            <Col>
              <div className="chart" >
                <p style={{ textAlign: 'center' }}>กราฟแสดงการอัปโหลดไฟล์ไปใช้งานกี่ครั้ง/วัน</p>
                {
                  dataChart.length === 0 ? <div className="spinDashboard"><Spin /> </div> : <Chart data={dataUpload} series={series} axes={axes} tooltip />
                }
              </div>
            </Col>
            <Col>
              <div className="chart" >
                <p style={{ textAlign: 'center' }}>กราฟแสดงการดึงไฟล์กี่ครั้ง/วัน</p>
                {
                  dataChart.length === 0 ? <div className="spinDashboard"><Spin /> </div> : <Chart data={dataGet} series={series} axes={axes} tooltip />
                }
              </div></Col>
          </Space>
        </Row>
      </div>
    </>
  )
}

export default Dashboard