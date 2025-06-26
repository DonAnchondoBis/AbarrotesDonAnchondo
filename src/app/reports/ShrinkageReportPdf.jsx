'use client'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import colors from '~/app/UI/Theme/colors'

const primaryColor = colors.primary.main
const textColor = colors.text.main

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: textColor,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: primaryColor,
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  reportDate: {
    fontSize: 10,
    textAlign: 'right',
    color: '#999',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: textColor,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 5,
    textTransform: 'uppercase',
  },
  shrinkCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  shrinkHeaderBox: {
    backgroundColor: primaryColor,
    padding: 6,
    borderRadius: 4,
  },
  shrinkHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  shrinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    rowGap: 4,
    paddingHorizontal: 8,
  },
  shrinkGridColumn: {
    width: '50%',
  },
  shrinkInfo: {
    fontSize: 10,
    color: '#555',
    marginBottom: 3,
  },
  shrinkValue: {
    fontWeight: 'bold',
    color: primaryColor,
  },
  summaryBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
  },
  summaryText: {
    fontSize: 12,
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  },
})

export const ShrinkageReportPdf = ({ data = [] }) => {
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const totalItems = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Shrinkage Report</Text>
          <Text style={styles.subtitle}>Summary of product loss incidents</Text>
          <Text style={styles.reportDate}>Generated on: {formattedDate}</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: 'bold' }}>• Total shrinkage records: </Text>
            {data.length}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: 'bold' }}>• Total units lost: </Text>
            {totalItems}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Shrinkage Details</Text>

        {data.map(item => (
          <View key={item.id} style={styles.shrinkCard} wrap={false}>
            <View style={styles.shrinkHeaderBox}>
              <Text style={styles.shrinkHeaderText}>{item.productName}</Text>
            </View>

            <View style={styles.shrinkGrid}>
              <View style={styles.shrinkGridColumn}>
                <Text style={styles.shrinkInfo}>
                  <Text style={styles.shrinkValue}>Date: </Text>
                  {item.date}
                </Text>
              </View>
              <View style={styles.shrinkGridColumn}>
                <Text style={styles.shrinkInfo}>
                  <Text style={styles.shrinkValue}>Expiration date: </Text>
                  {item.expirationDate}
                </Text>
              </View>
              <View style={styles.shrinkGridColumn}>
                <Text style={styles.shrinkInfo}>
                  <Text style={styles.shrinkValue}>Reported by: </Text>
                  {item.user}
                </Text>
              </View>
              <View style={styles.shrinkGridColumn}>
                <Text style={styles.shrinkInfo}>
                  <Text style={styles.shrinkValue}>Quantity: </Text>
                  {item.amount}
                </Text>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={styles.shrinkInfo}>
                  <Text style={styles.shrinkValue}>Description: </Text>
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          Inventory System ©{new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  )
}
