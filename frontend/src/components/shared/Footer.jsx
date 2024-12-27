import React from 'react';

const Footer = () => {
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
            borderTop: '1px solid #2d3748',
            marginTop: '2rem',
            paddingTop: '1rem',
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
            <div style={styles.footerContent}>
                <div style={styles.footerColumn}>
                    <h3 style={styles.footerTitle}>For Brands</h3>
                    <a href="/how-to-hire" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>How to hire</a>
                    <a href="/agencies" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Agency Marketplace</a>
                    <a href="/open-projects" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Project Catalog</a>
                    <a href="/admin/projects/create" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Hire an agency</a>
                    <a href="/admin/companies" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Enterprise</a>
                </div>
                <div style={styles.footerColumn}>
                    <h3 style={styles.footerTitle}>For Agencies</h3>
                    <a href="/how-to-find-work" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>How to find work</a>
                    <a href="/profile" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Direct Contracts</a>
                    <a href="/open-projects" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Find brands worldwide</a>
                    <a href="#" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Find brands in the India</a>
                </div>
                <div style={styles.footerColumn}>
                    <h3 style={styles.footerTitle}>Resources</h3>
                    <a href="/support" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Help & Support</a>
                    <a href="/success-stories" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Success Stories</a>
                    <a href="#" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Qualtr Reviews</a>
                    <a href="#" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Resources</a>
                    <a href="#" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Blog</a>
                </div>
                <div style={styles.footerColumn}>
                    <h3 style={styles.footerTitle}>Company</h3>
                    <a href="/about" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>About Us</a>
                    <a href="/privacy-policy" target='_blank' style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Privacy Policy</a>
                    <a href="#" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Leadership</a>
                    <a href="/contact" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Contact Us</a>
                    <a href="/carrers" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Careers</a>
                    <a href="/impact" style={styles.footerLink} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Our Impact</a>
                </div>
            </div>
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

export default Footer;
