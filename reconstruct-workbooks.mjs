import ExcelJS from 'exceljs'
import fs from 'node:fs'

const jobs = [
  ['data/ics-aem-vulnerabilities-critical_acc-931938-readable.xlsx', 'data/ics-aem-vulnerabilities-critical_acc-931938-final.xlsx'],
  ['data/ics-aem-risk-issues_acc-4ca431-readable.xlsx', 'data/ics-aem-risk-issues_acc-4ca431-final.xlsx'],
]

function text(value) {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object' && 'text' in value) return String(value.text)
  return String(value)
}

function looksLikeRecordStart(value) {
  const v = text(value).trim()
  return /^\d{1,4}[/-]\d{1,2}[/-]\d{1,4}/.test(v) || /^\d{4}-\d{2}-\d{2}/.test(v)
}

for (const [input, output] of jobs) {
  const source = new ExcelJS.Workbook()
  await source.xlsx.readFile(input)
  const sourceSheet = source.worksheets[0]
  const rawRows = []
  sourceSheet.eachRow({ includeEmpty: true }, row => {
    rawRows.push(row.values.slice(1).map(text))
  })

  const headerIndex = rawRows.findIndex(row => row.some(v => v.trim().toLowerCase() === 'created at' || v.trim().toLowerCase() === 'created_at'))
  const header = headerIndex >= 0 ? rawRows[headerIndex] : rawRows[0]
  const body = rawRows.slice(headerIndex >= 0 ? headerIndex + 1 : 1)
  const width = Math.max(header.length, ...body.map(row => row.length), 1)
  while (header.length < width) header.push(`Additional field ${header.length + 1}`)

  const logical = []
  for (const inputRow of body) {
    const row = [...inputRow]
    while (row.length < width) row.push('')
    const hasContent = row.some(v => v.trim() !== '')
    if (!hasContent) continue
    if (!logical.length || looksLikeRecordStart(row[0])) {
      logical.push(row)
    } else {
      const target = logical[logical.length - 1]
      for (let i = 0; i < width; i++) {
        if (!row[i]) continue
        target[i] = target[i] ? `${target[i]}\n${row[i]}` : row[i]
      }
    }
  }

  const out = new ExcelJS.Workbook()
  out.creator = 'v0 workbook repair'
  out.created = new Date()
  const sheet = out.addWorksheet('Readable Issues', { views: [{ state: 'frozen', ySplit: 1 }] })
  sheet.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + Math.min(width, 26))}1` }
  sheet.addRow(header)
  for (const row of logical) sheet.addRow(row)

  sheet.getRow(1).height = 30
  sheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F3A70' } }
    cell.alignment = { vertical: 'middle', wrapText: true }
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF172554' } } }
  })
  sheet.eachRow((row, index) => {
    if (index > 1) {
      row.alignment = { vertical: 'top', wrapText: true }
      row.height = 42
      if (index % 2 === 0) row.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F6FA' } } })
    }
  })
  sheet.columns.forEach((column, index) => {
    const name = text(header[index]).toLowerCase()
    column.width = name.includes('description') || name.includes('resolution') || name.includes('resource') || name.includes('json') ? 34 : name.includes('url') ? 42 : 20
  })
  sheet.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9 }
  sheet.pageSetup.margins = { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 }

  const raw = out.addWorksheet('Raw Data', { views: [{ state: 'frozen', ySplit: 1 }] })
  raw.addRow(['Source row', 'Original cell values'])
  rawRows.forEach((row, i) => raw.addRow([i + 1, row.join(' | ')]))
  raw.getRow(1).eachCell(cell => { cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF475569' } } })
  raw.getColumn(1).width = 14
  raw.getColumn(2).width = 140
  raw.getColumn(2).alignment = { wrapText: true, vertical: 'top' }
  raw.autoFilter = 'A1:B1'

  await out.xlsx.writeFile(output)
  console.log(`${output}: ${logical.length} logical records; ${rawRows.length} raw rows preserved`)
}
