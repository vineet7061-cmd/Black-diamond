import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in environment variables" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Analyze this unformatted blast report text carefully. It may have varying formats, spellings, or missing optional fields (like pilot holes or lead NTDs which should default to 0).
    Extract the details and return ONLY a valid JSON object without any markdown tags or backticks.

    Keys required in JSON:
    - "date": string in YYYY-MM-DD format (convert DD/MM/YYYY if found)
    - "face": string
    - "location": string
    - "blastingTime": string (e.g. "2:30 PM")
    - "holesMain": number
    - "holesPilot": number (default 0 if missing)
    - "benchHeight": number
    - "depthMain": number
    - "depthPilot": number (default 0)
    - "burden": number
    - "spacing": number
    - "stemmingMain": number
    - "stemmingPilot": number (default 0)
    - "cphMain": number
    - "cphPilot": number (default 0)
    - "mcdMain": number
    - "mcdPilot": number (default 0)
    - "explosiveQty": number
    - "volume": number
    - "pf": number
    - "cf": number
    - "ntd17": number
    - "ntd25": number
    - "ntd42": number
    - "ntdLead17": number (default 0)
    - "ntdLead25": number (default 0)
    - "ntdLead42": number (default 0)
    - "sureBlast": number (default 0)
    - "ikon": number (default 0)
    - "initialDensity": number
    - "finalDensity": number
    - "booster": number
    - "dth10m": number
    - "dth6m": number
    - "vibration": number
    - "db": number (Peak Overpressure)
    - "distance": number
    - "manPower": number

    Here is the text to analyze:
    ${text}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(responseText)

    return NextResponse.json({ success: true, data: parsed })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}