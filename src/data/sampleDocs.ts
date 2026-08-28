import { DocumentItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-cs-curriculum',
    title: 'School of Computing: Computer Science Admissions & Curriculum Handbook 2025/2026',
    category: 'academic',
    institution: 'Computer Science',
    summary: 'Academic handbook covering Computer Science prerequisites, AI & Algorithms specializations, honors research tracks, capstone engineering, and grade profiles.',
    fileType: 'md',
    pageCount: 6,
    wordCount: 1390,
    charCount: 9320,
    dateAdded: '2025-01-15',
    chunks: [],
    content: `# Faculty of Computing & Information Technology
## Bachelor of Computing (Computer Science) - Academic & Admissions Handbook 2025/2026

### 1. Admissions Requirements & Indicative Grade Profiles (IGP)
Admission to the Bachelor of Computing in Computer Science is highly competitive and merit-based.
- **High School & A-Level Requirements:** Strong passes in Advanced Mathematics or Further Mathematics, and a pass in Advanced Physics, Chemistry, or Computing.
- **Indicative Grade Profile (IGP) 10th percentile:** Top-tier distinction grades (AAA/A with General Paper).
- **Polytechnic & Associate Diploma Applicants:** Relevant computing diplomas with a minimum GPA of 3.85+, with demonstrated strength in discrete mathematics and algorithmic reasoning.
- **International Qualifications:** Outstanding high school results (e.g., International Baccalaureate 40+ points with HL Mathematics Analysis & Approaches, or 4+ Advanced Placement exams with Grade 5).
- **Aptitude-Based Admissions Scheme (ABA):** Outstanding achievements in computing olympiads (NOI, IOI), impactful software engineering portfolios, Kaggle Grandmaster/Master rank, or substantial open-source contributions.

### 2. CS Focus Areas & Specializations
Undergraduates can declare one or two focus areas from specialized tracks:
1. **Artificial Intelligence (AI):** Modules include CS3243 Introduction to AI, CS3244 Machine Learning, CS4248 Natural Language Processing, CS4243 Computer Vision, and CS5242 Deep Learning Neural Networks.
2. **Algorithms & Theory:** Advanced data structures, randomized algorithms, graph theory, and computational complexity (CS3230, CS4231).
3. **Computer Security & Cryptography:** System security, network security, software vulnerability analysis, applied cryptography (CS3235, CS4236).
4. **Database Systems & Big Data:** Large-scale distributed data storage, query optimization, NoSQL architectures (CS3223, CS4224).
5. **Software Engineering:** Object-oriented design, automated testing, agile methods, large software architectures (CS2103T, CS3201/CS3202).
6. **Computer Graphics and Games:** 3D rendering pipelines, ray tracing, animation, physics simulation.
7. **Computer Networks & Distributed Systems:** Cloud computing, peer-to-peer protocols, distributed consensus (CS2105, CS3103).
8. **Robotics:** Kinematics, SLAM (Simultaneous Localization and Mapping), robot control.
9. **Financial Technology (FinTech):** Blockchain architectures, algorithmic trading, smart contracts.
10. **Parallel and Distributed Computing:** GPU acceleration, CUDA, high-performance MPI computing.

### 3. Special Programmes & Fast-Tracks
- **Honors Research Fellowship:** Highly selective honors research track for top-tier students offering 1-on-1 faculty mentorship, accelerated graduate coursework, and peer-reviewed publication requirements.
- **Concurrent Degree Programme (CDP):** B.Comp (CS) + Master of Science in Computer Science (completed in 4.5 to 5 years).
- **Global Technology Internship:** Full-year immersive entrepreneurship internship in Silicon Valley, New York, Shenzhen, or global innovation hubs.

### 4. Capstone & Experiential Learning
- **Independent Software Development Capstone:** Self-directed software engineering project during Year 1/2 summer, categorized into progressive tiers of achievement (Foundational, Intermediate, Advanced, and Production).
- **Industry Internships:** Mandatory 6-month Advanced Technology Attachment Programme or 3-month Summer Internship with leading technology organizations.
- **Final Year Project (FYP):** Independent Honours Research Dissertation or Multi-Disciplinary Industry Capstone.

### 5. Tuition Fees & Financial Subsidies
- Domestic Subsidized Students: ~$8,250 per academic year.
- Permanent Residents (with Tuition Grant): ~$11,550 per academic year.
- International Students (with Service Obligation): ~$17,800 per academic year.
- Non-subsidized tuition fee: ~$39,200 per academic year.`,
  },
  {
    id: 'doc-ai-datascience',
    title: 'College of Computing & AI: Syllabus & Research Laboratory Guide',
    category: 'academic',
    institution: 'AI & Data Science',
    summary: 'Curriculum overview for Artificial Intelligence & Data Science, Deep Learning laboratories, high-performance GPU clusters, and research degree requirements.',
    fileType: 'md',
    pageCount: 5,
    wordCount: 1210,
    charCount: 7980,
    dateAdded: '2025-02-01',
    chunks: [],
    content: `# College of Computing and Data Science
## Bachelor of Science in Artificial Intelligence and Data Science (BSc AI&DS)

### 1. Programme Overview & Vision
The BSc in Artificial Intelligence and Data Science is an interdisciplinary degree engineered to produce AI research engineers and data architects. It integrates rigorous mathematical foundations with modern machine learning systems, statistical modeling, and ethical AI governance.

### 2. Core Curriculum Structure
- **Year 1 Foundations:**
  - SC1003 Introduction to Computational Thinking & Programming (Python & C)
  - MH1810 Mathematics 1 (Multivariable Calculus, Linear Algebra)
  - SC1005 Digital Logic & Computer Organisation
  - MH2802 Linear Algebra & Matrix Analysis
  - SC1007 Data Structures & Algorithms

- **Year 2 Core AI & Data Engineering:**
  - SC2001 Algorithm Design & Analysis
  - SC2002 Object-Oriented Design & Programming
  - SC2006 Software Engineering
  - SC2008 Database Systems (Relational & Vector indexing)
  - SC2000 Probability & Statistics for Data Science
  - SC3000 Artificial Intelligence Foundations (State-space search, Bayesian networks)

- **Year 3 Advanced Machine Learning & Deep Learning:**
  - SC3001 Machine Learning: Theory and Algorithms (SVMs, Ensemble Learning, Gradient Boosting)
  - SC3002 Data Mining & Knowledge Discovery
  - SC4001 Neural Networks & Deep Learning (Transformers, Attention Mechanisms, CNNs, Diffusion)
  - SC4002 Natural Language Processing & Large Language Models (RAG systems, Tokenization, BERT/GPT architectures)
  - SC4003 Computer Vision & Multimodal Perception

- **Year 4 Capstone & Specialization Electives:**
  - Multi-agent Systems & Reinforcement Learning (Q-learning, PPO, Deep RL)
  - AI Ethics, Explainable AI (XAI), and Safety Guardrails
  - SC4999 Final Year Research Project (FYP) or Multidisciplinary Design Project (MDP)

### 3. State-of-the-Art Research Clusters & Labs
- **Center for Augmented Intelligence:** Generative AI, Retrieval-Augmented Generation, and agentic workflows.
- **Cognitive Artificial Intelligence Lab:** Neuro-symbolic computing and brain-inspired machine intelligence.
- **Cyber-Security & Trusted AI Lab:** Adversarial robustness, defense against prompt injection, and model watermarking.
- **Hardware Infrastructure:** High-performance computing cluster powered by NVIDIA H100 and A100 GPU nodes with NVLink interconnects.

### 4. Admission Criteria & Prerequisites
- Minimum prerequisites: Strong pass in Advanced Mathematics / Further Math and Physics or Computing.
- Indicative Grade Profile (IGP): 10th percentile AAA/B, Polytechnic GPA 3.82+.
- Direct entry options for National Olympiad in Informatics medalists.`,
  },
  {
    id: 'doc-information-systems',
    title: 'School of Information Systems: Enterprise Cloud & Analytics Guide 2025/2026',
    category: 'academic',
    institution: 'Information Systems',
    summary: 'Information Systems degree structure, Smart-City Management & Analytics, seminar pedagogy, and corporate consulting capstones.',
    fileType: 'md',
    pageCount: 5,
    wordCount: 1140,
    charCount: 7750,
    dateAdded: '2025-02-10',
    chunks: [],
    content: `# School of Computing and Information Systems
## Bachelor of Science (Information Systems) - Academic Guide

### 1. Distinctive Pedagogy & Business-IT Integration
The Information Systems curriculum bridges deep technological capability with strategic organizational acumen. Classes are conducted in interactive, seminar-style formats (maximum 40-45 students) emphasizing technical presentation, critical debate, collaborative problem-solving, and systems leadership.

### 2. Major Tracks in Bachelor of Science (Information Systems)
Students can select specialized career tracks:
1. **AI & Data Analytics Track:**
   - Text & Sequence Analytics, Big Data Processing, Advanced Machine Learning, Visual Analytics (D3.js, BI platforms).
2. **Digital Cloud Solutions & Enterprise Architecture:**
   - Cloud Native Architectures (AWS/GCP/Azure), Microservices, DevOps, Distributed Ledger Technologies.
3. **Financial Technology (FinTech):**
   - Digital Banking, Payment Systems, Algorithmic Trading, Decentralized Finance (DeFi), Regulatory Technology.
4. **Smart-City Management & Analytics (Interdisciplinary Major):**
   - IoT Sensor Networks, Urban Mobility Modeling, Public Sector Analytics, Spatial Data Analysis.
5. **Cybersecurity & Trust:**
   - Network Defense, Threat Intelligence, Zero-Trust Architecture, Governance & Compliance (ISO 27001).

### 3. Signature Programmes
- **Experiential Consulting Learning:** Students work in multidisciplinary teams on real consulting projects for corporate and public sector clients mentored directly by industry project directors.
- **Guaranteed Global Exposure:** Comprehensive participation in international university exchange programmes, overseas study missions, or global internships.
- **Fast-Track Bachelor + Master Programmes:** Complete both a BSc in Information Systems and an MSc in Computing within 4 to 4.5 years.

### 4. Admissions Criteria & Aptitude Assessment
- Holistic admissions process reviewing high school results, leadership extracurriculars, and personal technical interviews.
- Indicative Grade Profile: AAA/C to AAA/A (A-Levels); Polytechnic GPA ~3.75+.
- Aptitude interview evaluating problem decomposition, ethical reasoning, and entrepreneurial mindset.`,
  },
  {
    id: 'doc-systems-design',
    title: 'Computer Science and Design: Systems Engineering & Capstone Prospectus',
    category: 'academic',
    institution: 'Systems & Design',
    summary: 'CS & Systems Engineering curriculum details, Design Thinking integration, cohort-based active learning, and multi-disciplinary capstones.',
    fileType: 'md',
    pageCount: 5,
    wordCount: 1080,
    charCount: 7290,
    dateAdded: '2025-02-18',
    chunks: [],
    content: `# Department of Computer Science & Systems Engineering
## Computer Science and Design - Degree Programme Prospectus

### 1. The Design-Centric Computing Philosophy
Integrating rigorous computer science foundations with human-centered design thinking, rapid prototyping, and systems engineering. Students do not just write algorithms; they architect end-to-end intelligent physical-digital solutions.

### 2. Four-Year Curriculum Roadmap
- **Freshman Terms (Terms 1 to 3 - Common Foundation):**
  - World by Design, Modelling & Analysis (Calculus & ODEs), Physical World (Physics), Computational Thinking for Design (Python & Algorithms), Science for Sustainable Systems.

- **Computer Science Core Terms (Terms 4 to 6):**
  - 50.001 Introduction to Information Systems & Programming (Java, OOP)
  - 50.002 Computation Structures (Computer Architecture, Digital Circuits, Assembly, FPGA)
  - 50.003 Elements of Software Construction (Formal verification, Design Patterns, Concurrent Systems)
  - 50.004 Algorithms (Dynamic Programming, Graph algorithms, NP-completeness)
  - 50.005 Computer System Engineering (Operating systems, file systems, distributed consensus)

- **Specialization Tracks (Terms 7 to 8):**
  - **Artificial Intelligence & Machine Learning:** Deep Learning, Reinforcement Learning, Natural Language Processing, Computer Vision.
  - **Cybersecurity:** Network security, Cryptography, Reverse engineering, Binary exploitation.
  - **Data Analytics & Visual Computing:** Big data engineering, Spatial analytics, Interactive computer graphics.
  - **Software Engineering & IoT:** Embedded systems, Edge AI, Distributed microservices.

### 3. Industry-Sponsored 2-Term Capstone Project (Terms 7 & 8)
Every graduating senior works in a multi-disciplinary team with engineering peers to solve a complex real-world challenge sponsored by leading enterprise and public sector partners.

### 4. Admissions Criteria & Holistic Assessment
- Students are selected based on mathematical curiosity, passion for innovation, and creative problem-solving capability.
- Requirements: Solid foundation in Advanced Mathematics and Physical Sciences.
- Admissions process includes a hands-on interactive design and coding interview.`,
  },
  {
    id: 'doc-rag-foundational-paper',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al. 2020)',
    category: 'research',
    institution: 'General AI',
    summary: 'The seminal academic research paper defining RAG, Dense Passage Retrieval (DPR), Marginalization over latent documents, and hallucination reduction.',
    fileType: 'md',
    pageCount: 6,
    wordCount: 1350,
    charCount: 8900,
    dateAdded: '2020-05-22',
    chunks: [],
    content: `# Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
## Patrick Lewis, Ethan Perez, Aleksandros Piktus, Fabio Petroni, Vladimir Karpukhin, Barlas Oğuz, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela
### NeurIPS 2020 / Facebook AI Research (FAIR), UCL, NYU

### Abstract & Core Innovation
Large pre-trained language models store factual knowledge in their implicit parameters (parametric memory). However, parametric memory suffers from severe limitations:
1. Inability to precisely expand or revise memory without expensive full re-training.
2. Inability to provide direct provenance and verifiable citations for generated answers.
3. Susceptibility to catastrophic hallucinations and factual confabulations.

To solve this, we introduce **Retrieval-Augmented Generation (RAG)**: a hybrid neural framework combining a pre-trained parametric sequence-to-sequence generator (e.g., BART) with a non-parametric dense retrieval index (Dense Passage Retrieval / DPR) over Wikipedia.

### 1. Mathematical Architecture & Formulations
RAG models use the input query $x$ to retrieve top-$K$ latent document passages $z \in \text{top-}K(p_\eta(\cdot|x))$, and treat the retrieved passages as latent variables conditioned upon by the generator $p_\theta(y_i|x, z, y_{1:i-1})$.

Two distinct formulation variants are proposed:
- **RAG-Sequence Model:** The retriever draws top-$K$ documents, and the generator produces the entire output sequence conditioned on the same document $z$:
  $$p_{\text{RAG-Seq}}(y|x) \approx \sum_{z \in \text{top-}K(p(\cdot|x))} p_\eta(z|x) \prod_{i=1}^N p_\theta(y_i|x, z, y_{1:i-1})$$
- **RAG-Token Model:** The retriever allows different retrieved passages to guide the generation of each subsequent token $y_i$:
  $$p_{\text{RAG-Token}}(y|x) \approx \prod_{i=1}^N \sum_{z \in \text{top-}K(p(\cdot|x))} p_\eta(z|x) p_\theta(y_i|x, z, y_{1:i-1})$$

### 2. Dense Passage Retrieval (DPR) Component
The retriever calculates similarity using dense embeddings generated by dual BERT bi-encoders:
$$p_\eta(z|x) \propto \exp(\mathbf{d}(z)^\top \mathbf{q}(x))$$
where $\mathbf{q}(x) = \text{BERT}_Q(x)$ is a 768-dimensional query representation and $\mathbf{d}(z) = \text{BERT}_D(z)$ is the passage representation. Fast nearest-neighbor lookup is conducted using Inverted File Index with Vector Quantization (FAISS / HNSW).

### 3. Key Findings & Empirical Benchmarks
- On open-domain question answering datasets (Natural Questions, WebQuestions, CuratedTREC), RAG set new state-of-the-art results outperforming pure parametric models (T5-11B) despite having significantly fewer parameters.
- **Factual Accuracy & Hallucination Mitigation:** Human evaluation demonstrated that RAG generates significantly more factual, grounded, and specific responses compared to standard generative language models.
- **Knowledge Updateability:** By simply updating the non-parametric document index without retraining the generator parameters, the system successfully adapts to changing world knowledge instantly.`,
  },
];
