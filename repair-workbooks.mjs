import fs from 'node:fs';
import { read, utils, write } from 'xlsx';

const inputs = [
  ['data/ics-aem-vulnerabilities-critical_acc-931938.xlsx', 'data/ics-aem-vulnerabilities-critical_acc-931938-repaired.xlsx'],
  ['data/ics-aem-risk-issues_acc-4ca431.xlsx', 'data/ics-aem-risk-issues_acc-4ca431-repaired.xlsx'],
];

for (const [input, output] of inputs) {
  const bytes = fs.readFileSync(input);
  const text = bytes.toString('utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const sample = lines.slice(0, 5).join('\n');
  const candidates = [',', '\t', ';', '|'];
  const delimiter = candidates
    .map((candidate) => ({ candidate, score: lines.slice(0, 20).reduce((sum, line) => sum + (line.split(candidate).length - 1), 0) }))
    .sort((a, b) => b.score - a.score)[0].candidate;
  console.log(`${input}: delimiter=${JSON.stringify(delimiter)}, lines=${lines.length}`);
  console.log(sample.slice(0, 1000));
  const workbook = read(text, { type: 'string', FS: delimiter, raw: false, cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const clean = rows.filter((row) => row.some((cell) => String(cell).trim() !== ''));
  const repaired = utils.book_new();
  utils.book_append_sheet(repaired, utils.aoa_to_sheet(clean), 'Data');
  const outputBytes = write(repaired, { bookType: 'xlsx', type: 'buffer', compression: true });
  fs.writeFileSync(output, outputBytes);
  console.log(`${output}: rows=${clean.length}, columns=${Math.max(0, ...clean.map((row) => row.length))}`);
}
