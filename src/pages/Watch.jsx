import React, { useState, useRef, useEffect } from 'react';
const location = useLocation();
const movieData = location.state?.movie || {};
const videoUrl = movieData.videoUrl || "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

return (
    <div
        ref={containerRef}
        className="watch-container"
        onMouseMove={() => {
            setShowControls(true);
            clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }}
        onMouseLeave={() => setShowControls(false)}
        onClick={() => {
            if (!isYouTube) togglePlay();
            // For YouTube, click usually interacts with iframe, so we might not capture it easily here 
            // unless we put a veil over it, but that blocks controls.
        }}
        onDoubleClick={toggleFullscreen}
    >
        <button
            className="watch-back-button"
            style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none' }}
            onClick={(e) => {
                e.stopPropagation();
                navigate('/');
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            {t('watch.backToBrowse')}
        </button>

        {isYouTube ? (
            <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1&controls=0&rel=0`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ border: 'none', width: '100%', height: '100%' }}
                ></iframe>
                {/* Custom controls overlay might not work fully with YouTube iframe due to cross-origin policies used by YT. 
                         We'll keep the basic external controls overlay but note that syncing state is hard.
                         For now, let's allow YouTube's native controls if we hide ours, OR we just overlay ours and accept limited syncing.
                         The user wants "auto rotate", which works via container fullscreen logic we added.
                         
                         Let's keep OUR controls overlay for consistency, but we can't easily control YT iframe without the YT Player API.
                         For a quick "link & play" solution, using YT native controls might be smoother, 
                         BUT the user wants the "landscape" feature which is on OUR fullscreen button.
                         
                         Compromise: We show our overlay. Button clicks won't pause YT easily without API. 
                         Let's just use the iframe as is for the MVP and hide our controls if it's YouTube, 
                         forcing the user to use YT controls? 
                         OR better: enable controls=1 in YT url and hide our overlay for YT videos.
                     */}
            </div>
        ) : (
            <video
                ref={videoRef}
                className="watch-video"
                style={{ ...getBlurStyle() }}
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                crossOrigin="anonymous"
                poster={movieData.thumbnail || moonImg}
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        )}

        {/* Only show our custom controls for non-YouTube videos or if we really want to override (complex) */}
        {!isYouTube && (
            <div
                className="controls-overlay"
                style={{ opacity: showControls ? 1 : 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress Bar */}
                <div className="progress-container">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="progress-bar"
                    />
                </div>

                <div className="controls-row">
                    <div className="left-controls">
                        {/* Play/Pause */}
                        <button onClick={togglePlay} className="icon-button">
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        {/* Volume */}
                        <div className="volume-container">
                            <button className="icon-button">
                                {volume === 0 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>

                        {/* Speed Selector */}
                        <div className="selector-container">
                            <span className="selector-label">Speed:</span>
                            <select
                                value={playbackRate}
                                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                                className="watch-select"
                            >
                                {speeds.map(s => <option key={s} value={s}>{s}x</option>)}
                            </select>
                        </div>

                        <span className="time-display">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="right-controls">
                        {/* Quality Selector */}
                        <div className="selector-container">
                            <span className="selector-label">Quality:</span>
                            <select
                                value={quality}
                                onChange={(e) => handleQualityChange(e.target.value)}
                                className="watch-select"
                            >
                                {qualities.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>

                        {/* Fullscreen */}
                        <button className="icon-button" onClick={toggleFullscreen}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Special Fullscreen Button for YouTube (since we hide default overlays) */}
        {isYouTube && (
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000, opacity: showControls ? 1 : 0, transition: 'opacity 0.3s' }}>
                <button className="icon-button" style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '50%' }} onClick={toggleFullscreen} title="Tam Ekran">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
            </div>
        )
        }
    </div>
);
};

export default Watch;
