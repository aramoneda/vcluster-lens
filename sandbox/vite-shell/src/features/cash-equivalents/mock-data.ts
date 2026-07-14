import type { CashRow } from "./types"

const firstNames = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "George",
  "Hannah",
  "Isaac",
  "Julia",
  "Kevin",
  "Laura",
  "Michael",
  "Nina",
  "Oscar",
  "Paula",
  "Quentin",
  "Rachel",
  "Steve",
  "Tina",
  "Umar",
  "Violet",
]

const lastNames = [
  "Smith",
  "Johnson",
  "Brown",
  "Prince",
  "Hunt",
  "Apple",
  "Washington",
  "Baker",
  "Newton",
  "Roberts",
  "Hart",
  "Croft",
  "Jordan",
  "Simone",
  "Wilde",
  "Abdul",
  "Tarantino",
  "Green",
  "Jobs",
  "Lane",
  "Ibrahim",
  "Turner",
]

const accountTypes = ["NOMINEE", "MGN-LONG", "OFFBOOK"] as const
const accountSubtypes = ["RRSP", "FRRI / LRIF", "RESP-FAM"] as const

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export function generateCashRows(totalRows = 220): CashRow[] {
  return Array.from({ length: totalRows }, (_, index) => {
    const accountNumber = 33 + index
    const account = `123-${String(accountNumber).padStart(4, "0")}-R`
    const clientName = `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`

    const pendingCash = round2(1234.56 + index * 1111.11)
    const pendingEquivalents = round2(123456.78 + index * 10876.54)
    const totalPending = round2(pendingCash + pendingEquivalents * 0.62)
    const settledCash = round2(1234.56 + index * 987.45)
    const settledEquivalents = round2(1234.56 + index * 879.34)
    const totalSettled = round2(settledCash + settledEquivalents)

    return {
      id: index + 1,
      account,
      clientName,
      accountType: accountTypes[index % accountTypes.length],
      accountSubtype: accountSubtypes[index % accountSubtypes.length],
      pendingCash,
      pendingEquivalents,
      totalPending,
      settledCash,
      settledEquivalents,
      totalSettled,
    }
  })
}
