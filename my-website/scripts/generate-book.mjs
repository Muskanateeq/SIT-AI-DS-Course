import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(projectRoot, 'docs');

const modules = [
  {
    folder: '01-python-foundations',
    label: 'Module 01 · Python Foundations',
    weeks: 'Weeks 2–6',
    description: 'Build the programming foundation needed for data science, machine learning, and AI development.',
    chapters: [
      ['Variables, Data Types, and Operators', 'Week 2', 'Understand Python values, declare meaningful variables, and combine arithmetic, comparison, and logical operators.', ['variables and naming', 'numbers, strings, and booleans', 'type conversion', 'arithmetic operators', 'comparison and logical operators'], 'Create a small expense calculator that accepts prices, computes a total, and reports whether the total exceeds a budget.'],
      ['Conditional Statements', 'Week 2', 'Use if, elif, and else to make programs choose an action from available conditions.', ['Boolean conditions', 'if, elif, and else', 'nested decisions', 'truthy and falsy values'], 'Write a grading rule that converts a numeric score into a grade and handles invalid scores.'],
      ['Loops and Iterations', 'Week 3', 'Automate repetitive work with for and while loops while controlling execution with break and continue.', ['for loops', 'while loops', 'range and sequence iteration', 'break and continue', 'loop design'], 'Analyze a list of daily sales and calculate the total, average, and number of days above target.'],
      ['Functions, Lambda, and Modules', 'Week 3', 'Create reusable functions, use small lambda expressions, and organize code through Python modules.', ['parameters and return values', 'scope', 'lambda expressions', 'imports and modules', 'reusable program design'], 'Refactor a repeated data-cleaning task into tested functions and import it from a utility module.'],
      ['Python Data Structures', 'Week 4', 'Organize data with lists, tuples, dictionaries, and sets, choosing the right structure for each task.', ['lists', 'tuples', 'dictionaries', 'sets', 'iteration and comprehensions'], 'Represent a student record with appropriate structures, update marks, and find the unique subjects studied.'],
      ['File Handling', 'Week 4', 'Read and write files so programs can store, retrieve, and process persistent data.', ['paths', 'text file reading', 'writing and appending', 'with context managers', 'CSV and structured data awareness'], 'Read employee records from a file, calculate a summary, and save the result without overwriting the source.'],
      ['Exception Handling', 'Week 5', 'Handle expected failures gracefully with try, except, else, and finally.', ['exceptions', 'try and except', 'else and finally', 'raising errors', 'clear error messages'], 'Make a numeric input workflow resilient to empty values, invalid numbers, and missing files.'],
      ['Object-Oriented Programming', 'Week 5', 'Model related data and behavior with classes, objects, inheritance, and encapsulation.', ['classes and objects', 'attributes and methods', 'constructors', 'inheritance', 'encapsulation'], 'Design a Student class that stores marks, calculates an average, and reports a final status.'],
      ['Class-Based Python Projects', 'Week 6', 'Apply Python and object-oriented programming in guided projects.', ['Student Grading System', 'Salary and Billing System'], 'Build one project in stages: requirements, data model, implementation, validation, and demonstration.'],
      ['Home-Based Python Projects', 'Week 6', 'Strengthen file handling and program design through independent practice.', ['Employee Record System', 'Library Management System'], 'Choose one project, define the file format, implement CRUD-style operations, and document test cases.'],
    ],
  },
  {
    folder: '02-python-for-data-science',
    label: 'Module 02 · Python for Data Science',
    weeks: 'Weeks 7–10',
    description: 'Use NumPy, Pandas, and visualization libraries to prepare, explore, and communicate data.',
    chapters: [
      ['NumPy Core Operations', 'Week 7', 'Use arrays, vectorized operations, indexing, broadcasting, and mathematical functions for efficient numerical work.', ['ndarrays', 'shape and dtype', 'indexing and slicing', 'vectorization', 'broadcasting'], 'Create an array of weekly measurements and calculate normalized values without manual loops.'],
      ['Pandas DataFrames', 'Week 7', 'Create, inspect, index, filter, and transform tabular data with Series and DataFrames.', ['Series and DataFrames', 'loading data', 'selection and filtering', 'column operations', 'summary methods'], 'Load a small sales table, filter a region, create a revenue column, and summarize the result.'],
      ['Data Cleaning and Transformation', 'Week 8', 'Detect inconsistent values and transform raw datasets into analysis-ready data.', ['data profiling', 'duplicate records', 'type conversion', 'string cleaning', 'normalization'], 'Clean inconsistent product names, dates, and prices while keeping an audit of each change.'],
      ['Handling Missing Values', 'Week 8', 'Identify null data and choose an appropriate removal or imputation strategy.', ['detecting nulls', 'missingness patterns', 'dropping values', 'simple imputation', 'documenting assumptions'], 'Compare row removal, median imputation, and an explicit unknown category on a sample dataset.'],
      ['Merging and GroupBy', 'Week 9', 'Combine related tables and aggregate groups to answer analytical questions.', ['merge keys', 'join types', 'concatenation', 'groupby', 'aggregation'], 'Join orders with customer data and calculate revenue by city and customer segment.'],
      ['Data Visualization', 'Week 9', 'Create accurate static and interactive charts with Matplotlib, Seaborn, and Plotly.', ['chart selection', 'Matplotlib', 'Seaborn', 'Plotly', 'labels and visual integrity'], 'Turn a time-based sales dataset into a trend chart, comparison chart, and interactive view.'],
      ['Class-Based Data Science Projects', 'Week 10', 'Combine cleaning, analysis, and visualization in instructor-guided projects.', ['COVID Dataset Exploratory Data Analysis', 'Sales Dashboard with Pandas and Plotly'], 'Define questions first, prepare the data, create visuals, and present evidence-based findings.'],
      ['Home-Based Data Science Projects', 'Week 10', 'Practice independent exploratory analysis with realistic datasets.', ['E-commerce Customer EDA', 'Weather Data Analysis Notebook'], 'Produce a reproducible notebook containing questions, cleaning decisions, visuals, conclusions, and limitations.'],
    ],
  },
  {
    folder: '03-statistics-and-math',
    label: 'Module 03 · Statistics and Math for ML',
    weeks: 'Weeks 11–14',
    description: 'Develop the mathematical intuition needed to reason about data and model training.',
    chapters: [
      ['Descriptive Statistics', 'Week 11', 'Summarize datasets with measures of center, spread, position, and distribution shape.', ['mean, median, and mode', 'range and quartiles', 'variance and standard deviation', 'outliers', 'descriptive summaries'], 'Compare two groups whose means are similar but whose variability is very different.'],
      ['Probability and Distributions', 'Week 11', 'Reason about uncertainty and recognize Normal, Binomial, and Poisson distributions.', ['events and sample spaces', 'conditional probability', 'random variables', 'Normal distribution', 'Binomial and Poisson distributions'], 'Choose a suitable distribution for repeated trials, arrival counts, and continuous measurements.'],
      ['Hypothesis Testing', 'Week 12', 'Use statistical evidence to evaluate a claim while accounting for uncertainty and errors.', ['null and alternative hypotheses', 'test statistics', 'p-values', 'significance level', 'Type I and Type II errors'], 'Formulate and test whether a redesigned page changes an observed conversion rate.'],
      ['Covariance and Correlation', 'Week 12', 'Measure how variables move together and interpret the strength and direction of relationships.', ['covariance', 'Pearson correlation', 'rank correlation', 'correlation matrices', 'correlation versus causation'], 'Analyze relationships among advertising spend, website visits, and sales without making causal claims.'],
      ['Linear Algebra Basics', 'Week 13', 'Work with vectors, matrices, and operations that underpin modern machine learning.', ['vectors', 'matrices', 'dot products', 'matrix multiplication', 'shape and dimensionality'], 'Represent samples and features as a matrix and compute a simple weighted prediction.'],
      ['Cost Functions and Gradients', 'Week 13', 'Understand how loss measures error and gradients guide optimization during model training.', ['loss and objective functions', 'mean squared error', 'gradients', 'learning rate', 'gradient descent'], 'Trace several gradient-descent updates on a one-parameter model and observe the effect of learning rate.'],
      ['Class-Based Statistics Projects', 'Week 14', 'Apply descriptive statistics and correlation analysis in guided investigations.', ['Company Sales Statistical Report', 'Dataset Correlation Study'], 'Create a concise report with numerical summaries, charts, interpretations, and explicit limitations.'],
      ['Home-Based Statistics Projects', 'Week 14', 'Use statistical reasoning independently on hypothesis-testing and financial datasets.', ['Hypothesis Testing Assignment', 'Finance or Stock Statistical Exploration'], 'State a question, justify the method, check assumptions, report results, and avoid causal overclaims.'],
    ],
  },
  {
    folder: '04-machine-learning',
    label: 'Module 04 · Machine Learning',
    weeks: 'Weeks 15–21',
    description: 'Build reliable supervised and unsupervised learning workflows from preprocessing through evaluation.',
    chapters: [
      ['The Machine Learning Pipeline', 'Week 15', 'Understand the end-to-end workflow from problem framing and data collection to evaluation and deployment.', ['problem framing', 'data collection', 'training workflow', 'evaluation', 'deployment feedback'], 'Sketch a complete pipeline for predicting customer churn and identify where leakage could occur.'],
      ['Feature Engineering', 'Week 15', 'Create, transform, and select useful input features that help models learn meaningful patterns.', ['domain-informed features', 'transformations', 'encoding', 'feature selection', 'leakage prevention'], 'Turn timestamps and transaction records into safe behavioral features for a churn model.'],
      ['Data Preprocessing for ML', 'Week 15', 'Prepare numerical and categorical features consistently for model training and inference.', ['missing values', 'categorical encoding', 'feature scaling', 'pipelines', 'fit versus transform'], 'Build a preprocessing plan for a mixed dataset containing numeric, categorical, and missing values.'],
      ['Train/Test Split and Cross-Validation', 'Week 16', 'Estimate generalization with held-out data and cross-validation while avoiding overfitting.', ['training and test sets', 'validation sets', 'cross-validation', 'stratification', 'data leakage'], 'Compare a single split with cross-validation and explain why the test set must remain untouched.'],
      ['Linear Regression', 'Week 16', 'Predict a continuous target using a linear relationship between input variables and an outcome.', ['linear model', 'coefficients and intercept', 'residuals', 'mean squared error', 'regression assumptions'], 'Build and evaluate a simple house-price model while interpreting residual error.'],
      ['Logistic Regression', 'Week 17', 'Model class probabilities and make categorical predictions with a linear decision boundary.', ['probabilities', 'sigmoid function', 'decision threshold', 'log loss', 'classification metrics'], 'Predict loan eligibility and compare how different probability thresholds change precision and recall.'],
      ['Decision Trees', 'Week 17', 'Use rule-based splits for classification and regression and control tree complexity.', ['recursive splitting', 'impurity', 'tree depth', 'leaf nodes', 'pruning and overfitting'], 'Train a small decision tree and explain one prediction by following its decision path.'],
      ['Random Forest', 'Week 18', 'Combine many randomized trees to improve stability and reduce overfitting.', ['bagging', 'bootstrap samples', 'feature randomness', 'ensemble voting', 'feature importance'], 'Compare one decision tree with a random forest on the same validation strategy.'],
      ['Gradient Boosting', 'Week 18', 'Build strong predictive models by adding weak learners that correct earlier errors.', ['sequential boosting', 'learning rate', 'number of estimators', 'XGBoost', 'LightGBM'], 'Tune learning rate and estimator count together and track both validation quality and training time.'],
      ['K-Nearest Neighbors', 'Week 19', 'Predict from nearby examples using a distance metric and a selected value of K.', ['distance metrics', 'choosing K', 'feature scaling', 'classification voting', 'local decision boundaries'], 'Visualize how changing K alters predictions and why scaled features matter.'],
      ['Support Vector Machines', 'Week 19', 'Learn maximum-margin decision boundaries and use kernels for nonlinear patterns.', ['support vectors', 'margin', 'regularization', 'kernel trick', 'feature scaling'], 'Compare a linear boundary with a kernel SVM on a simple nonlinear dataset.'],
      ['K-Means Clustering', 'Week 20', 'Partition unlabeled observations into groups by repeatedly updating cluster centers.', ['centroids', 'assignment and update steps', 'choosing K', 'inertia', 'cluster interpretation'], 'Segment customers from behavioral features and profile each cluster without treating labels as ground truth.'],
      ['Hierarchical Clustering', 'Week 20', 'Build a hierarchy of clusters and inspect possible groupings with a dendrogram.', ['agglomerative clustering', 'divisive clustering', 'linkage', 'distance', 'dendrograms'], 'Use a dendrogram to compare candidate cluster cuts and explain how linkage changes the result.'],
      ['Principal Component Analysis', 'Week 21', 'Reduce dimensionality by projecting data onto directions that preserve high variance.', ['standardization', 'principal components', 'explained variance', 'projection', 'interpretation limits'], 'Reduce a multifeature dataset to two components and report how much variance they retain.'],
      ['Class-Based Machine Learning Projects', 'Week 21', 'Integrate the supervised and unsupervised workflow in guided portfolio projects.', ['House Price Prediction', 'Customer Segmentation', 'Loan Eligibility Prediction', 'Fraud Detection Model'], 'Select a metric before modeling, establish a baseline, compare models, and explain errors.'],
      ['Home-Based Machine Learning Projects', 'Week 21', 'Independently build and evaluate practical predictive systems.', ['Churn Prediction', 'Sales Forecasting', 'Credit Risk Scoring', 'HR Attrition Prediction'], 'Document the problem, data risks, validation design, baseline, final model, and responsible-use limits.'],
    ],
  },
  {
    folder: '05-deep-learning',
    label: 'Module 05 · Deep Learning',
    weeks: 'Weeks 22–26',
    description: 'Learn neural-network foundations and apply them to images, text, and sequential data.',
    chapters: [
      ['Neural Network Fundamentals', 'Week 22', 'Understand perceptrons, layers, forward propagation, backpropagation, activations, and loss functions.', ['perceptron', 'weights and biases', 'forward propagation', 'backpropagation', 'activation and loss functions'], 'Trace one small network forward, calculate its error, and describe how a gradient update changes a weight.'],
      ['Convolutional Neural Networks', 'Week 23', 'Use convolutional layers to learn spatial features from images.', ['convolution filters', 'feature maps', 'padding and stride', 'pooling', 'image classification'], 'Track tensor shapes through a small CNN and explain what early and later features may capture.'],
      ['Transfer Learning', 'Week 23', 'Adapt pretrained models such as ResNet or VGG to a new task with limited data.', ['pretrained representations', 'frozen layers', 'new classification head', 'fine-tuning', 'domain shift'], 'Plan a two-stage training strategy for a small custom image dataset.'],
      ['Natural Language Processing', 'Week 24', 'Prepare language data and frame common tasks such as classification, extraction, and generation.', ['text cleaning', 'normalization', 'tokenization awareness', 'language tasks', 'evaluation'], 'Create a transparent text-cleaning pipeline and compare raw versus cleaned examples.'],
      ['Text Embeddings', 'Week 24', 'Represent words, sentences, or documents as vectors that capture useful semantic relationships.', ['sparse and dense representations', 'embedding vectors', 'semantic similarity', 'context', 'embedding applications'], 'Compare several sentence pairs by embedding similarity and inspect one misleading match.'],
      ['RNN, LSTM, and GRU', 'Week 25', 'Model sequential information and understand how gated networks address long-range dependencies.', ['recurrent state', 'sequence order', 'vanishing gradients', 'LSTM gates', 'GRU'], 'Prepare a sequence-classification workflow and compare a basic RNN with a gated alternative.'],
      ['Class-Based Deep Learning Projects', 'Week 26', 'Apply deep-learning workflows in guided image and language projects.', ['CNN Image Classifier', 'LSTM Sentiment Analyzer', 'ResNet or VGG Transfer Learning'], 'Track data splits, tensor shapes, learning curves, evaluation metrics, and failure examples.'],
      ['Home-Based Deep Learning Projects', 'Week 26', 'Practice independent neural-network development on image and spam-classification tasks.', ['Dogs vs Cats Classification', 'Deep Learning Spam Detection'], 'Build a baseline, control overfitting, evaluate on untouched data, and report limitations.'],
    ],
  },
  {
    folder: '06-mlops',
    label: 'Module 06 · MLOps',
    weeks: 'Weeks 27–30',
    description: 'Move machine-learning systems from notebooks into reproducible, observable production services.',
    chapters: [
      ['ML Deployment Concepts', 'Week 27', 'Understand the responsibilities and tradeoffs involved in serving models in production.', ['batch and online inference', 'model artifacts', 'serving architecture', 'latency and throughput', 'versioning'], 'Design a deployment path from a trained model artifact to a monitored prediction service.'],
      ['FastAPI for ML Deployment', 'Week 27', 'Expose model predictions through validated HTTP endpoints built with FastAPI.', ['request and response schemas', 'prediction endpoints', 'model loading', 'validation', 'health checks'], 'Define a health route and a prediction route with clear inputs, outputs, and failure behavior.'],
      ['Docker Containers', 'Week 28', 'Package code, runtime dependencies, and configuration into a repeatable container image.', ['images and containers', 'Dockerfile layers', 'dependency installation', 'ports', 'runtime configuration'], 'Containerize a small prediction API and verify the same command works in a fresh environment.'],
      ['MLflow for Experiment Tracking', 'Week 28', 'Track parameters, metrics, artifacts, and model versions across experiments.', ['experiments and runs', 'parameters and metrics', 'artifacts', 'model registry awareness', 'reproducibility'], 'Log two model runs and compare their parameters, validation metrics, and saved artifacts.'],
      ['CI/CD for Machine Learning', 'Week 29', 'Automate checks and delivery steps so changes can move safely toward production.', ['continuous integration', 'automated tests', 'build pipelines', 'deployment stages', 'rollback awareness'], 'Draft a pipeline that tests preprocessing, builds the service, and deploys only after approval.'],
      ['Logging and Monitoring', 'Week 29', 'Observe service health, input behavior, model quality, and operational failures.', ['structured logs', 'service metrics', 'data drift', 'model performance', 'alerts'], 'Choose signals for an online classifier and separate immediate service alerts from slower model-quality reviews.'],
      ['Class-Based MLOps Projects', 'Week 30', 'Build a guided prediction service and track its modeling experiments.', ['Deploy an ML Model with FastAPI', 'MLflow Tracking Implementation'], 'Deliver a reproducible service, example requests, tracked runs, and setup documentation.'],
      ['Home-Based MLOps Projects', 'Week 30', 'Practice containerized deployment and end-to-end operational workflows.', ['Dockerized ML Microservice', 'Deployment Pipeline with Monitoring'], 'Package, test, deploy, observe, and document an ML service using environment-based configuration.'],
    ],
  },
  {
    folder: '07-big-data-and-cloud',
    label: 'Module 07 · Big Data and Cloud',
    weeks: 'Weeks 31–34',
    description: 'Process data at distributed scale and understand the cloud services that support data and ML workloads.',
    chapters: [
      ['Hadoop Concepts', 'Week 31', 'Understand distributed storage and processing and the problems Hadoop was designed to solve.', ['distributed systems', 'data locality', 'fault tolerance', 'cluster processing', 'Hadoop ecosystem'], 'Explain how a large job can continue when one worker fails and why moving compute toward data matters.'],
      ['HDFS, MapReduce, and YARN', 'Week 31', 'Distinguish Hadoop storage, processing, and resource-management responsibilities.', ['HDFS blocks and replication', 'Map and Reduce stages', 'shuffle', 'YARN resources', 'failure recovery'], 'Map each stage of a word-count job to HDFS, MapReduce, and YARN responsibilities.'],
      ['Apache Spark Foundations', 'Week 32', 'Use Spark for distributed, fault-tolerant processing across a cluster.', ['driver and executors', 'lazy evaluation', 'transformations and actions', 'partitions', 'Spark applications'], 'Trace a small transformation pipeline and identify when computation actually begins.'],
      ['Spark RDDs', 'Week 32', 'Work with resilient distributed collections and understand lineage-based recovery.', ['RDD creation', 'transformations', 'actions', 'partitions', 'lineage'], 'Build a small RDD pipeline and reason about its partitions and recovery lineage.'],
      ['Spark DataFrames and SQL', 'Week 32', 'Process structured data efficiently with DataFrame operations and SQL queries.', ['schemas', 'DataFrame transformations', 'Spark SQL', 'query optimization awareness', 'structured data'], 'Express the same aggregation with the DataFrame API and Spark SQL, then compare the logical intent.'],
      ['Spark MLlib', 'Week 32', 'Train scalable machine-learning pipelines using Spark data structures and estimators.', ['transformers and estimators', 'feature pipelines', 'distributed training', 'evaluation', 'pipeline persistence'], 'Design an MLlib pipeline that prepares features, fits a classifier, and evaluates predictions.'],
      ['Cloud Foundations for Data Science', 'Week 33', 'Understand how storage, compute, networking, permissions, and cost shape cloud solutions.', ['shared responsibility', 'regions', 'identity and access', 'elastic resources', 'cost awareness'], 'Choose basic cloud resources for a batch data pipeline and identify security and cost controls.'],
      ['S3 Object Storage', 'Week 33', 'Store datasets and artifacts in scalable cloud object storage.', ['buckets and objects', 'keys and prefixes', 'permissions', 'versioning', 'data-lake patterns'], 'Design a clean object-key layout for raw, processed, and curated datasets.'],
      ['EC2 Compute Basics', 'Week 33', 'Use virtual machines for configurable cloud compute workloads.', ['instance types', 'images', 'storage', 'security groups', 'lifecycle and cost'], 'Select a compute shape for a temporary ML job and plan how to shut it down safely.'],
      ['Databricks and EMR', 'Week 33', 'Use managed platforms to run Spark and Hadoop workloads with less infrastructure management.', ['managed clusters', 'notebooks and jobs', 'autoscaling awareness', 'data access', 'platform tradeoffs'], 'Compare a self-managed cluster with a managed Spark platform for a scheduled ETL workload.'],
      ['Deploying ML Models on Cloud', 'Week 33', 'Connect model artifacts, serving compute, APIs, security, and monitoring in a cloud deployment.', ['artifact storage', 'serving options', 'endpoint security', 'scaling', 'monitoring'], 'Draw a secure inference architecture from client request to model response and logs.'],
      ['Class-Based Big Data Projects', 'Week 34', 'Build guided distributed pipelines and cloud data workflows.', ['PySpark ETL Pipeline', 'Spark MLlib Training', 'Cloud Data Processing Workflow'], 'Deliver job code, data-flow documentation, validation checks, and performance observations.'],
      ['Home-Based Big Data Projects', 'Week 34', 'Apply batch, data-lake, and optional real-time patterns independently.', ['Big Data Batch Processing', 'Cloud Data Lake Setup', 'Optional Real-Time Processing'], 'Define scale assumptions, partitioning, data quality, security, cost, and operational steps.'],
    ],
  },
  {
    folder: '08-generative-ai',
    label: 'Module 08 · Generative AI',
    weeks: 'Weeks 35–38',
    description: 'Understand modern language models and build grounded applications with prompting, adaptation, and retrieval.',
    chapters: [
      ['Transformers', 'Week 35', 'Understand the attention-based architecture behind modern language models.', ['tokens and embeddings', 'self-attention', 'position information', 'transformer blocks', 'parallel sequence processing'], 'Follow how one token gathers information from other tokens through an attention layer.'],
      ['BERT and GPT', 'Week 36', 'Compare encoder-oriented and autoregressive language-model objectives at a conceptual level.', ['encoder models', 'autoregressive generation', 'pretraining objectives', 'bidirectional context', 'task selection'], 'Choose an appropriate model family for classification, extraction, and open-ended generation tasks.'],
      ['Tokenization', 'Week 36', 'Convert text into model-processable units and understand how token choices affect context and cost.', ['tokens', 'subword units', 'vocabulary', 'special tokens', 'context windows'], 'Tokenize examples with unusual words and compare how the representation changes across text.'],
      ['Prompt Engineering', 'Week 37', 'Write clear instructions, context, constraints, and output formats for reliable model behavior.', ['task instructions', 'context', 'examples', 'structured outputs', 'prompt evaluation'], 'Design and test a prompt for extracting structured fields, including ambiguous and missing inputs.'],
      ['Fine-Tuning with LoRA and QLoRA', 'Week 37', 'Adapt a pretrained model efficiently with low-rank techniques and task-specific examples.', ['supervised fine-tuning', 'LoRA adapters', 'quantization', 'QLoRA', 'evaluation and overfitting'], 'Plan a small adaptation experiment with a baseline, held-out examples, and safety review.'],
      ['Retrieval-Augmented Generation', 'Week 37', 'Retrieve relevant evidence and provide it to a language model for grounded answers.', ['document ingestion', 'chunking', 'embeddings', 'retrieval', 'grounded generation and citations'], 'Trace a question through embedding, retrieval, evidence checks, generation, and source display.'],
      ['Vector Databases', 'Week 37', 'Store and search embedding vectors for semantic retrieval with tools such as FAISS or Pinecone.', ['vectors and metadata', 'similarity metrics', 'indexing', 'top-K search', 'filters and retrieval quality'], 'Design vector metadata for book sections and evaluate whether retrieved chunks answer a question.'],
      ['Class-Based Generative AI Projects', 'Week 38', 'Build guided question-answering and RAG applications.', ['ChatGPT-Style Q&A Bot', 'RAG System with a Vector Database'], 'Define scope, protect secrets, evaluate groundedness, and provide usable error and refusal states.'],
      ['Home-Based Generative AI Projects', 'Week 38', 'Build independent model-adaptation or content-generation projects.', ['Domain-Fine-Tuned Q&A Model', 'Text Summarizer or Content Generator'], 'Create an evaluation set, compare against a baseline, inspect failures, and document responsible-use limits.'],
    ],
  },
  {
    folder: '09-agentic-ai',
    label: 'Module 09 · Agentic AI',
    weeks: 'Weeks 39–41',
    description: 'Design AI systems that plan, use tools, retain useful state, and collaborate safely.',
    chapters: [
      ['What Are AI Agents?', 'Week 39', 'Understand agents as systems that observe, decide, act, and evaluate progress toward a goal.', ['goals', 'observations', 'actions', 'feedback loops', 'autonomy boundaries'], 'Map a simple research assistant into observations, decisions, tools, and stop conditions.'],
      ['Tool-Using Agents', 'Week 39', 'Let models call constrained external tools and incorporate their results into a task.', ['tool schemas', 'selection', 'arguments', 'tool results', 'permissions and validation'], 'Design a calculator tool contract and list the checks required before and after execution.'],
      ['Reasoning and Planning', 'Week 40', 'Break complex tasks into steps, revise plans, and determine when work is complete.', ['task decomposition', 'plans', 'state tracking', 'reflection', 'stop conditions'], 'Create a plan-and-execute flow for analyzing a dataset and producing a reviewed report.'],
      ['LangChain Agents', 'Week 40', 'Understand the building blocks used to connect models, tools, prompts, and agent loops with LangChain.', ['model interface', 'tools', 'agent loop', 'state', 'tracing awareness'], 'Sketch a small LangChain-style agent and identify where errors and tool permissions are handled.'],
      ['CrewAI and AutoGen', 'Week 40', 'Explore frameworks for coordinating multiple role-based agents in a workflow.', ['agent roles', 'task delegation', 'handoffs', 'orchestration', 'review loops'], 'Compare a sequential role workflow with a conversational multi-agent workflow.'],
      ['Memory-Enabled Agents', 'Week 40', 'Store and retrieve relevant state without treating all historical information as equally useful.', ['short-term state', 'long-term memory', 'retrieval', 'summarization', 'privacy and deletion'], 'Design memory rules for a personal assistant, including what must never be stored.'],
      ['Multi-Agent Systems', 'Week 41', 'Coordinate specialized agents while controlling communication, shared state, and failure modes.', ['specialization', 'coordination', 'shared artifacts', 'conflict resolution', 'termination'], 'Design researcher, writer, and reviewer roles with explicit inputs, outputs, and approval gates.'],
      ['Class-Based Agentic AI Projects', 'Week 41', 'Build guided systems that analyze data or coordinate specialized roles.', ['Autonomous Data Analyst', 'Researcher + Writer + Reviewer System'], 'Constrain tools, log actions, require review for consequential outputs, and test failure cases.'],
      ['Home-Based Agentic AI Projects', 'Week 41', 'Create independent assistants and reporting automations with safe tool use.', ['Personal AI Assistant with Tools', 'Automated Email and Reporting Agents'], 'Define permissions, confirmations, retry limits, human review, and an audit trail before automation.'],
    ],
  },
  {
    folder: '10-career-skills',
    label: 'Beyond the Curriculum · Career Skills',
    weeks: 'Throughout the course',
    description: 'Turn technical learning into clear communication, a credible portfolio, and professional opportunities.',
    chapters: [
      ['LinkedIn Profile Optimization', 'Career Skills', 'Present your skills, evidence, and learning journey clearly to professional audiences.', ['headline', 'about section', 'project evidence', 'skills', 'responsible networking'], 'Rewrite a profile around outcomes and evidence from course projects.'],
      ['Personal Branding', 'Career Skills', 'Build a consistent and authentic professional identity around your strengths and interests.', ['positioning', 'audience', 'proof of work', 'consistency', 'professional voice'], 'Create a one-sentence positioning statement and align three portfolio items to it.'],
      ['MS Office for Professionals', 'Career Skills', 'Use common office tools to organize information and communicate analysis effectively.', ['documents', 'spreadsheets', 'presentations', 'templates', 'collaboration'], 'Turn a project result into a one-page brief, a calculation sheet, and a short presentation.'],
      ['Google Docs, Slides, and Sheets', 'Career Skills', 'Collaborate on cloud documents, analyses, and presentations with clear sharing practices.', ['sharing permissions', 'comments', 'version history', 'spreadsheet analysis', 'presentations'], 'Create a shared project workspace with appropriate permissions and a review workflow.'],
      ['Canva for Technical Communication', 'Career Skills', 'Create simple visual assets that communicate project findings without distorting the data.', ['layout', 'visual hierarchy', 'brand consistency', 'data graphics', 'export formats'], 'Design one portfolio cover and one findings graphic with readable labels and source attribution.'],
      ['Module Presentations', 'Career Skills', 'Explain technical work through a concise problem–process–result story after each module.', ['audience', 'narrative', 'demonstration', 'evidence', 'questions'], 'Prepare a five-minute module presentation with one live or recorded demonstration.'],
      ['Freelancing Foundations', 'Career Skills', 'Understand how to scope, propose, deliver, and communicate small technical engagements.', ['service definition', 'project scope', 'proposal', 'milestones', 'client communication'], 'Draft a fixed-scope proposal for a data analysis or automation task.'],
      ['Building a Portfolio', 'Career Skills', 'Package course projects so reviewers can understand the problem, decisions, evidence, and result.', ['README files', 'reproducibility', 'screenshots and demos', 'results', 'limitations'], 'Upgrade one course project with setup instructions, an architecture view, results, and lessons learned.'],
    ],
  },
];

