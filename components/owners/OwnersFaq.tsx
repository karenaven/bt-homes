'use client'

import { useState } from 'react'

interface FaqItem {
  questionEs: string
  questionEn: string
  answerEs: string
  answerEn: string
}

interface OwnersFaqProps {
  title: string
  items: FaqItem[]
  locale: string
}

export default function OwnersFaq({ title, items, locale }: OwnersFaqProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="faq">
      <style>{`
        .faq {
          padding-block: var(--padding-block);
          padding-bottom: 3rem;
        }

        .exp-container {
          width: 100%;
          max-width: calc(
          var(--container-width) +
          (var(--padding-block) * 2)
          );
  margin: 0 auto;
  padding-inline: var(--padding-inline);
}

        .faq__inner {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 4rem;
  align-items: start;
}

        .faq__title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0;
          position: sticky;
          top: 2rem;
        }
        .faq__list {
          display: flex;
          flex-direction: column;
        }
        .faq__item {
          border-bottom: 1px solid #e0ddd6;
        }

        .faq__item:last-child {
  border-bottom: none;
}

        .faq__item:first-child {
          border-top: 1px solid #e0ddd6;
        }
        .faq__btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.375rem 0;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .faq__question {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #0a0a0c;
          line-height: 1.5;
        }
        .faq__chevron {
          width: 18px;
          height: 18px;
          color: #888;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .faq__chevron--open {
          transform: rotate(90deg);
        }
        .faq__answer-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s ease;
        }
        .faq__answer-wrap--open {
          grid-template-rows: 1fr;
        }
        .faq__answer-inner {
          overflow: hidden;
        }
        .faq__answer {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.7;
          color: #444;
          padding-bottom: 1.375rem;
          margin: 0;
        }

        @media (max-width: 900px) {
  .faq {
    padding-block: 4rem;
  }

  .exp-container {
    padding-inline: var(--padding-inline-tablet);
  }

  .faq__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .faq__title {
    position: static;
  }
}

@media (max-width: 580px) {
  .faq {
    padding-block: 4rem;
    padding-bottom: 0;
  }

  .exp-container {
    padding-inline: var(--padding-inline-mobile);
  }
}

      
      `}</style>

      <div className="exp-container">
        <div className="faq__inner">
          <h2 className="faq__title">{title}</h2>

          <div className="faq__list">
            {items.map((item, i) => {
              const question = locale === 'es' ? item.questionEs : item.questionEn
              const answer = locale === 'es' ? item.answerEs : item.answerEn
              const isOpen = open === i

              return (
                <div key={i} className="faq__item">
                  <button
                    className="faq__btn"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq__question">{question}</span>
                    <svg
                      className={`faq__chevron${isOpen ? ' faq__chevron--open' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  <div className={`faq__answer-wrap${isOpen ? ' faq__answer-wrap--open' : ''}`}>
                    <div className="faq__answer-inner">
                      <p className="faq__answer">{answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}