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
  productCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productInfo: {
    fontSize: 10,
    color: '#555',
    marginBottom: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    borderRadius: 4,
    marginBottom: 5,
    paddingVertical: 6,
    marginTop: 8,
  },
  headerCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 11,
    flex: 1.5,
    textAlign: 'center',
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

export const InventoryReportPdf = ({ data = [] }) => {
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const inventoryReport = data.map(item => {
    const product = item.product
    const lots = data.filter(i => i.productId === product.id)
    const totalStock = lots.reduce((sum, lot) => sum + lot.currentAmount, 0)
    return {
      ...product,
      lots,
      totalStock,
    }
  })

  const uniqueProducts = Array.from(
    new Map(inventoryReport.map(p => [p.id, p])).values()
  )

  const totalProducts = uniqueProducts.length
  const totalItems = uniqueProducts.reduce(
    (sum, product) => sum + product.totalStock,
    0
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Inventory Report</Text>
          <Text style={styles.subtitle}>Current inventory status</Text>
          <Text style={styles.reportDate}>Generated on: {formattedDate}</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: 'bold' }}>
              • Products in inventory:{' '}
            </Text>
            {totalProducts} different products
          </Text>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: 'bold' }}>• Total units: </Text>
            {totalItems} units in stock
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Product Details</Text>

        {uniqueProducts.map(product => (
          <View key={product.id} style={styles.productCard} wrap={false}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productInfo}>
              SKU: {product.SKU || 'N/A'} | Unit Price: ${product.price}
            </Text>
            <Text style={styles.productInfo}>
              Total stock: {product.totalStock}{' '}
              {product.unit === 'PIECE' ? 'units' : product.unit.toLowerCase()}
            </Text>

            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Batch</Text>
              <Text style={styles.headerCell}>Quantity</Text>
              <Text style={styles.headerCell}>Expiration Date</Text>
            </View>

            {product.lots.map((lot, idx) => (
              <View key={lot.id} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                <Text style={styles.tableCell}>{lot.id}</Text>
                <Text style={styles.tableCell}>{lot.currentAmount}</Text>
                <Text style={styles.tableCell}>{lot.expirationDate}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>
          Inventory System ©{new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  )
}
