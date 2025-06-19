import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  borderRadius: '1rem',
  backgroundColor: theme.palette.background.default,
  border: `2px dashed ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  minHeight: '250px',
  textAlign: 'center',
  gap: '1rem',
}))

const EmptyState = ({ icon, title, subtitle }) => {
  return (
    <StyledBox>
      {icon}
      <Typography variant="h6" color='primary'>{title}</Typography>
      {subtitle && (
        <Typography variant="body2" color="primary">
          {subtitle}
        </Typography>
      )}
    </StyledBox>
  )
}

export default EmptyState
