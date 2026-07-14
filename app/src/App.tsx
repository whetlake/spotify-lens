import { useEffect, useState } from "react";
import {
  loadTracks,
  type TracksLoadResult
} from './data/loadTracks'
import { PageLayout } from "./components/PageLayout"
import { LoadingScreen } from "./components/LoadingScreen";
import { Header } from "./components/Header"
import "./App.css"

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
    return <LoadingScreen/>
  }

  return (
    <PageLayout>
      <Header
        rowCount={result.rows.length}
        matchingCount={result.rows.length}
        elapsedMs={result.elapsedMs}
      />
    </PageLayout>
  )
}

export default App