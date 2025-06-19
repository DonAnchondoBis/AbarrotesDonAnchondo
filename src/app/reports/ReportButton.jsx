import { PDFDownloadLink } from '@react-pdf/renderer'
import { InventoryReportPdf } from './ReportsBase'
import { Button } from '@mui/material'

export const ReportButton = ({ category, data }) => {
  return (
    <div>
      <PDFDownloadLink
        document={
          category === 'inventory' ? <InventoryReportPdf data={data} /> : <></>
        }
        fileName={`InventoryReport_${new Date().toLocaleDateString()}.pdf`}
      >
        <Button variant="contained" color="green">
          Generate Report
        </Button>
      </PDFDownloadLink>
    </div>
  )
}
