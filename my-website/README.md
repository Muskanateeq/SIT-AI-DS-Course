# AI & Data Science Academy

A Docusaurus learning book organized from the supplied **AI and Data Science Syllabus**. The site contains 97 chapters across nine technical modules and one supplementary career-skills section.

## Course structure

1. Python Foundations
2. Python for Data Science
3. Statistics and Math for ML
4. Machine Learning
5. Deep Learning
6. MLOps
7. Big Data and Cloud
8. Generative AI
9. Agentic AI
10. Career Skills

Every topic is an individual chapter. Each chapter includes learning objectives, the concepts covered, a study workflow, a practical activity, common mistakes, key takeaways, and review questions. Class-based and home-based projects are kept as dedicated project chapters.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run start
```

The development site opens at `http://localhost:3000` by default.

## Production build

```bash
npm run build
npm run serve
```

The static site is written to `build/`.

## Content source

Book files live under `docs/`. The curriculum manifest and repeatable chapter generator live in `scripts/generate-book.mjs`.

To regenerate all syllabus chapters after updating that manifest:

```bash
node scripts/generate-book.mjs
npm run build
```

The generator rewrites the managed syllabus chapters, module metadata, introduction, and roadmap. Make curriculum changes in the generator so regenerated content remains consistent.
