'use client'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import colors from '~/app/UI/Theme/colors'

const primaryColor = colors.primary.main
const textColor = colors.text.main

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    position: 'relative',
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
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    borderRadius: 4,
    marginBottom: 5,
    paddingVertical: 6,
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
  productName: {
    fontSize: 11,
    color: '#333',
    paddingLeft: 5,
  },
  productSku: {
    fontSize: 9,
    color: '#777',
    marginTop: 2,
    paddingLeft: 5,
  },
  productQty: {
    fontSize: 11,
    width: '15%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 11,
    width: '20%',
    textAlign: 'center',
  },
  productTotal: {
    fontSize: 11,
    width: '25%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: primaryColor,
  },
  headerCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  ticketsSection: {
    marginTop: 20,
  },
  ticketCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ticketId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: primaryColor,
  },
  ticketTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
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

export const SalesOfTheDayReportPdf = ({ data = [] }) => {
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const validTickets = data.filter(ticket => ticket.products.length > 0)
  const totalSales = validTickets.reduce((sum, t) => sum + t.total, 0)

  const productMap = new Map()
  validTickets.forEach(ticket => {
    ticket.products.forEach(({ product, quantityProduct }) => {
      const existing = productMap.get(product.id) || {
        id: product.id,
        name: product.name,
        unit: product.unit,
        price: product.price,
        SKU: product.SKU,
        quantity: 0,
        total: 0,
      }
      existing.quantity += quantityProduct
      existing.total += product.price * quantityProduct
      productMap.set(product.id, existing)
    })
  })

  const groupedProducts = Array.from(productMap.values())
  const sortedProducts = [...groupedProducts].sort(
    (a, b) => b.quantity - a.quantity
  )
  const topProduct = sortedProducts.length > 0 ? sortedProducts[0] : null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Sales Report</Text>
          <Text style={styles.subtitle}>Summary of all sales made today</Text>
          <Text style={styles.reportDate}>Generated on: {formattedDate}</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: 'bold' }}>• Total sales: </Text>$
            {totalSales}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: 'bold' }}>• Top selling product: </Text>
            {topProduct
              ? `${topProduct.name} (${topProduct.quantity} units)`
              : 'N/A'}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: 'bold' }}>• Tickets: </Text>
            {validTickets.length}
          </Text>
        </View>

        {groupedProducts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Products Sold Today</Text>

            <View style={styles.tableHeader}>
              <Text
                style={[
                  styles.headerCell,
                  { width: '40%', textAlign: 'left', paddingLeft: 10 },
                ]}
              >
                Product
              </Text>
              <Text style={[styles.headerCell, { width: '15%' }]}>
                Quantity
              </Text>
              <Text style={[styles.headerCell, { width: '20%' }]}>
                Unit Price
              </Text>
              <Text style={[styles.headerCell, { width: '25%' }]}>Total</Text>
            </View>

            {sortedProducts.map((item, idx) => (
              <View
                key={idx}
                style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}
              >
                <View style={{ width: '40%' }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  {item.SKU && (
                    <Text style={styles.productSku}>SKU: {item.SKU}</Text>
                  )}
                </View>
                <Text style={styles.productQty}>{item.quantity}</Text>
                <Text style={styles.productPrice}>
                  ${item.price.toFixed(2)}
                </Text>
                <Text style={styles.productTotal}>
                  ${item.total.toFixed(2)}
                </Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>Tickets of the day</Text>

          {validTickets.map((ticket, idx) => (
            <View key={idx} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketId}>Ticket #{ticket.id}</Text>
                <Text style={styles.ticketTotal}>
                  ${ticket.total.toFixed(2)}
                </Text>
              </View>

              {ticket.products.map((product, pIdx) => (
                <View
                  key={pIdx}
                  style={{ flexDirection: 'row', marginBottom: 3 }}
                >
                  <Text style={{ fontSize: 10, width: '60%' }}>
                    {product.product.name} × {product.quantityProduct}
                  </Text>
                  <Text
                    style={{ fontSize: 10, width: '40%', textAlign: 'right' }}
                  >
                    $
                    {(product.product.price * product.quantityProduct).toFixed(
                      2
                    )}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Inventory System ©{new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  )
}
