import { readFileSync } from "fs"
import { join } from "path"

export async function GET() {
  try {
    // Read the pre-built registry from public/r/registry.json (object format for v0.dev)
    const registryPath = join(process.cwd(), "public", "r", "registry.json")
    const registryData = JSON.parse(readFileSync(registryPath, "utf-8"))

    return Response.json(registryData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error reading registry:", error)
    return Response.json(
      { error: "Registry not found. Run build first." },
      { status: 500 }
    )
  }
}
