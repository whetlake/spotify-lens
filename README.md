# Spotify Lens

Spotify Lens is a small data exploration project built around Spotify track genres and audio features.

The project has two parts:

- a Jupyter notebook for exploratory data analysis
- a React + TypeScript app for interactive audio-feature exploration

The app is not a genre classifier. It is a descriptive tool for exploring which track–genre rows match a selected combination of audio features.

## Demo

The app is deployed with GitHub Pages:

https://whetlake.github.io/spotify-lens/

## Quick start

Clone the repository:

```bash
git clone https://github.com/whetlake/spotify-lens.git
cd spotify-lens
```

Run the app locally:

```bash
cd app
pnpm install
pnpm dev
```

Run the notebook:

```bash
uv run jupyter lab
```

Then open `notebooks/eda.ipynb`.

## Project idea

The notebook showed that the same track can appear under several genres. Because of that, the app treats each row as a track–genre row instead of forcing each track into one genre.

The interactive app lets a user select ranges for audio features such as acousticness, danceability, energy, speechiness, tempo and loudness. It then shows how many rows match and how those matches are distributed across genres.

## Repository structure

```text
app/        React + TypeScript app
notebooks/  Jupyter exploratory analysis
data/       Local raw data folder used during exploration
```

## Dataset

This project uses the Spotify Tracks DB dataset from Kaggle:

https://www.kaggle.com/datasets/zaheenhamidani/ultimate-spotify-tracks-db

The app uses the CSV file here:

```text
app/public/data/SpotifyFeatures.csv
```

The CSV is included in this repository so the demo can load the data directly on GitHub Pages. The dataset itself is not created by this project; the original source is the Spotify Tracks DB dataset on Kaggle. If reusing the data, download it from the original Kaggle page:

https://www.kaggle.com/datasets/zaheenhamidani/ultimate-spotify-tracks-db

## Run the notebook

From the project root:

```bash
uv run jupyter lab
```

Then open:

```text
notebooks/eda.ipynb
```

## Run the app locally

From the project root:

```bash
cd app
pnpm install
pnpm dev
```

The app is served by Vite. The terminal output will show the local URL.

## Build and check the app

From the project root:

```bash
cd app
pnpm lint
pnpm build
```

## Deployment note

The app is configured for GitHub Pages through GitHub Actions. The build publishes the Vite app from `app/dist` to:

https://whetlake.github.io/spotify-lens/

## Current limitations

- The app is exploratory, not predictive.
- The dataset license is listed as unknown on Kaggle.


## Future work

Next I would focus on:

- adding a matching-tracks table with track name, artist, genre and selected audio-feature values
- allowing a selected track to show similar tracks based on audio-feature distance
- allowing multiple selected genres to be highlighted separately in the parallel-coordinates chart
- adding categorical filters for key, mode and time signature
- improving reset and empty states for selected ranges, focused genres and zero-result selections
- improving dense-chart rendering, for example by showing 25th, 50th and 75th percentile feature profiles per genre. This would allow larger datasets as well.
- improving chart performance and track-highlighting speed
- exploring a simple similar-tracks feature where selected audio-feature values are compared against existing tracks
- adding tests around important data transformations and chart interactions
