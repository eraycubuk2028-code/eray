import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import LoginModal from '../components/LoginModal';

const Home = () => {
    return (
        <div className="home">
            <Navbar />
            <Hero />
            <div style={styles.contentContainer}>
                <ContentRow title="Viral Hits" />
                <ContentRow title="New Releases" />
                <ContentRow title="Watch It Again" />
                <ContentRow title="Sci-Fi & Fantasy" />
                <ContentRow title="Critically Acclaimed Movies" />
            </div>
            <footer style={styles.footer}>
                <p>© 2026 KUDRETLİERAYBEY. All rights reserved. Logic by Antigravity.</p>
            </footer>
        </div>
    );
};

const styles = {
    contentContainer: {
        marginTop: '-15vh', // Overlap with Hero gradient
        position: 'relative',
        zIndex: 20,
        background: 'linear-gradient(to bottom, transparent 0%, var(--background) 10%)',
        paddingBottom: '50px',
    },
    footer: {
        padding: '50px 0',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.8rem',
    }
};

export default Home;
