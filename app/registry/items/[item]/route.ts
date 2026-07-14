import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ item: string }> }
) {
  try {
    const { item } = await params

    // Read the pre-built registry item from public/r/{item}.json
    const itemPath = join(process.cwd(), "public", "r", `${item}.json`)

    if (!existsSync(itemPath)) {
      return NextResponse.json(
        { error: `Registry item '${item}' not found` },
        { status: 404 }
      )
    }

    const registryItem = JSON.parse(readFileSync(itemPath, "utf-8"))

    return NextResponse.json(registryItem, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error serving registry item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