const moduleMistakes = {
  '01-python-foundations': ['Ignoring indentation and unclear names', 'Copying code without tracing values', 'Testing only the happy path'],
  '02-python-for-data-science': ['Editing the only copy of raw data', 'Ignoring shapes, indexes, and data types', 'Using a chart that does not match the question'],
  '03-statistics-and-math': ['Reporting a number without context', 'Ignoring method assumptions', 'Treating correlation as proof of causation'],
  '04-machine-learning': ['Allowing test information into training', 'Choosing a model before defining the metric', 'Reporting one score without error analysis'],
  '05-deep-learning': ['Losing track of tensor shapes', 'Training a large model before building a baseline', 'Ignoring overfitting and data quality'],
  '06-mlops': ['Hard-coding secrets or environment details', 'Deploying without health checks and logs', 'Failing to version code, data, and model artifacts'],
  '07-big-data-and-cloud': ['Using distributed tools before defining scale needs', 'Ignoring partitions, permissions, and cost', 'Assuming managed services remove all operational responsibility'],
  '08-generative-ai': ['Trusting fluent output without evaluation', 'Exposing credentials in client code', 'Using retrieval without checking whether evidence supports the answer'],
  '09-agentic-ai': ['Giving tools broader permissions than necessary', 'Running loops without limits or stop conditions', 'Automating consequential actions without review'],
  '10-career-skills': ['Making claims without evidence', 'Using the same message for every audience', 'Hiding limitations instead of explaining what you learned'],
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function yamlString(value) {
  return JSON.stringify(value);
}

function chapterMarkdown(module, chapter, index) {
  const [title, week, description, concepts, activity] = chapter;
  const isProject = /Projects$/.test(title);
  const mistakes = moduleMistakes[module.folder];
  const conceptLines = concepts.map((concept) => `- **${concept}** — connect this idea to the chapter goal and identify when it is useful.`).join('\n');
  const projectLines = concepts.map((concept, itemIndex) => `${itemIndex + 1}. **${concept}:** define the problem, choose appropriate data or tools, build a baseline, test the result, and present limitations.`).join('\n');
  const coreSection = isProject
    ? `## Project options\n\n${projectLines}\n\n## Recommended workflow\n\n1. Write a one-paragraph problem statement and success criteria.\n2. Inspect the data, inputs, constraints, and risks before building.\n3. Create the smallest working baseline.\n4. Improve one decision at a time and record the evidence.\n5. Test realistic and failure cases.\n6. Present the result, limitations, and next improvement.\n\n## Expected deliverables\n\n- A reproducible project with clear setup instructions.\n- A short explanation of the approach and important decisions.\n- Evidence such as tests, metrics, screenshots, or sample outputs.\n- A reflection describing limitations and what you would improve next.`
    : `## Concepts covered\n\n${conceptLines}\n\n## How to study this chapter\n\n1. Begin with the problem this topic solves.\n2. Learn the vocabulary in the context of a small example.\n3. Work through the process by hand or with a tiny dataset.\n4. Implement the smallest useful version.\n5. Change one input and predict the result before running it.\n6. Record what worked, what failed, and why.`;

  return `---
title: ${yamlString(title)}
sidebar_label: ${yamlString(title)}
sidebar_position: ${index + 1}
description: ${yamlString(description)}
tags: [${yamlString(module.label.replace(/^.*· /, ''))}, ${yamlString(week)}]
hide_title: true
---

# ${title}

> **${week} · ${module.label}**

${description}

## Learning objectives

By the end of this chapter, you should be able to:

- explain the purpose of ${title.toLowerCase()} in your own words;
- recognize the main concepts and decisions involved;
- apply the topic in a focused practical activity;
- identify common mistakes and validate your work.

${coreSection}

## Practical activity

${activity}

Before you finish, write down the input, expected output, assumptions, and at least two checks that would reveal an incorrect result.

## Common mistakes

${mistakes.map((mistake) => `- ${mistake}.`).join('\n')}

## Key takeaways

- ${title} belongs to a larger workflow; understand both the technique and where it fits.
- Small, testable examples make assumptions and errors easier to see.
- A trustworthy result includes validation, interpretation, and clearly stated limitations.

## Review questions

1. What problem does ${title.toLowerCase()} help solve?
2. Which concept from this chapter would you explain first to a beginner, and why?
3. What input or assumption could make the result misleading?
4. How would you test your practical activity?
5. Where will this topic connect to a later module or real project?
`;
}

const intro = `---
sidebar_position: 1
slug: /
title: AI & Data Science Learning Path
description: A beginner-to-advanced, project-centered curriculum for AI and data science.
hide_title: true
---

# AI & Data Science Learning Path

Welcome to a **10-month, beginner-to-advanced learning program** covering Python, data analysis, statistics, machine learning, deep learning, MLOps, big data, generative AI, and agentic AI.

No advanced background is required. Basic programming experience is helpful, but the course begins with Python foundations and builds each skill progressively.

## How the book is organized

Every syllabus module appears as a module in the sidebar. Each distinct syllabus topic is a dedicated chapter, while class-based and home-based projects have their own project chapters.

| Module | Schedule | Focus |
| --- | --- | --- |
${modules.map((module, index) => `| ${index + 1}. ${module.label.replace(/^.*· /, '')} | ${module.weeks} | ${module.description} |`).join('\n')}

## How to learn effectively

1. Read the learning objectives before starting a chapter.
2. Recreate examples instead of only reading them.
3. Complete the practical activity and write down assumptions.
4. Answer the review questions without looking back first.
5. Build the module projects and present what you learned.

## Course setup · Week 1

During the opening week, review course expectations and the roadmap, install Python, choose an IDE such as VS Code, and confirm you can run a Python file and a notebook.

~~~bash
python --version
python -m pip --version
~~~

:::tip Start with evidence
Keep every exercise and project in version control. A clear record of experiments, decisions, and improvements becomes part of your professional portfolio.
:::
`;

const roadmap = `---
sidebar_position: 2
title: Course Roadmap
description: The module, week, chapter, and project map for the complete AI and Data Science course.
hide_title: true
---

# Course Roadmap

The curriculum moves from programming fundamentals to production-ready and agentic AI systems. Later modules assume the habits developed earlier: reproducible code, clean data, careful validation, and clear communication.

${modules.map((module, moduleIndex) => `## ${moduleIndex + 1}. ${module.label.replace(/^.*· /, '')} · ${module.weeks}\n\n${module.description}\n\n${module.chapters.map((chapter, chapterIndex) => `${chapterIndex + 1}. [${chapter[0]}](./${module.folder.replace(/^\d+-/, '')}/${slugify(chapter[0])}) — ${chapter[1]}`).join('\n')}`).join('\n\n')}
`;

await mkdir(docsRoot, {recursive: true});
await writeFile(path.join(docsRoot, 'intro.md'), intro, 'utf8');
await writeFile(path.join(docsRoot, 'course-roadmap.md'), roadmap, 'utf8');

for (const [moduleIndex, module] of modules.entries()) {
  const moduleDir = path.join(docsRoot, module.folder);
  await mkdir(moduleDir, {recursive: true});
  const category = {
    label: module.label,
    position: moduleIndex + 10,
    link: {
      type: 'generated-index',
      title: module.label,
      description: `${module.weeks}. ${module.description}`,
      slug: `/${module.folder.replace(/^\d+-/, '')}`,
    },
    collapsible: true,
    collapsed: moduleIndex > 0,
  };
  await writeFile(path.join(moduleDir, '_category_.json'), `${JSON.stringify(category, null, 2)}\n`, 'utf8');

  for (const [chapterIndex, chapter] of module.chapters.entries()) {
    const filename = `${String(chapterIndex + 1).padStart(2, '0')}-${slugify(chapter[0])}.md`;
    await writeFile(path.join(moduleDir, filename), chapterMarkdown(module, chapter, chapterIndex), 'utf8');
  }
}

console.log(`Generated ${modules.reduce((total, module) => total + module.chapters.length, 0)} chapters across ${modules.length} modules.`);
