import React, {useEffect, useId, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  text: 'Ask me anything about the AI & Data Science book. I answer from its chapters and show the sources I used.',
  sources: [],
};

function SourceLinks({sources}) {
  if (!sources?.length) return null;

  return (
    <div className={styles.sources}>
      <span className={styles.sourcesLabel}>Book sources</span>
      <div className={styles.sourceList}>
        {sources.map((source, index) => (
          <Link
            className={styles.sourceLink}
            key={`${source.path}-${source.section}-${index}`}
            to={source.path}
            title={`Open ${source.title}`}
          >
            <span className={styles.sourceNumber}>{index + 1}</span>
            <span>
              <strong>{source.title}</strong>
              {source.section && <small>{source.section}</small>}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BookChatbot() {
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = String(siteConfig.customFields?.apiUrl ?? 'http://localhost:8000').replace(/\/$/, '');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const panelId = useId();
  const inputId = useId();
  const messagesRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [isOpen, messages, isLoading]);

  async function askBook(event) {
    event.preventDefault();
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: normalizedQuestion,
      sources: [],
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: normalizedQuestion}),
      });

      if (!response.ok) {
        throw new Error(`The book assistant returned ${response.status}.`);
      }

      const result = await response.json();
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: result.answer,
          sources: result.sources ?? [],
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? 'Cannot reach the book assistant. Make sure the FastAPI backend is running.'
          : requestError.message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.chatbot}>
      {isOpen && (
        <section aria-label="AI book assistant" className={styles.panel} id={panelId}>
          <header className={styles.header}>
            <div>
              <span className={styles.eyebrow}>RAG book assistant</span>
              <h2>Ask the Academy</h2>
            </div>
            <button
              aria-label="Close book assistant"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ×
            </button>
          </header>

          <div aria-live="polite" className={styles.messages} ref={messagesRef}>
            {messages.map((message) => (
              <article
                className={`${styles.message} ${styles[message.role]}`}
                key={message.id}
              >
                <span className={styles.messageRole}>
                  {message.role === 'user' ? 'You' : 'Book AI'}
                </span>
                <p>{message.text}</p>
                <SourceLinks sources={message.sources} />
              </article>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant} ${styles.loading}`}>
                <span className={styles.messageRole}>Book AI</span>
                <span className={styles.thinking}>Searching the book</span>
              </div>
            )}
          </div>

          <form className={styles.form} onSubmit={askBook}>
            {error && <p className={styles.error}>{error}</p>}
            <label className={styles.srOnly} htmlFor={inputId}>
              Ask a question about the book
            </label>
            <div className={styles.composer}>
              <textarea
                id={inputId}
                maxLength={2000}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="e.g. How does gradient descent work?"
                rows={2}
                value={question}
              />
              <button disabled={!question.trim() || isLoading} type="submit">
                Ask
              </button>
            </div>
            <small className={styles.disclaimer}>Answers are grounded in this book's indexed chapters.</small>
          </form>
        </section>
      )}

      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={styles.launcher}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span aria-hidden="true" className={styles.launcherIcon}>AI</span>
        <span>{isOpen ? 'Close assistant' : 'Ask the book'}</span>
      </button>
    </div>
  );
}
