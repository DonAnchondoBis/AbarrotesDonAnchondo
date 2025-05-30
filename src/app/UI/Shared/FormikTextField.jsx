'use client'
import { useState } from 'react'
import {
  Stack,
  TextField,
  Typography as T,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useFormikContext } from 'formik'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'


const FormikTextField = ({
  variant = 'standard',
  field,
  password,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const { errors, setFieldValue } = useFormikContext()
  return (
    <Stack spacing={1}>
      <TextField
        {...props}
        error={Boolean(errors[field?.name])}
        variant={variant}
        name={field?.name}
        value={field?.value}
        onChange={({ target }) => setFieldValue(field?.name, target.value)}
        slotProps={password ? {
          input: {
            type: password && !showPassword ? 'password' : 'text',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            )
          }
        }: null}
      />
      {errors[field?.name] ? <T color="error">{errors[field?.name]}</T> : null}
    </Stack>
  )
}

export default FormikTextField