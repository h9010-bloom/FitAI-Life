import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/membership.css';

const freeFeatures = [
    'AI Chat',
    'Random Diet Plans',
    'Random Exercise Plans',
    'Workout & Meal Streak',
    'Progress Dashboard',
    '2 Week Challenge',
    '5 Week Challenge',
    '8 Week Challenge',
];

const premiumFeatures = [
    'Dietitian Meal Plans',
    'Professional Trainer Workouts',
    'Premium AI Chat',
    'Water Reminder',
    'Sleep Suggestions',
    'Weekly Reports',
    '1 Month Challenge',
    '2 Month Challenge',
    '4 Month Challenge',
    '6 Month Challenge',
    '1 Year Challenge',
];

const Membership = () => {
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (location.state?.openPremiumTrial) {
            setShowPremiumModal(true);
        }
    }, [location.state]);

    const openPremiumModal = () => setShowPremiumModal(true);
    const closePremiumModal = () => setShowPremiumModal(false);
    const handleFreeMembership = () => {
        navigate('/challenge', {
            state: {
                membershipType: 'Free',
            },
        });
    };

    const handlePremiumTrial = () => {
        navigate('/challenge', {
            state: {
                membershipType: 'Premium Trial',
            },
        });
    };

    return (
        <main className="membership-page">
            <section className="membership-header">
                <p className="membership-header__eyebrow">Choose your path</p>
                <h1>Membership Plans</h1>
                <p className="membership-header__text">
                    Start with the essentials or unlock full premium support for your fitness journey.
                </p>
            </section>

            <section className="membership-grid">
                <article className="membership-card membership-card--free">
                    <div className="membership-card__top">
                        <h2>Free Plan</h2>
                        <p className="membership-card__price">₹0</p>
                    </div>

                    <ul className="membership-card__features">
                        {freeFeatures.map((feature) => (
                            <li key={feature}>{feature}</li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="membership-card__button membership-card__button--free"
                        onClick={handleFreeMembership}
                    >
                        Start Your Fitness Journey
                    </button>
                </article>

                <article className="membership-card membership-card--premium">
                    <div className="membership-card__top">
                        <div className="membership-card__title-row">
                            <h2>FitAI-Life Premium</h2>
                            <span className="membership-card__badge">🔥 New User Offer</span>
                        </div>
                        <p className="membership-card__price">₹599 / Month</p>
                    </div>

                    <ul className="membership-card__features">
                        {premiumFeatures.map((feature) => (
                            <li key={feature}>{feature}</li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="membership-card__button membership-card__button--premium"
                        onClick={openPremiumModal}
                    >
                        Unlock Premium
                    </button>
                </article>
            </section>

            {showPremiumModal && (
                <div className="membership-modal-overlay" onClick={closePremiumModal}>
                    <div className="membership-modal" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className="membership-modal__close"
                            onClick={closePremiumModal}
                            aria-label="Close premium modal"
                        >
                            ×
                        </button>

                        <h2 className="membership-modal__title">🎉 Welcome to FitAI-Life Premium</h2>
                        <p className="membership-modal__description">Congratulations!</p>
                        <p className="membership-modal__description">
                            As a new FitAI-Life member, you are eligible for a FREE 7-Day Premium Trial.
                        </p>

                        <div className="membership-modal__pricing">
                            <div className="membership-modal__pricing-row">
                                <span>Regular Price</span>
                                <strong>₹599 / Month</strong>
                            </div>
                            <div className="membership-modal__pricing-row">
                                <span>Today</span>
                                <strong>FREE for 7 Days</strong>
                            </div>
                        </div>

                        <div className="membership-modal__info">
                            <p>During your Premium Trial you will receive:</p>
                            <ul>
                                <li>✔ Professional Trainer Workout Plans</li>
                                <li>✔ Dietitian Meal Plans</li>
                                <li>✔ Premium AI Chat</li>
                                <li>✔ Long-Term Fitness Challenges</li>
                                <li>✔ Water &amp; Sleep Tracking</li>
                            </ul>
                        </div>

                        <div className="membership-modal__actions">
                            <button
                                type="button"
                                className="membership-modal__button membership-modal__button--primary"
                                onClick={handlePremiumTrial}
                            >
                                Start Free Trial
                            </button>
                            <button
                                type="button"
                                className="membership-modal__button membership-modal__button--secondary"
                                onClick={handleFreeMembership}
                            >
                                Continue with Free Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Membership;
