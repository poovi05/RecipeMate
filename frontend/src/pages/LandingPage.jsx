import React from 'react';

export const LandingPage = ({
  onGetStarted,
  onSwitchToLogin,
  onSwitchToRegister,
}) => {
  const features = [
    {
      icon: '🍳',
      title: 'Discover Recipes',
      description:
        'Explore delicious recipes based on your food preferences and available ingredients.',
    },
    {
      icon: '📅',
      title: 'Smart Meal Planner',
      description:
        'Organize your breakfast, lunch and dinner with convenient daily and weekly plans.',
    },
    {
      icon: '🛒',
      title: 'Grocery Management',
      description:
        'Generate grocery lists, manage kitchen ingredients and reduce food waste.',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'inherit',
      }}
    >
      {/* Navigation Bar */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 6%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
            }}
          >
            🍲
          </div>

          <span
            style={{
              fontSize: '25px',
              fontWeight: 800,
              letterSpacing: '-0.8px',
            }}
          >
            Recipe<span style={{ color: '#10b981' }}>Mate</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onSwitchToLogin}
            className="btn btn-secondary"
          >
            Sign In
          </button>

          <button
            onClick={onSwitchToRegister}
            className="btn btn-primary"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '75px 24px 55px',
          textAlign: 'center',
          maxWidth: '1050px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: '#d1fae5',
            color: '#047857',
            padding: '9px 18px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          🍃 Your Everyday Food Planning Assistant
        </div>

        <h1
          style={{
            fontSize: 'clamp(34px, 5vw, 58px)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-1.5px',
            margin: '0 auto 22px',
          }}
        >
          Plan Better Meals.
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #10b981, #0284c7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Eat Smarter Every Day.
          </span>
        </h1>

        <p
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            color: '#64748b',
            fontSize: '17px',
            lineHeight: 1.8,
          }}
        >
          Discover tasty recipes, plan your daily meals and manage
          your groceries in one place. Make cooking easier and
          reduce unnecessary food waste with RecipeMate.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginTop: '32px',
          }}
        >
          <button
            onClick={onSwitchToRegister}
            className="btn btn-primary"
            style={{
              padding: '15px 28px',
              borderRadius: '12px',
              fontSize: '16px',
            }}
          >
            Get Started →
          </button>

          <button
            onClick={onSwitchToLogin}
            className="btn btn-secondary"
            style={{
              padding: '15px 28px',
              borderRadius: '12px',
              fontSize: '16px',
            }}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '20px 24px 70px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '30px',
              fontWeight: 800,
              marginBottom: '10px',
            }}
          >
            Everything You Need
          </h2>

          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Simple tools to make everyday cooking more organized.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '22px',
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '30px 24px',
                boxShadow: '0 8px 25px rgba(15, 23, 42, 0.04)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '16px',
                  background: '#d1fae5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '29px',
                  marginBottom: '22px',
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 750,
                  marginBottom: '12px',
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.8,
                  color: '#64748b',
                  margin: 0,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '22px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
        }}
      >
        © 2026 RecipeMate. Smart Food & Meal Planning.
      </footer>
    </div>
  );
};