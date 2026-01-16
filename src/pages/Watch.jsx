import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import moonImg from '../assets/moon.png';
import erayImg from '../assets/eray_placeholder.png';
import './Watch.css';
import { viewService } from '../services/viewService';

const Watch = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const hasIncremented = useRef(false);

    // Movie Data from separate page
    const movieData = location.state?.movie || {};
    const videoUrl = movieData.videoUrl || "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

    // Increment View Count
    useEffect(() => {
        if (movieData.id && !hasIncremented.current) {
            viewService.incrementView(movieData.id);
            hasIncremented.current = true;
        }
    }, [movieData.id]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('1080p');
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Auto-hide controls
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        };

        return () => {
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
    }, [isPlaying]);

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
    };

    const getBlurStyle = () => {
        switch (quality) {
            case '360p': return { filter: 'blur(1.5px)' };
            case '480p': return { filter: 'blur(0.8px)' };
            default: return { filter: 'none' };
        }
    };

    const toggleFullscreen = async () => {
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                try {
                    await containerRef.current.requestFullscreen();
                    if (screen.orientation && screen.orientation.lock) {
                        await screen.orientation.lock('landscape').catch((e) => {
                            // Fail silently on devices that don't support locking
                            console.log("Orientation lock failed:", e);
                        });
                    }
                } catch (err) {
                    console.error("Fullscreen error:", err);
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                if (screen.orientation && screen.orientation.unlock) {
                    try {
                        screen.orientation.unlock();
                    } catch (e) {
                        // Fail silently
                    }
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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
                        src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1&controls=1&rel=0`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ border: 'none', width: '100%', height: '100%' }}
                    ></iframe>
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
                    poster={movieData.thumbnail || erayImg}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

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
