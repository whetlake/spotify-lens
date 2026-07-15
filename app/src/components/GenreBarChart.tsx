import { useMemo } from "react"
import Plot from "react-plotly.js"
import type { TrackRow } from "../types/TrackRow"
import type { PlotMouseEvent } from "plotly.js"

interface GenreBarChartProps {
    tracks: TrackRow[],
    selectedGenre: string | null,
    onGenreSelect: (genre: string | null) => void
}

export function GenreBarChart({tracks, selectedGenre, onGenreSelect}: GenreBarChartProps) {
    const genreCounts = useMemo(() => {
        return [...tracks.reduce((counts, track) => {
            counts.set(track.genre, (counts.get(track.genre) ?? 0) + 1)

            return counts
        }, new Map<string, number>())].sort((a, b) => b[1] - a[1])
    }, [tracks])

    const genres = genreCounts.map(([genre]) => genre)
    const counts = genreCounts.map(([,count]) => count)

    return (
        <section className="genre-bar-chart">
            <div className="genre-bar-chart-heading">
                <div>
                    <h2>Rows by genre</h2>
                    <p>Click a bar to focus a genre.</p>
                </div>
                {selectedGenre && (
                    <button
                        className="genre-reset-button"
                        type="button"
                        onClick={() => { onGenreSelect(null) }}
                    >
                        Reset genre
                    </button>
                )}
            </div>

            <Plot
                data={[
                    {
                        type: "bar",
                        orientation: "h",
                        x: counts,
                        y: genres,
                        marker: {
                            color: genreCounts.map(([genre]) => {
                                if (!selectedGenre) return "#2463eb"
                                return genre === selectedGenre ? "#2563eb" : "#cbd5e1"
                            })
                        },
                        hovertemplate: "%{y}<br>%{x:,} rows<extra></extra>"
                    }
                ]}
                layout={{
                    autosize: true,
                    margin: {
                        top: 20,
                        right: 24,
                        bottom: 40,
                        left: 150
                    },
                    xaxis: {
                        title: {
                            text: "Rows"
                        }
                    },
                    yaxis: {
                        autorange: "reversed",
                        automargin: true,
                        tickmode: "array",
                        tickvals: genres,
                        ticktext: genres
                    }
                }}
                config={{
                    responsive: true,
                    displaylogo: false
                }}
                useResizeHandler
                style={{
                    width: "100%",
                    height: `620px`
                }}
                onClick={(event: PlotMouseEvent) => {
                    const genre = event.points[0]?.y
                    if (typeof genre !== "string") return
                    onGenreSelect(genre === selectedGenre ? null : genre)
                }}
            />
        </section>
    )
}
