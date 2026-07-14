import type { BalanceRow } from "./types"

const accountTypes = ["NOMINEE", "MGN-LONG", "OFFBOOK"] as const
const subtypesByType: Record<(typeof accountTypes)[number], string> = {
  NOMINEE: "RRSP",
  "MGN-LONG": "N/A",
  OFFBOOK: "RESP-FAM",
}

const totalValuePattern = [
  1234.56,
  789012.34,
  456789.12,
  321654.98,
  135792.46,
  246813.57,
  987654.32,
  654321.0,
  432198.76,
  567890.12,
  123456.78,
  890123.45,
  135246.8,
  246135.79,
  321987.65,
  654987.01,
  789654.21,
  876543.22,
  543210.98,
  112233.44,
]

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export function generateBalanceRows(totalRows = 220): BalanceRow[] {
  return Array.from({ length: totalRows }, (_, index) => {
    const accountNumber = 33 + index
    const account = `123-${String(accountNumber).padStart(4, "0")}-R`
    const accountType = accountTypes[index % accountTypes.length]
    const cash = round2(1234.56 + index * 1111.11)
    const buyingPower = round2(123456.77 - index * 0.01)
    const totalValue = totalValuePattern[index % totalValuePattern.length] ?? 0

    return {
      id: index + 1,
      account,
      currency: "CAD",
      accountType,
      accountSubtype: subtypesByType[accountType],
      cash,
      buyingPower,
      totalValue,
    }
  })
}
