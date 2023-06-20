import { Space } from 'antd'
import React, { useEffect, useState } from 'react'

const DocumentAPI = () => {
  const urlImage = 'document.pdf'

  return (
    <>
      <iframe src={urlImage} style={{ width: '100%', height: '100%' }} />
    </>
  )
}

export default DocumentAPI
