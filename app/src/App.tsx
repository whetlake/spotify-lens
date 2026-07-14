import { useEffect, useMemo, useState } from "react";
import {
  loadTracks,
  type TracksLoadResult
} from './data/loadTracks'
import { PageLayout } from "./components/PageLayout"
import { LoadingScreen } from "./components/LoadingScreen";
import { Header } from "./components/Header"
import "./App.css"
import {
  ParallelCoordinates,
  type AudioFeatureKey,
  type AudioFeatureRange,
  type AudioFeatureRanges
} from "./components/ParallelCoordinates";
import { GenreBarChart } from "./components/GenreBarChart"

function trackMatchesRanges(
  track: TracksLoadResult["rows"][number],
  ranges: [AudioFeatureKey, AudioFeatureRange[]][]
) {
  return ranges.every(([feature, featureRanges]) => {
    const value = track[feature]

    return featureRanges.some(([start, end]) => {
      const min = Math.min(start, end)
      const max = Math.max(start, end)

      return value >= min && value <= max
    })
  })
}

function App() {
  const [result, setResult] = useState<TracksLoadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [featureRanges, setFeatureRanges] = useState<AudioFeatureRanges>({})
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const matchingRows = useMemo(() => {
    if (!result) return []

    const ranges = Object.entries(featureRanges) as [AudioFeatureKey, AudioFeatureRange[]][]

    if (!ranges.length) {
      return result.rows
    }

    return result.rows.filter((track) => trackMatchesRanges(track, ranges))
  }, [result, featureRanges])

  useEffect(() => {
    let cancelled = false
    loadTracks()
      .then((data) => {
        if (!cancelled) setResult(data)
      })
    .catch((caughtError: unknown) => {
      if (!cancelled) {
        setError(
          caughtError instanceof Error ? caughtError.message : "An unknown error occured"
        )
      }
    })
    return () => { cancelled = true }
  }, [])

  if (error) {
    return (
      <main>
        <h1>Spotify Lens</h1>
        <p role="alert">Could not load the dataset: {error}</p>
      </main>
    )
  }

  if (!result) {
    return <LoadingScreen/>
  }

  return (
    <PageLayout>
      <Header
        rowCount={result.rows.length}
        matchingCount={matchingRows.length}
        elapsedMs={result.elapsedMs}
      />
      <ParallelCoordinates
        tracks={result.rows}
        matchingCount={matchingRows.length}
        selectedGenre={selectedGenre}
        featureRanges={featureRanges}
        onFeatureRangesChange={(nextFeatureRanges) => {
          setFeatureRanges(nextFeatureRanges)
          setSelectedGenre(null)
        }}
      />
      <GenreBarChart
        tracks={matchingRows}
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
        />
    </PageLayout>
  )
}

export default App
