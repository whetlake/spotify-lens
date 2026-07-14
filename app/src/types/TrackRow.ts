export interface TrackRow {
	genre: string,
	artist_name: string,
	track_name: string,
	track_id: string,
	popularity: number,
	acousticness: number,
	danceability: number,
	duration_ms: number,
	energy: number,
	instrumentalness: number,
	key: string,
	liveness: number,
	loudness: number,
	mode: string,
	speechiness: number,
	tempo: number,
	time_signature: string,
	valence: number
}

// Columns that are numbers in the original dataset
export const NUMERIC_FIELDS = [
	"popularity",
	"acousticness",
	"danceability",
	"duration_ms",
	"energy",
	"instrumentalness",
	"liveness",
	"loudness",
	"speechiness",
	"tempo",
	"valence"
] as const satisfies readonly (keyof TrackRow)[]

// Columns that are strings in the original dataset
export const TEXT_FIELDS = [
	"genre",
	"artist_name",
	"track_name",
	"track_id",
	"key",
	"mode",
	"time_signature"
] as const satisfies readonly (keyof TrackRow)[]

export const ALL_FIELDS = [
	...TEXT_FIELDS,
	...NUMERIC_FIELDS
]