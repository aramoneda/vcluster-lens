import { read, utils } from 'xlsx';
import path from 'node:path';

for (const file of [
  'data/ics-aem-vulnerabilities-critical_acc-931938.xlsx',
  'data/ics-aem-risk-issues_acc-4ca431.xlsx',
]) {
  const workbook = read(file, { cellDates: true, dense: false });
  console.log(`\nFILE: ${file}`);
  console.log('SHEETS:', workbook.SheetNames);
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    console.log('REF:', sheet['!ref']);
    const range = sheet['!ref'] ? utils.decode_range(sheet['!ref']) : null;
    if (range) {
      const cells = [];
      for (let r = range.s.r; r <= Math.min(range.e.r, range.s.r + 8); r++) {
        const row = [];
        for (let c = range.s.c; c <= Math.min(range.e.c, range.s.c + 12); c++) {
          const address = utils.encode_cell({ r, c });
          row.push({ address, value: sheet[address]?.v ?? null, type: sheet[address]?.t ?? null });
        }
        cells.push(row);
      }
      console.log(JSON.stringify(cells, null, 2));
    }
    const rows = utils.sheet_to_json(sheet, { defval: null, raw: false });
    console.log(`SHEET: ${name} ROWS: ${rows.length}`);
    console.log(JSON.stringify(rows.slice(0, 3), null, 2));
  }
}
void path;
