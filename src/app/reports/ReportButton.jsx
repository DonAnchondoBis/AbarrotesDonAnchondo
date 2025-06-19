'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { InventoryReportPdf } from './ReportsBase'
import { Button } from '@mui/material'

import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'ShrinkageTable'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  padding:'1rem 0',
  [`& .${classes.button}`]: {
    color: theme.palette.background.main,
    textDecoration: 'none',
  },
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'none',
    },
  }
}))

export const ReportButton = ({ category = '', data = [] }) => {
  const hasValidData = data.length > 0
  // TODO: DELETE THIS CONDITION WHEN WE HAVE REPORTS FOR ALL CATEGORIES
  if (!hasValidData || category !== 'inventory') {
    return (
      <Button
        variant="contained"
        color="green"
        disabled={true}
      >
        No data to generate report
      </Button>
    )
  }
  return (
    <Container>
      <PDFDownloadLink
        document={
          category === 'inventory' ? <InventoryReportPdf data={data} /> : <></>
        }
        fileName={`${category}Report_${new Date().toLocaleDateString()}.pdf`}
      >
        <Button
          variant="contained"
          color="green"
          className={classes.button}
        >
          Generate Report
        </Button>
      </PDFDownloadLink>
    </Container>
  )
}
