import React, { useEffect, useState } from 'react'

export default function LoadingDots() {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => '.'.repeat((prev.length + 1) % 4))
    }, 500)

    return () => clearInterval(interval)
  }, [])
  return (
    <>
      Loading
      {dots}
    </>
  )
}
