'use client';
import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import styles from './useCases.module.css';

export default function UseCasesPage() {
    const useCases = [
        {
            title: 'Shopping in Email',
            description: 'Let customers browse products, add items to cart, and complete purchases directly within the email without leaving their inbox.',
            benefits: ['Increase conversion rates', 'Reduce cart abandonment', 'Seamless shopping experience'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e",
            isSvg: true,
            customSize: { width: '27px', height: '48px' }
        },
        {
            title: 'In-Email Reviews & Feedback',
            description: 'Collect customer reviews, ratings, and feedback with interactive forms embedded directly in your emails.',
            benefits: ['Boost social proof', 'Higher response rates', 'Real-time feedback collection'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e",
            isSvg: true
        },
        {
            title: 'Product Recommendations',
            description: 'Show personalized product recommendations with interactive carousels that customers can browse and purchase from.',
            benefits: ['Increase average order value', 'Personalized experience', 'Cross-sell opportunities'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e",
            isSvg: true
        },
        {
            title: 'Event Registration',
            description: 'Enable customers to register for events, webinars, or appointments directly from the email with interactive forms.',
            benefits: ['Streamlined registration', 'Higher attendance rates', 'Instant confirmation'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 8H3m13-6v3M8 2v3m-.2 17h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22m4.197-9.67c-.8-.908-2.133-1.153-3.135-.32-1.002.832-1.143 2.223-.356 3.208.571.715 2.153 2.122 2.977 2.839.179.155.268.233.373.264.09.027.192.027.283 0 .104-.03.194-.109.372-.264.824-.717 2.407-2.124 2.978-2.84a2.256 2.256 0 0 0-.356-3.208c-1.02-.823-2.336-.587-3.136.322Z'/%3e%3c/svg%3e",
            isSvg: true
        },
        {
            title: 'Surveys & Polls',
            description: 'Engage your audience with interactive surveys and polls that they can complete without leaving their inbox.',
            benefits: ['Higher completion rates', 'Real-time insights', 'Better engagement'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%23BDBDBD' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e",
            isSvg: true
        },
        {
            title: 'Subscription Management',
            description: 'Allow subscribers to manage their preferences, update subscriptions, or upgrade plans directly in the email.',
            benefits: ['Reduce churn', 'Easy preference management', 'Improved user experience'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M4 20h16v-8H4zm6-7.27L16 16l-6 3.26z' opacity='.3'/%3e%3cpath fill='%23BDBDBD' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e",
            isSvg: true
        },
        {
            title: 'Abandoned Cart Recovery',
            description: 'Send interactive emails with the abandoned cart items, allowing customers to complete their purchase instantly.',
            benefits: ['Recover lost sales', 'One-click checkout', 'Personalized reminders'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e",
            isSvg: true
        },
        {
            title: 'NPS & Customer Satisfaction',
            description: 'Measure customer satisfaction with interactive NPS surveys and satisfaction ratings embedded in emails.',
            benefits: ['Track customer sentiment', 'Identify promoters', 'Improve retention'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M4 8h1v8m4-6v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0m7 0v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0'/%3e%3c/svg%3e",
            isSvg: true
        },
        {
            title: 'Product Bundles & Upsells',
            description: 'Showcase product bundles and upsell opportunities with interactive elements that drive additional purchases.',
            benefits: ['Increase revenue per customer', 'Smart recommendations', 'Easy add-ons'],
            icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 9.5V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h1.7m7.886-3.289-1.698 3.154c-.278.516-.417.774-.586.84a.5.5 0 0 1-.447-.038c-.155-.096-.247-.374-.43-.93L11.5 12.511c-.16-.486-.241-.73-.183-.892a.5.5 0 0 1 .302-.302c.162-.058.405.022.892.183l8.226 2.724c.556.184.834.276.93.431a.5.5 0 0 1 .039.447c-.067.17-.325.308-.84.586l-3.155 1.698a1 1 0 0 0-.152.09.5.5 0 0 0-.082.083 1 1 0 0 0-.09.152Z'/%3e%3c/svg%3e",
            isSvg: true
        }
    ];

    return (
        <>
            <div className={styles.navbarWrapper}>
                <div className="container-fluid">
                    <div className="container">
                        <NavBar />
                    </div>
                </div>
            </div>
            <div className={styles.diagonalBlock}></div>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            AMP Email <span className={styles.highlight}>Use Cases</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Discover how interactive AMP emails can transform your email marketing campaigns
                            and drive better engagement, conversions, and customer satisfaction
                        </p>
                    </div>

                    <div className={styles.useCasesGrid}>
                        {useCases.map((useCase, index) => (
                            <a key={index} href={`/use-cases/${useCase.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`} className={styles.useCaseCard}>
                                <div className={styles.cardOverlay}></div>
                                <div className={styles.cardContent}>
                                    <div className={styles.icon}>
                                        {useCase.isSvg ? (
                                            <img 
                                                src={useCase.icon} 
                                                alt={useCase.title} 
                                                style={{ 
                                                    width: useCase.customSize?.width || '32px', 
                                                    height: useCase.customSize?.height || '48px' 
                                                }} 
                                            />
                                        ) : (
                                            useCase.icon
                                        )}
                                    </div>
                                    <h3 className={styles.cardTitle}>{useCase.title}</h3>
                                    <p className={styles.cardDescription}>{useCase.description}</p>
                                    <ul className={styles.benefitsList}>
                                        {useCase.benefits.map((benefit, idx) => (
                                            <li key={idx} className={styles.benefit}>
                                                <span className={styles.checkmark}>
                                                    <svg width="12" height="11" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8.00378 0.445204L3.80248 6.06595L1.9908 3.694C1.80952 3.45846 1.54314 3.30542 1.25029 3.26852C0.957432 3.23163 0.66208 3.31391 0.429207 3.49727C0.196333 3.68063 0.0450134 3.95004 0.00853663 4.24624C-0.0279401 4.54244 0.0534138 4.84117 0.234701 5.0767L2.93554 8.57281C3.04021 8.70678 3.17368 8.81488 3.32582 8.8889C3.47796 8.96291 3.64477 9.0009 3.81359 8.99998C3.98333 8.99957 4.15072 8.95984 4.30293 8.88385C4.45513 8.80785 4.5881 8.6976 4.69164 8.56156L9.771 1.81667C9.95082 1.57815 10.0296 1.27716 9.98998 0.979906C9.95038 0.682651 9.79564 0.413482 9.55982 0.231615C9.324 0.0497478 9.02641 -0.0299211 8.73251 0.0101345C8.43861 0.0501901 8.17248 0.20669 7.99267 0.445204H8.00378Z" fill="#ED5370"/>
                                                    </svg>
                                                </span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className={styles.ampElementsSection}>
                        <h2 className={styles.ampSectionTitle}>Interactive AMP Elements</h2>
                        <p className={styles.ampSectionSubtitle}>
                            Powerful interactive components to engage your audience directly in email
                        </p>
                        <div className={styles.ampElementsGrid}>
                            <a href="/amp-elements/spin-wheel" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3ccircle cx='12' cy='12' r='8'/%3e%3cpath d='M12 2v7.5M19 5l-5.23 5.23M22 12h-7.5m4.5 7-5.23-5.23M12 14.5V22m-1.77-8.23L5 19m4.5-7H2m8.23-1.77L5 5'/%3e%3ccircle cx='12' cy='12' r='2.5'/%3e%3c/svg%3e" alt="Spin Wheel" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Spin Wheel</h3>
                                <p className={styles.ampDescription}>Gamify your emails with interactive spin wheels for discounts and prizes</p>
                            </a>
                            <a href="/amp-elements/quiz" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H8V4h12zm-6.49-5.84c.41-.73 1.18-1.16 1.63-1.8.48-.68.21-1.94-1.14-1.94-.88 0-1.32.67-1.5 1.23l-1.37-.57C11.51 5.96 12.52 5 13.99 5c1.23 0 2.08.56 2.51 1.26.37.6.58 1.73.01 2.57-.63.93-1.23 1.21-1.56 1.81-.13.24-.18.4-.18 1.18h-1.52c.01-.41-.06-1.08.26-1.66m-.56 3.79c0-.59.47-1.04 1.05-1.04.59 0 1.04.45 1.04 1.04 0 .58-.44 1.05-1.04 1.05-.58 0-1.05-.47-1.05-1.05'/%3e%3c/svg%3e" alt="Quiz" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Quiz</h3>
                                <p className={styles.ampDescription}>Engage users with interactive quizzes and personalized results</p>
                            </a>
                            <a href="/amp-elements/accordion" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.5' d='M.5 13h23M.5 7.25h23m-23 11.5h12.46'/%3e%3c/svg%3e" alt="Accordion" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Accordion</h3>
                                <p className={styles.ampDescription}>Organize content with expandable accordion sections</p>
                            </a>
                            <a href="/amp-elements/score" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m4.635 14.415 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L6 18.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.217-.22-.098-.604.2-.65zm12 0 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L18 18.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.216-.22-.098-.604.2-.65zm-6-9 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L12 9.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.217-.22-.098-.604.2-.65z'/%3e%3c/svg%3e" alt="Score" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Score (1-5)</h3>
                                <p className={styles.ampDescription}>Collect satisfaction ratings from unhappy to happy</p>
                            </a>
                            <a href="/amp-elements/carousel" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M7 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zm15 11h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1M2 17h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2'/%3e%3c/svg%3e" alt="Carousel" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Carousel</h3>
                                <p className={styles.ampDescription}>Showcase multiple products or images in swipeable carousels</p>
                            </a>
                            <a href="/amp-elements/checkbox" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23BDBDBD' viewBox='0 0 24 24'%3e%3cpath d='M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0m8-10C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m5.457 7.457-1.414-1.414L11 13.086l-2.793-2.793-1.414 1.414L11 15.914z'/%3e%3c/svg%3e" alt="Checkbox" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Checkbox</h3>
                                <p className={styles.ampDescription}>Interactive checkboxes for preferences and selections</p>
                            </a>
                            <a href="/amp-elements/form" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M4 9h7V6H4zm0 9h9v-3H4z' opacity='.3'/%3e%3cpath fill='%23BDBDBD' d='M13 11H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h9zM4 9h7V6H4zm11 11H4c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h11zM4 18h9v-3H4zm18-9h-2l2-5h-7v7h2v9zM4.75 17.25h1.5v-1.5h-1.5zm0-9h1.5v-1.5h-1.5z'/%3e%3c/svg%3e" alt="Form" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Form</h3>
                                <p className={styles.ampDescription}>Collect information with interactive forms in email</p>
                            </a>
                            <a href="/amp-elements/feedback" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H5.17L4 17.17V4h16zm-9-4h2v2h-2zm0-6h2v4h-2z'/%3e%3c/svg%3e" alt="Feedback" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Feedback</h3>
                                <p className={styles.ampDescription}>Let customers leave product reviews directly in email</p>
                            </a>
                            <a href="/amp-elements/poll" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%23BDBDBD' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e" alt="Poll" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Poll</h3>
                                <p className={styles.ampDescription}>Gather opinions with interactive polls and instant results</p>
                            </a>
                            <a href="/amp-elements/tinder-products" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.5' d='M12 2.16s8 3.58 8 10.73-4.47 9-8.95 9a8 8 0 0 1-8-8 9.68 9.68 0 0 1 3.53-7.26 5.9 5.9 0 0 0 1.79 3.58A8 8 0 0 0 12 2.16Z'/%3e%3c/svg%3e" alt="Tinder Products" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Tinder Products</h3>
                                <p className={styles.ampDescription}>Swipe through products like Tinder for e-commerce</p>
                            </a>
                            <a href="/amp-elements/stories" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M16.75 4v16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-4-2h-9c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 18h-9V4h9zm8-14v12c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5'/%3e%3c/svg%3e" alt="Stories" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Stories</h3>
                                <p className={styles.ampDescription}>Instagram-style stories for engaging content delivery</p>
                            </a>
                            <a href="/amp-elements/subscription-portal" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e" alt="Subscription Portal" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Subscription Portal</h3>
                                <p className={styles.ampDescription}>In-email dashboard to manage deliveries, skip, pause, or cancel</p>
                            </a>
                            <a href="/amp-elements/reactivate" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M17 18.875A8.5 8.5 0 0 0 12 3.5h-.5m.5 17A8.5 8.5 0 0 1 7 5.125M11 22.4l2-2-2-2m2-12.8-2-2 2-2'/%3e%3c/svg%3e" alt="Reactivate" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Reactivate</h3>
                                <p className={styles.ampDescription}>One-click resume subscription for inactive customers</p>
                            </a>
                            <a href="/amp-elements/action-button" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' d='M22 8v6c0 1.1-.9 2-2 2h-1v-2h1V8H4v6h6v2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2m-7.5 10 1.09-2.41L18 14.5l-2.41-1.09L14.5 11l-1.09 2.41L11 14.5l2.41 1.09zm2.5-5 .62-1.38L19 11l-1.38-.62L17 9l-.62 1.38L15 11l1.38.62zm-2.5 5 1.09-2.41L18 14.5l-2.41-1.09L14.5 11l-1.09 2.41L11 14.5l2.41 1.09zm2.5-5 .62-1.38L19 11l-1.38-.62L17 9l-.62 1.38L15 11l1.38.62z'/%3e%3c/svg%3e" alt="Action Button" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Action Button</h3>
                                <p className={styles.ampDescription}>Flexible CTA button that triggers AMP actions</p>
                            </a>
                            <a href="/amp-elements/flip-to-reveal" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%23BDBDBD' fill-opacity='.5' d='M17 18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3H5v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3h-2z'/%3e%3cpath fill='%23BDBDBD' d='M16 5a1 1 0 0 1 1 1v3h2V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v3h2V6a1 1 0 0 1 1-1zm5 8v-2H3v2z'/%3e%3c/svg%3e" alt="Flip To Reveal" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Flip To Reveal</h3>
                                <p className={styles.ampDescription}>Gamified flip card animation for hidden content</p>
                            </a>
                            <a href="/amp-elements/click-to-reveal" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32'%3e%3cpath fill='%23BDBDBD' d='M11.5 3V2a.5.5 0 0 1 1 0v1a.5.5 0 1 1-1 0M2 12.5h1a.5.5 0 0 0 0-1H2a.5.5 0 0 0 0 1m13.776-8.052a.5.5 0 0 0 .671-.224l1-2a.5.5 0 1 0-.895-.448l-1 2a.5.5 0 0 0 .224.672m-12 11.105-2 1a.5.5 0 0 0 .448.895l2-1a.5.5 0 1 0-.448-.896m23.285 7.8a1.5 1.5 0 0 1 0 2.126l-1.586 1.582a1.5 1.5 0 0 1-2.125 0l-6.414-6.413a.49.49 0 0 0-.447-.14.5.5 0 0 0-.362.285l-2.222 5.788-.009.02a1.48 1.48 0 0 1-1.364.899h-.073a1.485 1.485 0 0 1-1.35-1.029L4.575 6.46A1.5 1.5 0 0 1 6.46 4.575l20.01 6.534a1.5 1.5 0 0 1 .13 2.791l-.02.009-5.789 2.222a.5.5 0 0 0-.146.809zm-.707.708-6.414-6.415a1.5 1.5 0 0 1 .462-2.436l.02-.008 5.79-2.223a.493.493 0 0 0-.053-.919L6.149 5.526a.5.5 0 0 0-.624.625L12.06 26.16a.5.5 0 0 0 .92.052l2.222-5.788.01-.02a1.5 1.5 0 0 1 2.435-.462l6.414 6.414a.5.5 0 0 0 .706 0l1.587-1.586a.5.5 0 0 0 0-.708'/%3e%3c/svg%3e" alt="Click To Reveal" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Click To Reveal</h3>
                                <p className={styles.ampDescription}>Hide content until user clicks to uncover it</p>
                            </a>
                            <a href="/amp-elements/sms-capture" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%23BDBDBD' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M7.5 12h.01M12 12h.01m4.49 0h.01M12 21a9 9 0 1 0-8.342-5.616c.081.2.122.3.14.381a1 1 0 0 1 .024.219c0 .083-.015.173-.045.353l-.593 3.558c-.062.373-.093.56-.035.694a.5.5 0 0 0 .262.262c.135.058.321.027.694-.035l3.558-.593c.18-.03.27-.045.353-.045.081 0 .14.006.219.024.08.018.18.059.38.14A9 9 0 0 0 12 21m-4-9a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m4.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m4.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0'/%3e%3c/svg%3e" alt="SMS Capture" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>SMS Capture</h3>
                                <p className={styles.ampDescription}>Gather phone numbers for SMS opt-in directly in email</p>
                            </a>
                            <a href="/amp-elements/product-block" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23BDBDBD' stroke-miterlimit='10' stroke-width='1.5' d='M18.68 1.5H5.32L1.5 8.18V22.5h21V8.18zM4.36 18.68h3.82M12 1.5V12M1.5 8.18h21' data-name='package 1'/%3e%3c/svg%3e" alt="Product Block" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Product Block</h3>
                                <p className={styles.ampDescription}>Showcase single product with in-email add to cart</p>
                            </a>
                            <a href="/amp-elements/product-grid" className={styles.ampElement}>
                                <div className={styles.ampIcon}>
                                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32'%3e%3cpath fill='%23BDBDBD' d='M27 6.5H5A1.5 1.5 0 0 0 3.5 8v16A1.5 1.5 0 0 0 5 25.5h22a1.5 1.5 0 0 0 1.5-1.5V8A1.5 1.5 0 0 0 27 6.5m-14.5 12v-5h7v5zm7 1v5h-7v-5zm-15-6h7v5h-7zm8-1v-5h7v5zm8 1h7v5h-7zm7-5.5v4.5h-7v-5H27a.5.5 0 0 1 .5.5M5 7.5h6.5v5h-7V8a.5.5 0 0 1 .5-.5M4.5 24v-4.5h7v5H5a.5.5 0 0 1-.5-.5m22.5.5h-6.5v-5h7V24a.5.5 0 0 1-.5.5'/%3e%3c/svg%3e" alt="Product Grid" style={{ width: '32px', height: '48px' }} />
                                </div>
                                <h3 className={styles.ampTitle}>Product Grid</h3>
                                <p className={styles.ampDescription}>Display multiple products in grid layout</p>
                            </a>
                        </div>
                    </div>

                    <div className={styles.ctaSection}>
                        <h2 className={styles.ctaTitle}>Ready to Transform Your Email Marketing?</h2>
                        <p className={styles.ctaText}>
                            Start creating interactive AMP emails today and see the difference in engagement and conversions.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="https://app.convertic.ai/users/register" className={styles.primaryButton}>
                                Get Started Free
                            </a>
                            <a href="/pricing" className={styles.secondaryButton}>
                                View Pricing
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
