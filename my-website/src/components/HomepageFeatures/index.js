import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    number: '01',
    title: 'Learn progressively',
    description: 'Start with Python and data fundamentals, then build the mathematics and modeling intuition needed for advanced AI.',
  },
  {
    number: '02',
    title: 'Practice deliberately',
    description: 'Every chapter includes objectives, a practical activity, common mistakes, takeaways, and review questions.',
  },
  {
    number: '03',
    title: 'Build evidence',
    description: 'Class and home projects turn each module into portfolio-ready proof of your problem-solving process.',
  },
];

const ModuleList = [
  ['01', 'Python Foundations', 'Variables, control flow, functions, files, exceptions, and OOP.', '/docs/python-foundations'],
  ['02', 'Python for Data Science', 'NumPy, Pandas, cleaning, aggregation, and visualization.', '/docs/python-for-data-science'],
  ['03', 'Statistics & Math', 'Probability, inference, linear algebra, loss, and gradients.', '/docs/statistics-and-math'],
  ['04', 'Machine Learning', 'Reliable pipelines, supervised learning, clustering, and PCA.', '/docs/machine-learning'],
  ['05', 'Deep Learning', 'Neural networks for image, text, and sequential data.', '/docs/deep-learning'],
  ['06', 'MLOps', 'APIs, containers, tracking, delivery, logs, and monitoring.', '/docs/mlops'],
  ['07', 'Big Data & Cloud', 'Hadoop, Spark, distributed ML, and cloud deployment.', '/docs/big-data-and-cloud'],
  ['08', 'Generative AI', 'Transformers, prompting, fine-tuning, RAG, and vectors.', '/docs/generative-ai'],
  ['09', 'Agentic AI', 'Tools, planning, memory, orchestration, and multi-agent systems.', '/docs/agentic-ai'],
];

function Feature({number, title, description}) {
  return (
    <div className={styles.featureCard}>
      <span>{number}</span>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionIntro}>
          <span>Designed for real progress</span>
          <Heading as="h2">A guided path from foundations to frontier AI</Heading>
          <p>The curriculum is broad, but the learning loop stays simple: understand, practice, validate, explain, and build.</p>
        </div>
        <div className={styles.featureGrid}>
          {FeatureList.map((props) => <Feature key={props.number} {...props} />)}
        </div>
        <div className={styles.modulesHeader}>
          <div>
            <span>Curriculum</span>
            <Heading as="h2">Nine connected technical modules</Heading>
          </div>
          <Link to="/docs/course-roadmap">View the full roadmap →</Link>
        </div>
        <div className={styles.moduleGrid}>
          {ModuleList.map(([number, title, description, to]) => (
            <Link className={styles.moduleCard} to={to} key={number}>
              <span>{number}</span>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
              <strong>Open module →</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
