import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Create = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Workflow State
    const [step, setStep] = useState(1); // 1: Draft, 2: Preview, 3: Publish

    // Form State
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Sci-Fi');
    const [price, setPrice] = useState(0.45);
    const [scenario, setScenario] = useState('');

    // AI Models
    const [selectedModel, setSelectedModel] = useState('UltraGen 1.5'); // Generic Name
    const aiModels = [
        { id: 'UltraGen 1.5', color: '#4aa1f3', icon: '✨' },
        { id: 'CineVision', color: '#fff', icon: '🎬' },
        { id: 'ScriptFlow', color: '#107c10', icon: '🤖' },
        { id: 'StellarAI', color: '#fff', icon: '🚀' }
    ];

    // Simulation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Simulation Constants
    const simulationSteps = [
        `Connecting to ${selectedModel} API...`,
        "Senaryo analiz ediliyor...",
        "Karakterler ve mekanlar ayrıştırılıyor...",
        "Duygu analizi tamamlandı: %98 Gerilim",
        "Sahne ışıklandırması oluşturuluyor (Unreal Engine 5)...",
        "Kamera açıları optimize ediliyor...",
        "Ses efektleri sentezleniyor...",
        "4K Render işlemi başlatıldı...",
        "Tamamlanıyor..."
    ];

    const handleGeneratePreview = () => {
        if (!title || !scenario) {
            alert('Lütfen başlık ve senaryo alanlarını doldurun.');
            return;
        }

        setStep(2);
        setIsGenerating(true);
        setTerminalLogs([]);
        setGenerationProgress(0);
        setShowVideo(false);

        let currentStep = 0;

        // Log Generator Loop
        const logInterval = setInterval(() => {
            if (currentStep >= simulationSteps.length) {
                clearInterval(logInterval);
                setIsGenerating(false);
                setShowVideo(true);
                return;
            }

            setTerminalLogs(prev => [...prev, simulationSteps[currentStep]]);
            setGenerationProgress(prev => prev + (100 / simulationSteps.length));
            currentStep++;
        }, 800); // New log every 800ms
    };

    const handleProceedToPublish = () => {
        setStep(3);
    };

    const handlePublish = () => {
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            alert(`"${title}" başarıyla yayınlandı!\nBölüm Başı Ücret: $${price.toFixed(2)}`);
            navigate('/series');
        }, 2000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.logo} onClick={() => navigate('/')}>KUDRETLİERAYBEY <span style={{ fontSize: '0.5em', color: '#aaa', marginLeft: 5 }}>STUDIO</span></div>
                <button style={styles.closeBtn} onClick={() => navigate('/')}>×</button>
            </div>

            <div style={styles.splitLayout}>
                {/* STEP 1: DRAFT - Writer's Room */}
                {step === 1 && (
                    <div style={styles.editorSection}>
                        <div style={styles.stepIndicator}>STEP 1: WRITE</div>
                        <h1 style={styles.pageTitle}>{t('browse.studioTitle')}</h1>
                        <p style={styles.pageSubtitle}>{t('browse.studioSubtitle')}</p>

                        <div style={styles.glassPanel}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>{t('browse.scenarioTitle')}</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    placeholder={t('browse.scenarioTitle')}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>{t('browse.genre')}</label>
                                <select
                                    style={styles.select}
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                >
                                    <option value="Sci-Fi">Sci-Fi</option>
                                    <option value="Action">Action</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Romance">Romance</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>{t('browse.scriptText')}</label>
                                <textarea
                                    style={styles.textarea}
                                    placeholder="INT. SPACESHIP - NIGHT&#10;The alarm blares. COMMANDER SHEPARD wakes up..."
                                    value={scenario}
                                    onChange={(e) => setScenario(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* AI Model Selector Dock */}
                        <div style={styles.dockContainer}>
                            <span style={styles.dockLabel}>Creative Engine: {selectedModel}</span>
                            <div style={styles.dock}>
                                {aiModels.map(model => (
                                    <div
                                        key={model.id}
                                        style={{
                                            ...styles.dockItem,
                                            borderColor: selectedModel === model.id ? model.color : 'transparent',
                                            backgroundColor: selectedModel === model.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            transform: selectedModel === model.id ? 'translateY(-10px)' : 'translateY(0)',
                                            boxShadow: selectedModel === model.id ? `0 10px 20px ${model.color}33` : 'none'
                                        }}
                                        onClick={() => setSelectedModel(model.id)}
                                    >
                                        <div style={{ ...styles.modelIcon, color: selectedModel === model.id ? model.color : '#666' }}>{model.icon}</div>
                                        <div style={{ ...styles.modelName, color: selectedModel === model.id ? 'white' : '#666' }}>{model.id}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            style={styles.publishBtn}
                            onClick={handleGeneratePreview}
                        >
                            Önizleme Oluştur ({selectedModel})
                        </button>
                    </div>
                )}

                {/* STEP 2: PREVIEW - AI Terminal & Player */}
                {step === 2 && (
                    <div style={{ ...styles.editorSection, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={styles.stepIndicator}>STEP 2: PREVIEW</div>

                        {!showVideo ? (
                            <div style={styles.terminalContainer}>
                                <div style={styles.terminalHeader}>
                                    <span style={{ color: '#ff5f56' }}>●</span>
                                    <span style={{ color: '#ffbd2e' }}>●</span>
                                    <span style={{ color: '#27c93f' }}>●</span>
                                    <span style={{ marginLeft: 10, color: '#888', fontSize: '0.8rem' }}>AI_Core_v4.2.exe [{selectedModel}]</span>
                                </div>
                                <div style={styles.terminalBody}>
                                    {terminalLogs.map((log, index) => (
                                        <div key={index} style={styles.logLine}>
                                            <span style={{ color: '#46d369', marginRight: 10 }}>{'>'}</span>
                                            {log}
                                        </div>
                                    ))}
                                    <div style={styles.blinkingCursor}>_</div>
                                </div>
                                <div style={styles.progressContainer}>
                                    <div style={{ ...styles.progressBar, width: `${generationProgress}%` }}></div>
                                </div>
                            </div>
                        ) : (
                            <div style={styles.videoPlayerContainer}>
                                <div style={styles.videoPlaceholder}>
                                    <div style={styles.playIcon}>▶</div>
                                    <h3 style={{ marginTop: 20, color: '#fff' }}>{title}</h3>
                                    <p style={{ color: '#888' }}>Generated by {selectedModel}</p>
                                </div>
                                <div style={styles.playerControls}>
                                    <div style={{ display: 'flex', gap: 20, width: '100%', justifyContent: 'center' }}>
                                        <button style={styles.secondaryBtn} onClick={() => setStep(1)}>Düzenle</button>
                                        <button style={styles.publishBtn} onClick={handleProceedToPublish}>Onayla ve İlerle</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: PUBLISH - Economics */}
                {step === 3 && (
                    <div style={styles.editorSection}>
                        <div style={styles.stepIndicator}>STEP 3: MONETIZATION</div>
                        <h1 style={styles.pageTitle}>Yayın Ayarları</h1>
                        <p style={styles.pageSubtitle}>Son adım: Eserinin değerini belirle.</p>

                        <div style={styles.previewCard}>
                            <h3 style={styles.previewTitle}>{t('browse.netEarnings')}</h3>

                            <div style={{ marginBottom: 30 }}>
                                <label style={styles.label}>{t('browse.pricePerEp')} ($)</label>
                                <div style={styles.priceControl}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.03"
                                        max="2.00"
                                        style={styles.priceInput}
                                        value={price}
                                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                                    />
                                    <input
                                        type="range"
                                        min="0.03"
                                        max="2.00"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                                        style={styles.range}
                                    />
                                </div>
                            </div>

                            <div style={styles.earningsGrid}>
                                <div style={styles.earningItem}>
                                    <span style={{ color: '#888', fontSize: '0.9rem' }}>{t('browse.pricePerEp')}</span>
                                    <span style={{ color: '#46d369', fontSize: '1.5rem', fontWeight: 'bold' }}>${price.toFixed(2)}</span>
                                </div>
                                <div style={styles.earningItem}>
                                    <span style={{ color: '#888', fontSize: '0.9rem' }}>1000 İzlenme</span>
                                    <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>${(price * 900).toFixed(0)}</span>
                                </div>
                            </div>

                            <div style={styles.platformFeeNote}>
                                {t('browse.platformFee')}: %10
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
                            <button style={styles.secondaryBtn} onClick={() => setStep(2)}>Geri</button>
                            <button
                                style={{
                                    ...styles.publishBtn,
                                    opacity: isPublishing ? 0.7 : 1,
                                    cursor: isPublishing ? 'wait' : 'pointer'
                                }}
                                onClick={handlePublish}
                                disabled={isPublishing}
                            >
                                {isPublishing ? t('browse.publishing') : t('browse.publish')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#050505',
        backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(40, 40, 40, 0.4) 0%, transparent 60%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        height: '80px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px',
        backgroundColor: 'rgba(5,5,5,0.6)',
        backdropFilter: 'blur(20px)',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
    },
    logo: {
        fontSize: '1.4rem',
        fontWeight: '800',
        color: '#E50914',
        cursor: 'pointer',
        letterSpacing: '1px',
    },
    closeBtn: {
        background: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        color: '#888',
        fontSize: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    splitLayout: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '100px',
        minHeight: 'calc(100vh - 100px)',
        padding: '40px',
        paddingBottom: '100px',
    },
    editorSection: {
        width: '100%',
        maxWidth: '800px',
        animation: 'fadeIn 0.6s ease-out',
        position: 'relative',
    },
    stepIndicator: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#E50914',
        marginBottom: '15px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
    },
    pageTitle: {
        fontSize: '3.5rem',
        fontWeight: '800',
        marginBottom: '15px',
        background: 'linear-gradient(to right, #fff 20%, #666 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    pageSubtitle: {
        color: '#888',
        marginBottom: '50px',
        fontSize: '1.2rem',
        lineHeight: '1.5',
        maxWidth: '600px',
    },
    glassPanel: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '40px',
        backdropFilter: 'blur(40px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    },
    formGroup: {
        marginBottom: '30px',
    },
    label: {
        display: 'block',
        color: '#888',
        marginBottom: '12px',
        fontSize: '0.85rem',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1.2rem',
        outline: 'none',
        transition: 'all 0.2s',
    },
    select: {
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1.2rem',
        outline: 'none',
        cursor: 'pointer',
    },
    textarea: {
        width: '100%',
        minHeight: '300px',
        padding: '25px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        color: '#e0e0e0',
        fontSize: '1.1rem',
        lineHeight: '1.8',
        resize: 'vertical',
        outline: 'none',
        fontFamily: "'Courier New', Courier, monospace",
    },
    // Dock Styles
    dockContainer: {
        marginBottom: '40px',
        textAlign: 'center',
    },
    dockLabel: {
        display: 'block',
        color: '#555',
        fontSize: '0.8rem',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
    },
    dock: {
        display: 'inline-flex',
        gap: '20px',
        padding: '15px 30px',
        backgroundColor: 'rgba(20,20,20,0.8)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    dockItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        borderRadius: '16px',
        cursor: 'pointer',
        border: '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        minWidth: '90px',
    },
    modelIcon: {
        fontSize: '2rem',
        marginBottom: '8px',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    },
    modelName: {
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '0.5px',
    },

    // Terminal Styles
    terminalContainer: {
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#050505',
        borderRadius: '16px',
        border: '1px solid #222',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        fontFamily: "'Courier New', monospace",
        marginTop: '20px',
    },
    terminalHeader: {
        backgroundColor: '#111',
        padding: '12px 20px',
        borderBottom: '1px solid #222',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    terminalBody: {
        padding: '30px',
        height: '400px',
        overflowY: 'auto',
        color: '#ddd',
        fontSize: '0.95rem',
        lineHeight: '1.8',
    },
    logLine: {
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
    },
    blinkingCursor: {
        display: 'inline-block',
        color: '#46d369',
        fontWeight: 'bold',
        animation: 'blink 1s step-end infinite',
    },
    progressContainer: {
        height: '2px',
        backgroundColor: '#222',
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#46d369',
        transition: 'width 0.3s ease',
        boxShadow: '0 0 15px rgba(70, 211, 105, 0.4)',
    },

    // Preview Styles
    videoPlayerContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeIn 1s ease',
    },
    videoPlaceholder: {
        width: '100%',
        maxWidth: '900px',
        aspectRatio: '21/9', // Cinematic ratio
        backgroundColor: '#000',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #222',
        marginBottom: '40px',
        position: 'relative',
        boxShadow: '0 0 60px rgba(0,0,0,0.6)',
    },
    playIcon: {
        fontSize: '5rem',
        color: 'white',
        opacity: 0.9,
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    playerControls: {
        width: '100%',
        maxWidth: '600px',
    },

    // Monetization Styles
    previewCard: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    previewTitle: {
        marginBottom: '30px',
        fontSize: '1.2rem',
        color: '#fff',
        fontWeight: 'bold',
    },
    priceControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: '15px 25px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    priceInput: {
        width: '100px',
        background: 'transparent',
        border: 'none',
        color: '#46d369',
        fontSize: '1.8rem',
        fontWeight: '800',
        outline: 'none',
    },
    range: {
        flex: 1,
        accentColor: '#46d369',
        cursor: 'pointer',
        height: '6px',
    },
    earningsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px',
    },
    earningItem: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: '25px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        border: '1px solid rgba(255,255,255,0.02)',
    },
    platformFeeNote: {
        fontSize: '0.85rem',
        color: '#555',
        textAlign: 'center',
        marginTop: '30px',
    },

    // Buttons
    publishBtn: {
        width: '100%',
        padding: '22px',
        backgroundColor: '#E50914',
        color: 'white',
        border: 'none',
        borderRadius: '14px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        transition: 'all 0.3s',
        boxShadow: '0 10px 40px rgba(229, 9, 20, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    },
    secondaryBtn: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#ccc',
        padding: '22px 35px',
        borderRadius: '14px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontWeight: '600',
    },
};

export default Create;
