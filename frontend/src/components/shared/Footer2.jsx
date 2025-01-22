import React from 'react';

const Footer2 = () => {
    const styles = {
        footer: {
            backgroundColor: '#1a202c',
            color: '#ffffff',
            padding: '2rem 1rem',
        },
        footerContent: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        footerColumn: {
            flex: '1',
            minWidth: '200px',
            marginBottom: '1.5rem',
        },
        footerTitle: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem',
        },
        footerLink: {
            color: '#a0aec0',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '0.5rem',
            transition: 'color 0.3s ease', // smooth transition for hover effect
        },
        footerLinkHover: {
            color: '#17B169',
        },
        footerBottom: {
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        },
        socialIcons: {
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
        },
        socialIcon: {
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#2d3748',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        '@media (max-width: 768px)': {
            footerContent: {
                flexDirection: 'column',
                alignItems: 'center',
            },
            footerColumn: {
                textAlign: 'center',
                marginBottom: '1rem',
            },
            footerBottom: {
                flexDirection: 'column',
            },
        },
    };

    const handleMouseOver = (e) => {
        e.target.style.color = styles.footerLinkHover.color;
    };

    const handleMouseOut = (e) => {
        e.target.style.color = styles.footerLink.color;
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.footerBottom}>
                <div>© 2023 - {new Date().getFullYear()} Qualtr®.</div>
                <div style={styles.socialIcons}>
                    <a href="https://www.linkedin.com/company/qualtr/" target='_blank' style={styles.socialIcon}>in</a>
                    <a href="https://x.com/qualtr_" target='_blank' style={styles.socialIcon}>X</a>
                    <a href="https://www.instagram.com/qualtr_/" target='_blank' style={styles.socialIcon}>IG</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer2;
