# Dataset

## Source

Spotify Lens uses the [Spotify Tracks DB dataset on Kaggle](https://www.kaggle.com/datasets/zaheenhamidani/ultimate-spotify-tracks-db). The dataset author describes it as a collection of roughly 10,000 tracks per genre, built using data from the Spotify Web API. The raw archive contains one file, `SpotifyFeatures.csv`.

The raw ZIP and CSV are stored in `data/raw/` and are not intended to be committed to the repository. The CSV archive metadata is dated 19 October 2019, but the dataset does not include a collection timestamp for each track.

## Contents

Each row contains a genre label, basic track metadata, a popularity value, and audio features describing musical or acoustic characteristics. Most audio-feature definitions below are based on Spotify's [audio features reference](https://developer.spotify.com/documentation/web-api/reference/get-audio-features). Track metadata definitions come from Spotify's [track reference](https://developer.spotify.com/documentation/web-api/reference/get-track).

The dimensions, missing values, duplicate records, category values, and observed feature ranges will be examined in `notebooks/eda.ipynb`.

## Columns

| Column | Meaning | Unit or values |
| --- | --- | --- |
| `genre` | Genre category used by the dataset when collecting tracks. | Text label |
| `artist_name` | Name of the track's artist. | Text |
| `track_name` | Name of the track. | Text |
| `track_id` | Spotify's identifier for the track. | Text identifier |
| `popularity` | Spotify popularity at the time of collection. It reflects play count and how recent the plays were; it is not a timeless measure of quality. | Integer, 0-100 |
| `acousticness` | Confidence that the track is acoustic; higher means more likely acoustic. | Score, 0-1 |
| `danceability` | Suitability for dancing based on tempo, rhythm stability, beat strength, and regularity. | Score, 0-1 |
| `duration_ms` | Track duration. | Milliseconds |
| `energy` | Perceptual intensity and activity; energetic tracks tend to feel faster, louder, or noisier. | Score, 0-1 |
| `instrumentalness` | Likelihood that the track contains no vocals. Values above 0.5 are intended to represent instrumental tracks, with confidence increasing toward 1. | Score, 0-1 |
| `key` | Estimated musical key. Spotify normally returns pitch-class integers; this dataset has converted them to note names. | Note label |
| `liveness` | Likelihood that an audience is present in the recording. Spotify describes values above 0.8 as strong evidence of a live recording. | Score, 0-1 |
| `loudness` | Average overall loudness across the track. | Decibels (dB) |
| `mode` | Modality of the track's scale. | `Major` or `Minor` |
| `speechiness` | Presence of spoken words. Values below 0.33 usually indicate music; values above 0.66 are likely mostly spoken word. | Score, 0-1 |
| `tempo` | Estimated overall tempo. | Beats per minute (BPM) |
| `time_signature` | Estimated number of beats in each bar. Spotify normally returns an integer; this dataset has converted it to a fraction-like label. | Meter label |
| `valence` | Musical positiveness conveyed by the track; higher values tend to sound happier or more euphoric, while lower values tend to sound sadder or angrier. | Score, 0-1 |

## Limitations

- Genre is a dataset sampling label, not necessarily a definitive or exclusive classification from Spotify.
- Popularity is a time-dependent snapshot, but the CSV does not include the date when each value was retrieved.
- Spotify's audio features are algorithmic estimates and should be treated as descriptive measurements rather than objective musical truth.
- The Kaggle page lists the dataset license as unknown. The raw dataset should not be redistributed until its reuse terms are clarified.
