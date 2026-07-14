/**
 * Loads and parses the Spotify CSV in the browser, validates its structure
 * and converts numeric columns. It also records the loading time and any
 * parsing issues. Loading time can be used to evaluate performance.
 */

import Papa from "papaparse"
import {
    ALL_FIELDS,
    NUMERIC_FIELDS,
    type TrackRow
} from "../types/TrackRow"

export interface TracksLoadResult {
    rows: TrackRow[],
    elapsedMs: number, // how long is loading and parsing taking
    parseErrorCount: number,
    invalidRowCound: number
}

// This defines which columns from the CSV that are initialyy text,
// should be converted to numbers
const dynamicTyping = Object.fromEntries(
    NUMERIC_FIELDS.map((field) => [field, true])
)

// Reuse the same loading promise because React (e.g. StrictMode) runs effects twice
// We dont want to load the data twice
let cachedLoad: Promise<TracksLoadResult> | undefined

async function parsedTracks(): Promise<TracksLoadResult> {
    const startedAt = performance.now()
    const csvUrl = new URL(
        `${import.meta.env.BASE_URL}data/SpotifyFeatures.csv`,
        window.location.origin
    ).href

    const response = await fetch(csvUrl)
    if (!response.ok) {
        throw new Error(`Could not load dataset: ${response.status} ${response.statusText}`)
    }

    // Fetch the CSV as text first. This is more reliable on GitHub Pages than
    // letting Papa Parse do the download internally.
    const csvText = await response.text()

    const results = Papa.parse<TrackRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping
    })

    const columnNames = results.meta.fields ?? []
    const missingColumns = ALL_FIELDS.filter(
        (field) => !columnNames.includes(field)
    )
    if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(", ")}`)
    }

    const invalidRowCound = results.data.filter(
        (row) =>
            !row.track_id ||
            !row.genre ||
            NUMERIC_FIELDS.some(
                (field) => !Number.isFinite(row[field])
            )
    ).length

    return {
        rows: results.data,
        elapsedMs: performance.now() - startedAt,
        parseErrorCount: results.errors.length,
        invalidRowCound
    }
}

export function loadTracks(): Promise<TracksLoadResult> {
    if (!cachedLoad) {
        cachedLoad = parsedTracks().catch((error) => {
            cachedLoad = undefined; throw error
        })
    }
    return cachedLoad
}
