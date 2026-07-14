import { useEffect, useState } from "react";
import {
  loadTracks,
  type TracksLoadResult
} from './data/loadTracks'

function App() {
  const [result, setResult] = useState<TracksLoadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    return (
      <main>
        <h1>Spotify Lens</h1>
        <p aria-live="polite">Loading and parsing the dataset...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Spotify Lens</h1>
      <p>Loaded {result.rows.length.toLocaleString()} track-genre rows in {(result.elapsedMs / 1000).toFixed(2)} seconds.</p>
      <p>CSV parsing errors: {result.parseErrorCount}</p>
      <p>Invalid rows: {result.invalidRowCound}</p>
    </main>
  )
}

export default App