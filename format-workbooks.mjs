import ExcelJS from 'exceljs'
import path from 'node:path'

const files = [
  'data/ics-aem-vulnerabilities-critical_acc-931938-repaired.xlsx',
  'data/ics-aem-risk-issues_acc-4ca431-repaired.xlsx',
]

const navy = '172554'
const blue = '2563EB'
const paleBlue = 'DBEAFE'
const border = { style: 'thin', color: { argb: 'CBD5E1' } }

function isJsonLike(value) {
  return typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['))
}

for (const input of files) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(input)
  for (const worksheet of workbook.worksheets) {
    const header = worksheet.getRow(1)
    const lastColumn = worksheet.columnCount
    const lastRow = worksheet.rowCount
    worksheet.views = [{ state: 'frozen', ySplit: 1, xSplit: 1, showGridLines: false }]
    worksheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: lastRow, column: lastColumn } }
    worksheet.properties.defaultRowHeight = 30
    header.height = 36

    header.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { name: 'Aptos Display', size: 11, bold: true, color: { argb: 'FFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: navy } }
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
      cell.border = { top: border, bottom: border }
    })

    for (let col = 1; col <= lastColumn; col++) {
      const column = worksheet.getColumn(col)
      const headerText = String(worksheet.getCell(1, col).value ?? '').trim()
      let maxLength = Math.min(Math.max(headerText.length + 2, 12), 32)
      let jsonColumn = false
      for (let row = 2; row <= lastRow; row++) {
        const cell = worksheet.getCell(row, col)
        const value = cell.value
        const text = value == null ? '' : String(value)
        jsonColumn ||= isJsonLike(text)
        maxLength = Math.max(maxLength, Math.min(text.split(/\\r?\\n/)[0].length + 2, 32))
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
        cell.border = { bottom: border }
        if (row % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } }
        if (/severity/i.test(headerText) && /high|critical/i.test(text)) cell.font = { color: { argb: 'B91C1C' }, bold: true }
        if (/status/i.test(headerText) && text) cell.font = { color: { argb: '1D4ED8' }, bold: true }
        if (/date|created|resolved|time/i.test(headerText) && typeof value === 'number') cell.numFmt = 'm/d/yyyy h:mm AM/PM'
      }
      if (jsonColumn) maxLength = 34
      if (/description|resolution|remediation|resource|tags|json|details/i.test(headerText)) maxLength = Math.max(maxLength, 28)
      if (/id|arn|uuid|guid/i.test(headerText)) maxLength = Math.min(Math.max(maxLength, 22), 30)
      column.width = Math.min(maxLength, 42)
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) row.height = 42
    })
    worksheet.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
    worksheet.pageMargins = { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 }
  }
  const output = input.replace('-repaired.xlsx', '-readable.xlsx')
  await workbook.xlsx.writeFile(output)
  console.log(`WROTE ${path.basename(output)}`)
}
