import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import moonImg from '../assets/moon.png';

const Watch = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('1080p');
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Auto-hide controls
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        };

        // The event listener is now on the container div, not the document
        // document.addEventListener('mousemove', handleMouseMove);
        return () => {
            // document.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Volume Controls
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setVolume(prev => Math.min(prev + 0.1, 1));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setVolume(prev => Math.max(prev - 0.1, 0));
            }
            // Seek Controls
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (videoRef.current) videoRef.current.currentTime += 10;
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (videoRef.current) videoRef.current.currentTime -= 10;
            }
            // Play/Pause
            else if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]); // Add isPlaying dependency if needed, though togglePlay uses ref current state mostly

    // Sync volume state with video element
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    // Sync playback rate
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} `;
    };

    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const qualities = ['1080p', '720p', '480p', '360p'];

    const handleQualityChange = (newQuality) => {
        if (newQuality === quality) return;
        setQuality(newQuality);

        // User requested NO buffering, instant switch
        // Real quality drop simulation via CSS filter since we have a single source
    };

    const getBlurStyle = () => {
        switch (quality) {
            case '360p': return { filter: 'blur(1.5px)' }; // Visibly low quality
            case '480p': return { filter: 'blur(0.8px)' }; // Slightly low quality
            default: return { filter: 'none' }; // HD
        }
    };

    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div
            ref={containerRef}
            style={styles.watchContainer}
            onMouseMove={() => {
                setShowControls(true);
                clearTimeout(controlsTimeoutRef.current);
                controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
            }}
            onMouseLeave={() => setShowControls(false)}
            onClick={togglePlay} // Click anywhere on container to toggle
            onDoubleClick={toggleFullscreen}
        >
            <button
                style={{ ...styles.backButton, opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none' }}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent togglePlay from firing
                    navigate('/');
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                {t('watch.backToBrowse')}
            </button>

            <video
                ref={videoRef}
                style={{ ...styles.video, ...getBlurStyle() }}
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                crossOrigin="anonymous"
                poster={moonImg}
            >
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div
                style={{ ...styles.controlsOverlay, opacity: showControls ? 1 : 0 }}
                onClick={(e) => e.stopPropagation()} // Prevent toggle when using controls
            >
                {/* Progress Bar */}
                <div style={styles.progressContainer}>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        style={styles.progressBar}
                    />
                </div>

                <div style={styles.controlsRow}>
                    <div style={styles.leftControls}>
                        {/* Play/Pause */}
                        <button onClick={togglePlay} style={styles.iconButton}>
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        {/* Volume */}
                        <div style={styles.volumeContainer}>
                            <button style={styles.iconButton}>
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
                                style={styles.volumeSlider}
                            />
                        </div>

                        {/* Speed Selector (Next to Volume as requested) */}
                        <div style={styles.selectorContainer}>
                            <span style={styles.selectorLabel}>Speed:</span>
                            <select
                                value={playbackRate}
                                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                                style={styles.select}
                            >
                                {speeds.map(s => <option key={s} value={s}>{s}x</option>)}
                            </select>
                        </div>

                        <span style={styles.timeDisplay}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div style={styles.rightControls}>
                        {/* Quality Selector */}
                        <div style={styles.selectorContainer}>
                            <span style={styles.selectorLabel}>Quality:</span>
                            <select
                                value={quality}
                                onChange={(e) => handleQualityChange(e.target.value)}
                                style={styles.select}
                            >
                                {qualities.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>

                        {/* Fullscreen (Mock) */}
                        <button style={styles.iconButton} onClick={() => {
                            if (document.fullscreenElement) document.exitFullscreen();
                            else document.body.requestFullscreen();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    watchContainer: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'default',
    },
    backButton: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '1.2rem',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        textDecoration: 'none',
        cursor: 'pointer',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '30px',
        transition: 'opacity 0.3s',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none', // Allow clicks to pass through to container logic if needed, but we handle click on video element manually
    },
    controlsOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
        padding: '20px 40px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        transition: 'opacity 0.3s',
    },
    progressContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: '5px',
        accentColor: 'var(--primary)',
        cursor: 'pointer',
    },
    controlsRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    rightControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px',
        transition: 'transform 0.2s',
    },
    volumeContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    volumeSlider: {
        width: '80px',
        height: '4px',
        accentColor: '#fff',
    },
    timeDisplay: {
        color: '#ddd',
        fontSize: '0.9rem',
        fontVariantNumeric: 'tabular-nums',
    },
    selectorContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '5px 10px',
        borderRadius: '4px',
    },
    selectorLabel: {
        color: '#aaa',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    select: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
    }
};

export default Watch;
