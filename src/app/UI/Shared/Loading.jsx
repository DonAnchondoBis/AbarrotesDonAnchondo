'use client'
import { CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

const Overlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
})

const Loading = ({ size = 60 }) => {
  return (
    <Overlay>
      <CircularProgress size={size} />
    </Overlay>
  )
}

export default Loading
