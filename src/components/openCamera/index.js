import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Button,
  message,
  Space,
  Select,
  Form,
  Input,
  Row,
  Col,
  DatePicker
} from 'antd'
import Webcam from 'react-webcam'
import 'react-image-crop/dist/ReactCrop.css'
import { httpClient } from 'HttpClient.js'
import ReactCrop from 'react-image-crop'
import Insert from '../insert'
import moment from 'moment'


const { Option } = Select

const OpenCamera = (props) => {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState({ unit: '%', width: 30, height: 7 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [baseImage, setBaseImage] = useState('')
  const [recipient, setRecipient] = useState('')
  const [exportName, setExportName] = useState('')
  const [userId, setUserId] = useState('')
  const [dataCategory, setDataCategory] = useState('')
  const [dataDate, setDataDate] = useState('')
  const [form] = Form.useForm()
  const webcamRef = useRef('')
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }, [webcamRef, setImgSrc])

  useEffect(() => {
    getCroppedImg()
    getCategory()
  }, [completedCrop])

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
  const getCroppedImg = () => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const crop = completedCrop
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')
    const pixelRatio = window.devicePixelRatio

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
    const base64Image = canvas.toDataURL('image/png')
    setBaseImage(base64Image)
  }

  const onLoad = useCallback((img) => {
    imgRef.current = img
  }, [])

  //สแกนชื่อผู้รับ
  const onRecipient = (e) => {
    var formData = new FormData()
    formData.append('name', baseImage)
    httpClient
      .post('/upload_base64', formData)
      .then(function (result) {
        const code = result.status
        if (code === 200) {
          message.success('ค้นหาข้อมูลสำเร็จ กรุณาเลือกผู้รับ')
          const data = result.data.data
          const dataMap = data.map((item, i) => {
            item.name = item.user_fname + ' ' + item.user_lname
            return item
          })
          console.log('dataMap', dataMap)
          setRecipient(dataMap)
        } else {
          message.error('ไม่พบข้อมูล')
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  // สแกนชื่อผู้ส่ง
  const onExport = (e) => {
    var formData = new FormData()
    formData.append('name', baseImage)
    httpClient
      .post('/upload_sender', formData)
      .then(function (result) {
        console.log(`result`, result)

        const code = result.status
        if (code === 200) {
          message.success('ค้นหาข้อมูลสำเร็จ')
        } else {
          message.error('ไม่พบข้อมูล')
        }
        setExportName(result.data.data)
      })
      .catch(function (error) {
        console.log('error', error)
      })
  }

  const handleChange = (value) => {
    setUserId(value)
  }

  const onFinish = () => {
    const params = {
      user_id: userId,
      export_name: exportName,
      category_id: parseInt(form.getFieldValue('category_id')),
    }
    props.onSetDataForm(params)
  }

  const onSubmit = () => {
    const params = {
      user_id: userId,
      export_name: exportName,
      category_id: parseInt(form.getFieldValue('category_id')),
    }
    console.log('params', params)
    httpClient
      .post('/add_letter', params)
      .then(function (response) {
        console.log(`response`, response.status)
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

  const onSelectDate = (date, _) => {
    setDataDate(date.format('YYYY-DD-MM H:mm:ss '))
  }

  const disabledDate = (current) => {
    return current && current > moment().endOf('day')
  }
  return (
    <>
      <Row gutter={16}>
        <Col span={12} className="div-1">
          <div>
            <Space>
              <Webcam
                width={'600px'}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
              <Button type="primary" onClick={capture}>
                ระบุข้อมูลผู้รับ/ผู้ส่ง
              </Button>
            </Space>
            <ReactCrop
              src={imgSrc}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            />

            <div className="App">
              <div>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: Math.round(completedCrop?.width ?? 0),
                    height: Math.round(completedCrop?.height ?? 0),
                  }}
                />
              </div>
              <Space>
                <Button
                  disabled={!completedCrop?.width || !completedCrop?.height}
                  onClick={onRecipient}
                >
                  ค้นหาชื่อผู้รับ
                </Button>
                <Select
                  disabled={!completedCrop?.width || !completedCrop?.height}
                  style={{ width: 260 }}
                  onChange={handleChange}
                  placeholder="--- กรุณาเลือกชื่อผู้รับ ---"
                  rules={[{ required: true, message: 'กรุณาเลือกชื่อผู้รับ!' }]}
                >
                  {recipient &&
                    recipient.map((e, i) => {
                      return (
                        <Option key={i} value={e.user_id}>
                          {e.user_fname} {e.user_lname}
                        </Option>
                      )
                    })}
                </Select>
              </Space>
              <br />
              <br />
              <Space>
                <Button
                  disabled={!completedCrop?.width || !completedCrop?.height}
                  onClick={onExport}
                >
                  ค้นหาชื่อผู้ส่ง
                </Button>
                <Input
                    placeholder="กรุณากรอกชื่อผู้ส่ง"

                  style={{ width: 300 }}
                  onChange={(e) => setExportName(e.target.value)}
                  value={exportName}
                />
              </Space>
              <br />
              <br />
              <Form form={form} name="nest-messages" onFinish={onFinish}>
                <Form.Item name="date" label="วันที่รับ">
                  <DatePicker
                    onChange={onSelectDate}
                    disabledDate={disabledDate}
                    placeholder="--- โปรดเลือก ---"
                  />
                </Form.Item>
                <Form.Item name="category_id" label="ประเภท ">
                  <Select
                    placeholder="--- กรุณาเลือกประเภท ---"
                    style={{ width: 200 }}
                  >
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
                <Form.Item>
                  <Space>
                    <Button type="primary" onClick={onSubmit}>
                      บันทึกข้อมูล
                    </Button>
                    <Button href="/home">ยกเลิก</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
        <Col span={12} className="div-2" gutter={10}>
          <div>
            <Insert />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default OpenCamera
