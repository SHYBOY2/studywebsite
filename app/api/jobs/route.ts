export const runtime = "edge";
export const preferredRegion = "auto";

import { NextResponse } from "next/server";
import { fetchLatestJobs } from "@/lib/scraper";

export async function GET() {
    const jobs = await fetchLatestJobs();
    return NextResponse.json(jobs);
}
