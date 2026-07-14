import { useMemo } from "react";
import Plot from "react-plotly.js"
import type { PlotRestyleEvent } from "plotly.js"
import type { TrackRow } from "../types/TrackRow";

const AUDIO_FEATURES = [
    { key: "acousticness", label: "Acousticness" },
    { key: "danceability", label: "Danceability" },
    { key: "energy", label: "Energy" },
    { key: "instrumentalness", label: "Instrumentalness" },
    { key: "liveness", label: "Liveness" },
    { key: "speechiness", label: "Speechiness" },
    { key: "valence", label: "Valence" },
    { key: "tempo", label: "Tempo" },
    { key: "loudness", label: "Loudness "}
] as const

export type AudioFeatureKey = typeof AUDIO_FEATURES[number]["key"]
export type AudioFeatureRange = [number, number]
export type AudioFeatureRanges = Partial<Record<AudioFeatureKey, AudioFeatureRange[]>>

interface ParallelCoordinatesProps {
    tracks: TrackRow[]
    matchingCount: number
    focusedCount: number
    selectedGenre: string | null
    featureRanges: AudioFeatureRanges
    onFeatureRangesChange: (featureRanges: AudioFeatureRanges) => void
}

// Convert plotly messy data into a typed feature range
function isNumberRange(value: unknown): value is AudioFeatureRange {
    return (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === "number" &&
        typeof value[1] === "number"
    )
}

// Plotly can return one or more ranges so we need to
// normalize both cases into an array of ranges
function normalizeConstraintRange(value: unknown) {
    if (value === null) return undefined
    const rangeValue = Array.isArray(value) && value.length === 1 ? value[0] : value
    if (isNumberRange(rangeValue)) return [rangeValue]
    if (Array.isArray(rangeValue) && rangeValue.every(isNumberRange)) {
        return rangeValue
    }
    return undefined
}

function getNextFeatureRanges(event: PlotRestyleEvent, featureRanges: AudioFeatureRanges) {
    const [update] = event
    const nextFeatureRanges = {...featureRanges}
    Object.entries(update).forEach(([key, value]) => {
        const match = key.match(/^dimensions\[(\d+)]\.constraintrange$/)
        if (!match) return
        const feature = AUDIO_FEATURES[Number(match[1])]
        if (!feature) return
        const ranges = normalizeConstraintRange(value)
        if (ranges) {
            nextFeatureRanges[feature.key] = ranges
            return
        }
        delete nextFeatureRanges[feature.key]
    })
    return nextFeatureRanges
}

export function ParallelCoordinates({
    tracks,
    matchingCount,
    focusedCount,
    selectedGenre,
    featureRanges,
    onFeatureRangesChange
}: ParallelCoordinatesProps) {
    const plotData = useMemo(() => {
        const dimensions = AUDIO_FEATURES.map((feature) => ({
            label: feature.label,
            values: tracks.map((track) => track[feature.key]),
            constraintrange: featureRanges[feature.key]
        }))
        const lineColor = selectedGenre ? tracks.map((track) => track.genre === selectedGenre ? 1 : 0) : "#2563eb"
        return { dimensions, lineColor }
    }, [tracks, featureRanges, selectedGenre])

    return (
        <section className="parallel-coordinates">
            <div className="parallel-coordinates-heading">
                <h2>Audio feature ranges</h2>
                <p>
                    {selectedGenre
                        ? `Showing ${focusedCount.toLocaleString()} ${selectedGenre} rows within ${matchingCount.toLocaleString()} matching rows.`
                        : `Showing ${matchingCount.toLocaleString()} of ${tracks.length.toLocaleString()} track–genre rows.`
                    }
                </p>
            </div>

            <Plot
                data={[
                    {
                        type: "parcoords",
                        line: selectedGenre
                            ? {
                                color: plotData.lineColor,
                                colorscale: [
                                    [0, "#cbd5e1"],
                                    [0.5, "#cbd5e1"],
                                    [0.5, "#2563eb"],
                                    [1, "#2563eb"]
                                ],
                                cmin: 0,
                                cmax: 1,
                                showscale: false
                            } : { color: "#2563eb"},
                        unselected: {
                            line: {
                                color: "#94a3b8",
                                opacity: 0.05
                            }
                        },
                        dimensions: plotData.dimensions
                    }
                ]}
                layout={{
                    autosize: true,
                    margin: {
                        top: 50,
                        right: 40,
                        bottom: 30,
                        left: 40
                    }
                }}
                config={{
                    responsive: true,
                    displaylogo: false
                }}
                onRestyle={(event) => {
                    onFeatureRangesChange(
                        getNextFeatureRanges(event, featureRanges)
                    )
                }}
                useResizeHandler
                style={{
                    width: "100%",
                    height: "620px"
                }}
            />
        </section>
    )
}
