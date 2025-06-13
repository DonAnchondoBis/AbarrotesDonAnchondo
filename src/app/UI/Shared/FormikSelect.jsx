'use client'
import { useFormikContext } from 'formik'
import { FormControl, InputLabel, Select, MenuItem, Typography as T } from '@mui/material'

const FormikSelect = ({ label, options, field, ...props }) => {
  const { errors, setFieldValue } = useFormikContext()

  return (
    <FormControl fullWidth error={Boolean(errors[field?.name])}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...props}
        name={field?.name}
        value={field?.value || ''}
        onChange={event => setFieldValue(field?.name, event.target.value)}
        label={label}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors[field?.name] ? <T color="error" variant="caption">{errors[field?.name]}</T> : null}
    </FormControl>
  )
}

export default FormikSelect