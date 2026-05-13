interface Stat {
  value: string
  labelEs: string
  labelEn: string
  icon: 'none' | 'star' | 'medal'
}

interface ExperienceStatsProps {
  stats: Stat[]
  locale: string
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8e04a" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8e04a" strokeWidth="1.5">
      <circle cx="12" cy="14" r="7"/>
      <path d="M8.21 3.06L7 6l3 1M15.79 3.06L17 6l-3 1"/>
      <path d="M12 10v4M10 12h4"/>
    </svg>
  )
}

export default function ExperienceStats({ stats, locale }: ExperienceStatsProps) {
  return (
    <>
      <style>{`
        .estats__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .estats__card {
          background: #1e3a2f;
          border-radius: 8px;
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 140px;
        }
        .estats__icon {
          margin-bottom: 1rem;
          height: 24px;
          display: flex;
          align-items: center;
        }
        .estats__value {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 400;
          color: #fff;
          line-height: 1;
          margin-bottom: 1rem;
        }
        .estats__value--with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .estats__label {
          font-family: 'Inter', sans-serif;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fff;
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .estats__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 400px) {
          .estats__grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="estats__grid">
        {stats.map((stat, i) => (
          <div key={i} className="estats__card">
            {stat.icon !== 'none' && (
              <div className="estats__icon">
                {stat.icon === 'star' && <StarIcon />}
                {stat.icon === 'medal' && <MedalIcon />}
              </div>
            )}
            <div className={`estats__value${stat.icon !== 'none' ? ' estats__value--with-icon' : ''}`}>
              {stat.value}
            </div>
            <p className="estats__label">
              {locale === 'es' ? stat.labelEs : stat.labelEn}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}