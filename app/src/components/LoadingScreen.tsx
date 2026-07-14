export function LoadingScreen() {
    return (
        <div
            className="loading-screen"
            role="status"
            aria-live="polite"
            aria-busy="true"
            >
            <div className="loading-content">
                <div
                    className="loading-spinner"
                    aria-hidden="true"
                />
            </div>
        </div>
    )
}