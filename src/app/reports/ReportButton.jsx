'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@mui/material'

import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { InventoryReportPdf } from './InventoryReportPdf'
import { ShrinkageReportPdf } from './ShrinkageReportPdf'
import { SalesOfTheDayReportPdf } from './SalesOfTheDayReportPdf'

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
  if (!hasValidData) {
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

  const getReportDocument = (category, data) => {
    switch (category) {
      case 'inventory':
        return <InventoryReportPdf data={data} />
      case 'shrinkage':
        return <ShrinkageReportPdf data={data} />
      case 'salesOfTheDay':
        return <SalesOfTheDayReportPdf data={data} />
      default:
        return <></>
    }
  }

  return (
    <Container>
      <PDFDownloadLink
        document={getReportDocument(category, data)}
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
