interface HeaderProps {
    rowCount: number
    elapsedMs: number
    matchingCount: number
}

export function Header({rowCount, elapsedMs, matchingCount}: HeaderProps) {
    const matchingPercentage = rowCount === 0 ? 0 : (matchingCount / rowCount) * 100
    return (
        <header className="header">
            <div className="header-main">
                <div className="header-brand">
                    <div className="header-brand-name">Spotify Lens</div>
                    <div className="header-brand-divider" />
                    <p className="header-brand-description">Find tracks by how they sound</p>
                </div>
            </div>
            <div className="header-summary">
                <p>{rowCount.toLocaleString()} track–genre rows</p>
                <p><strong>{matchingCount.toLocaleString()}</strong>{" "}matching rows ({matchingPercentage.toFixed(2)}%)</p>
                <p>Loaded in{" "}<strong>{(elapsedMs / 1000).toFixed(2)}</strong> seconds</p>
            </div>
        </header>
    )
}
