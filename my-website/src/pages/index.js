import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={clsx('container', styles.heroGrid)}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>A complete 10-month learning path</span>
          <Heading as="h1">
            Learn to build with data.<br />Think with AI.
          </Heading>
          <p className={styles.heroSubtitle}>
            Go from your first Python program to machine learning, generative AI,
            and safe multi-agent systems through structured lessons and projects.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/">
              Start learning
            </Link>
            <Link
              className={clsx('button button--secondary button--lg', styles.secondaryButton)}
              to="/docs/course-roadmap">
              Explore the roadmap
            </Link>
          </div>
          <div className={styles.stats} aria-label="Course statistics">
            <div><strong>10</strong><span>modules</span></div>
            <div><strong>41</strong><span>weeks</span></div>
            <div><strong>97</strong><span>chapters</span></div>
          </div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.orbitOne} />
          <div className={styles.orbitTwo} />
          <div className={styles.coreMark}>AI</div>
          <span className={styles.nodeOne}>Python</span>
          <span className={styles.nodeTwo}>Data</span>
          <span className={styles.nodeThree}>ML</span>
          <span className={styles.nodeFour}>Agents</span>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A module-based AI and Data Science book from Python foundations through agentic AI.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
