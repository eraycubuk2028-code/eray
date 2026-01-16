import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';
import { authService } from '../services/authService';
import { useTranslation } from '../hooks/useTranslation';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Check for active session on mount
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    const handleLogin = (userData) => {
        setUser(userData);
        setShowLogin(false);
    };

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
        // Optional: close search or clear query? kept open for UX
        // setIsSearchOpen(false); 
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setShowUserMenu(false);
    };

    // User Profile Component or Icon
    const ProfileTrigger = () => {
        if (user) {
            return (
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                            ...styles.avatar,
                            backgroundImage: user.avatar ? `url(${user.avatar})` : `url(https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=E50914&color=fff)`
                        }}
                        title={user.name}
                    ></div>

                    {showUserMenu && (
                        <div style={styles.userMenu}>
                            <div style={styles.menuHeader}>{user.name}</div>
                            <button style={styles.menuItem} onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                {t('navbar.signOut')}
                            </button>
                            <button
                                style={styles.menuItem}
                                onClick={() => {
                                    setShowUserMenu(false);
                                    navigate('/settings');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                {t('navbar.settings')}
                            </button>
                        </div>
                    )}
                </div>
            );
        }
        return (
            <button
                style={styles.iconButton}
                onClick={() => setShowLogin(true)}
                aria-label="Profile"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
        );
    };

    const navLinks = [
        { path: '/series', label: t('navbar.series') },
        { path: '/movies', label: t('navbar.movies') },
        { path: '/new-popular', label: t('navbar.newPopular') || "Yeni ve Popüler" },
        { path: '/create', label: t('navbar.create') }
    ];

    return (
        <>
            <nav style={{ ...styles.nav, backgroundColor: isScrolled || mobileMenuOpen ? 'var(--background)' : 'transparent', borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none' }}>
                <div style={styles.container}>
                    <div style={styles.leftSection}>
                        <div style={styles.logo} onClick={() => navigate('/')}>KUDRETLİERAYBEY</div>

                        {!isMobile && location.pathname !== '/' && (
                            <div
                                style={styles.homeIconWrapper}
                                onClick={() => navigate('/')}
                                title={t('navbar.home')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                        )}
                    </div>

                    {!isMobile ? (
                        <div style={styles.links}>
                            {navLinks.map(link => (
                                <a
                                    key={link.path}
                                    href={link.path}
                                    style={styles.link}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(link.path);
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    ) : null}

                    <div style={styles.actions}>
                        {!isMobile && (
                            <div style={{ ...styles.searchContainer, width: isSearchOpen ? '250px' : '36px', background: isSearchOpen ? 'rgba(0,0,0,0.75)' : 'transparent', border: isSearchOpen ? '1px solid #fff' : '1px solid transparent' }}>
                                <button
                                    style={styles.iconButton}
                                    aria-label="Search"
                                    onClick={() => {
                                        if (isSearchOpen && searchQuery.trim()) {
                                            handleSearch(searchQuery);
                                        } else {
                                            setIsSearchOpen(!isSearchOpen);
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    placeholder={t('navbar.search') || "Takıl kafana göre..."}
                                    style={{
                                        ...styles.searchInput,
                                        opacity: isSearchOpen ? 1 : 0,
                                        width: isSearchOpen ? '100%' : '0px',
                                        pointerEvents: isSearchOpen ? 'auto' : 'none'
                                    }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(searchQuery);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {!isMobile && <ProfileTrigger />}

                        {/* Mobile Hamburger */}
                        {isMobile && (
                            <button
                                style={{ ...styles.iconButton, zIndex: 200 }}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobile && (
                <div style={{
                    ...styles.mobileMenu,
                    opacity: mobileMenuOpen ? 1 : 0,
                    pointerEvents: mobileMenuOpen ? 'auto' : 'none',
                    transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)'
                }}>
                    <div style={styles.mobileLinks}>
                        {navLinks.map((link, index) => (
                            <a
                                key={link.path}
                                href={link.path}
                                style={{
                                    ...styles.mobileLink,
                                    animation: mobileMenuOpen ? `fadeIn 0.3s ease forwards ${index * 0.1}s` : 'none',
                                    opacity: 0
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMobileMenuOpen(false);
                                    navigate(link.path);
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <ProfileTrigger />
                        </div>
                    </div>
                </div>
            )}

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
        </>
    );
};

const styles = {
    nav: {
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '70px',
        zIndex: 100,
        transition: 'all var(--transition-smooth)',
        display: 'flex',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 4%',
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    logo: {
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--primary)',
        letterSpacing: '-1px',
        cursor: 'pointer',
    },
    homeIconWrapper: {
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s',
    },
    links: {
        display: 'flex',
        gap: '30px',
    },
    link: {
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'color var(--transition-fast)',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '5px',
        height: '36px',
    },
    searchInput: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        outline: 'none',
        padding: '0 10px',
        fontSize: '0.9rem',
        transition: 'width 0.3s, opacity 0.3s',
        height: '100%',
    },
    iconButton: {
        background: 'none',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px',
        borderRadius: '50%',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#333',
        backgroundSize: 'cover',
        cursor: 'pointer',
        border: '2px solid rgba(255,255,255,0.8)'
    },
    userMenu: {
        position: 'absolute',
        top: '40px',
        right: 0,
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 101, // Ensure menu is above other elements
    },
    menuHeader: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '5px',
        marginBottom: '5px',
    },
    menuItem: {
        background: 'none',
        border: 'none',
        color: 'var(--text-primary)',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '0.9rem',
        padding: '5px',
        borderRadius: '4px',
        transition: 'background 0.2s',
    },
    // Mobile Menu Styles
    mobileMenu: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    mobileLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        alignItems: 'center',
    },
    mobileLink: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none',
    },
};

export default Navbar;
