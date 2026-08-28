import { AdmissionsTopic } from '../types';

export const ADMISSIONS_DEFENSE_DATA: AdmissionsTopic[] = [
  {
    id: 'cs-rag-vs-finetuning',
    university: 'Computer Science',
    category: 'System Architecture',
    difficulty: 'Fundamental',
    question: 'Why implement RAG (Retrieval-Augmented Generation) instead of fine-tuning an LLM on specialized technical papers and dynamic documentation?',
    academicSignificance: 'Formulates the formal boundary between parametric memory (model weights) vs non-parametric memory (external vector index), addressing computational retraining costs, catastrophic forgetting, and real-time knowledge base updates.',
    answer: `1. **Zero Hallucination with Verifiable Grounding:** Fine-tuning modifies internal statistical weights, but models can still confabulate non-existent equations, hyperparameters, or paper citations. RAG provides exact verbatim document provenance with source chunk indices and character offsets.
2. **Instant Non-Parametric Updates:** When research papers, API documentations, or technical specifications are updated or newly published, RAG updates the vector index in milliseconds via incremental embedding. Fine-tuning requires multi-epoch retraining, expensive GPU clusters, and carries high risk of catastrophic forgetting of pre-trained capabilities.
3. **Data Privacy & Access Control:** RAG allows document-level Access Control Lists (ACLs) and partition filtering. A user or process only retrieves chunks they have authorization to view, whereas fine-tuned weights inherently leak private training tokens.
4. **Cost Efficiency:** Fine-tuning 7B–70B parameter models requires dedicated multi-node GPU clusters ($\\mathcal{O}(\\text{Epochs} \\times \\text{Params} \\times \\text{Batch})$). RAG operates on lightweight embedding models and sub-linear ANN vector indexes ($\\mathcal{O}(\\text{IndexSize} \\times d)$).`,
    keyTakeaways: [
      'Parametric (weights) vs Non-Parametric (external vector index)',
      'Catastrophic forgetting avoidance',
      'Millisecond real-time index updates vs expensive retraining epochs',
      'Direct provenance & inline citations',
    ],
    formula: '\\text{Cost}_{\\text{RAG}} = \\mathcal{O}(\\text{IndexSize} \\times d) \\ll \\text{Cost}_{\\text{FineTune}} = \\mathcal{O}(\\text{Epochs} \\times \\text{Params} \\times \\text{Batch})',
  },
  {
    id: 'ai-chunking-tradeoffs',
    university: 'AI & Data Science',
    category: 'Vector Math & Retrieval',
    difficulty: 'Intermediate',
    question: 'What is the mathematical and semantic trade-off between small chunks (100–300 chars) vs large chunks (1500–3000 chars)? How does sliding window overlap mitigate boundary clipping?',
    academicSignificance: 'Analyzes information retrieval trade-offs: semantic signal-to-noise ratio vs context dilution, and transformer embedding pooling effects across sliding text windows.',
    answer: `• **Small Chunks (100–300 chars):**
  - *Pros:* High semantic specificity; dense vector embedding is tightly focused on atomic concepts; minimizes irrelevant noise.
  - *Cons:* Destroys cross-sentence discourse context; misses multi-sentence co-references (e.g., *"the aforementioned scaling factor $\\frac{1}{\\sqrt{d_k}}$"* or *"the covariance matrix $\\Sigma$ defined above"*).
• **Large Chunks (1500–3000 chars):**
  - *Pros:* Complete mathematical derivations, multi-step proofs, and broad context are preserved together.
  - *Cons:* "Embedding Averaging Effect" (mean pooling over 512+ tokens dilutes specific technical terms and variables); exhausts LLM context window tokens; increases generation latency.
• **Role of Sliding Window Overlap (e.g., 15–20%):**
  - Prevents critical formulas, function declarations, and definitions from being bisected across adjacent chunk boundaries.
  - Preserves continuous n-gram overlap and semantic coherence for transformer bi-encoder representations.`,
    keyTakeaways: [
      'Goldilocks zone: 400-800 characters with 15-20% sliding window overlap',
      'Recursive character splitting prioritizing double newlines (paragraphs) over single newlines, then words',
      'Prevents loss of mathematical terms and named entities at boundary splits',
    ],
    formula: '\\text{Overlap Ratio} = \\frac{\\text{Chunk Overlap}}{\\text{Chunk Size}} \\in [0.10, 0.25]',
  },
  {
    id: 'is-hybrid-search',
    university: 'Information Systems',
    category: 'Vector Math & Retrieval',
    difficulty: 'Advanced',
    question: 'Why is pure Dense Vector Search (Cosine Similarity) insufficient for technical literature, and how does Hybrid Search (Dense + BM25) solve this?',
    academicSignificance: 'Addresses structural limitations of bi-encoder dense embeddings when processing exact alphanumeric identifiers, mathematical symbols, hyperparameters (\\beta_1, \\beta_2), and out-of-vocabulary acronyms.',
    answer: `Dense bi-encoders map semantic concepts into continuous vector space (e.g., mapping "gradient optimization" close to "learning rate schedule").
However, pure dense vector retrieval struggles with:
1. **Exact Alphanumeric & Code Identifiers:** Parameter names (\`d_model=512\`, \`\\beta_1=0.9\`), model acronyms (\`IVF-PQ\`, \`HNSW\`, \`DPR\`, \`FAISS\`), or specific paper citations.
2. **Mathematical Variable Notation:** Distinguishing similar mathematical symbols (e.g., $QW_i^Q$ vs $KW_i^K$, or $\\mathcal{L}_{\\text{CE}}$ vs $\\mathcal{L}_{\\text{MSE}}$) where cosine embeddings may project all loss formulas closely together.

**The Hybrid Search Solution (Dense + Sparse Fusion):**
We combine sparse lexical matching (BM25 term frequency with document length penalization) and dense semantic embeddings using **Reciprocal Rank Fusion (RRF)**:
$$\\text{RRF}(d) = \\sum_{m \\in \\{\\text{Dense}, \\text{BM25}\\}} \\frac{1}{k + r_m(d)}$$
where $k \\approx 60$ ensures robust rank aggregation without needing to calibrate disparate score distributions.`,
    keyTakeaways: [
      'Dense search excels at conceptual/synonym matching',
      'Sparse BM25 excels at exact keyword and alphanumeric code matching',
      'Reciprocal Rank Fusion (RRF) combines ranked lists without needing normalized score calibration',
    ],
    formula: '\\text{RRF}(d) = \\sum_{m \\in \\{\\text{Dense}, \\text{BM25}\\}} \\frac{1}{k + r_m(d)}',
  },
  {
    id: 'sys-hallucination-defense',
    university: 'Systems & Design',
    category: 'Hallucination & Guardrails',
    difficulty: 'Intermediate',
    question: 'How does your RAG system prevent hallucination and enforce verifiable provenance down to exact source chunks?',
    academicSignificance: 'Establishes robust system boundary controls, verifiable provenance mapping, negative constraint prompts, and deterministic generation parameters.',
    answer: `1. **Strict Zero-Knowledge System Prompt Grounding:** The LLM is instructed: *"If the retrieved excerpts do not explicitly contain the necessary information, state clearly that the provided documents do not contain the answer. Do not extrapolate or fabricate equations."*
2. **Mandatory In-line Citation Attribution:** The model must generate citations \`[Source X, Chunk #Y]\` for every factual claim. If a claim lacks an attribution tag, a post-processor flags it as ungrounded.
3. **Automated Verification Loop (Ragas Faithfulness):** A secondary verification pass decomposes generated answers into atomic factual claims and verifies whether each claim is logically entailed by the retrieved chunks.
4. **Deterministic Generation Parameters:** Temperature set to $0.0 - 0.2$ to minimize stochastic divergence on mathematical derivations and factual statements.`,
    keyTakeaways: [
      'Negative constraint prompting ("Admit when context is missing")',
      'Structured citation brackets with character offset mapping',
      'Atomic claim decomposition and entailment scoring (Faithfulness score)',
      'Deterministic temperature settings',
    ],
  },
  {
    id: 'general-vector-math',
    university: 'Computer Science',
    category: 'Vector Math & Retrieval',
    difficulty: 'Advanced',
    question: 'Explain the mathematical formulation of Cosine Similarity vs Euclidean Distance (L2) vs Dot Product. Why is Cosine Similarity preferred in text embeddings?',
    academicSignificance: 'Provides the foundational linear algebra derivation of inner products, L2 norms, high-dimensional angles, and the geometry of the unit hypersphere S^(d-1).',
    answer: `Given two $d$-dimensional embedding vectors $\\mathbf{u}$ and $\\mathbf{v}$:
1. **Dot Product:** $\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^d u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos(\\theta)$
2. **Cosine Similarity:** $\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2}$
3. **Euclidean (L2) Distance:** $d_2(\\mathbf{u}, \\mathbf{v}) = \\sqrt{\\sum_{i=1}^d (u_i - v_i)^2}$

**Why Cosine Similarity is preferred:**
Cosine similarity measures the **angle** (directional orientation) between vectors, completely invariant to the vector's magnitude (length).
In text retrieval, document length varies significantly. If a chunk is longer, its raw unnormalized frequency counts grow, inflating its L2 magnitude. Cosine similarity standardizes all representations onto the unit hypersphere $\\mathbb{S}^{d-1}$.

When vectors are L2-normalized ($\\|\\mathbf{u}\\|_2 = \\|\\mathbf{v}\\|_2 = 1$):
$$\\text{Cosine}(\\mathbf{u}, \\mathbf{v}) = \\mathbf{u} \\cdot \\mathbf{v} = 1 - \\frac{1}{2} d_2^2(\\mathbf{u}, \\mathbf{v})$$
Thus, normalized dot product, cosine similarity, and L2 distance become mathematically monotonic!`,
    keyTakeaways: [
      'Cosine similarity isolates angle from document length magnitude',
      'L2 normalization converts Cosine Similarity into a pure Dot Product (BLAS matrix multiplication is ultra fast)',
      'Maps embeddings to the unit hypersphere',
    ],
    formula: '\\cos(\\theta) = \\frac{\\sum_{i=1}^d A_i B_i}{\\sqrt{\\sum_{i=1}^d A_i^2} \\sqrt{\\sum_{i=1}^d B_i^2}}',
  },
  {
    id: 'ai-scalability-vector-db',
    university: 'AI & Data Science',
    category: 'Engineering & Scalability',
    difficulty: 'System Design',
    question: 'How do you scale RAG from 1,000 document passages to 10,000,000 passages without linear scan latency $\\mathcal{O}(N \\times d)$?',
    academicSignificance: 'Explores algorithmic indexing for large-scale information retrieval: Approximate Nearest Neighbor (ANN), HNSW graph indexing, and Vector Quantization (IVF-PQ).',
    answer: `A naive exact k-NN linear scan takes $\\mathcal{O}(N \\times d)$ time, which becomes unacceptable at 10M vectors ($>500\\text{ms}$).
To achieve sub-10ms latency, we use **Approximate Nearest Neighbor (ANN)** indexing algorithms:
1. **HNSW (Hierarchical Navigable Small World):** Multi-layer graph architecture inspired by skip lists. Top layers have long-range links for fast coarse navigation; bottom layer contains dense local clusters. Query complexity: $\\mathcal{O}(\\log N)$.
2. **IVF (Inverted File Index):** Clusters vectors into $K$ centroids using k-means. At query time, only the closest $n_{\\text{probe}}$ clusters are inspected.
3. **Product Quantization (PQ):** Compresses high-dimensional 32-bit floats into compact 8-bit byte codes, fitting billions of vectors into RAM.`,
    keyTakeaways: [
      'Exact k-NN is O(N) vs HNSW logarithmic graph traversal O(log N)',
      'Memory reduction with Inverted File Index (IVF) and Product Quantization (PQ)',
      'Trade-off: 95-98% recall rate with 50x speedup',
    ],
  },
  {
    id: 'is-evaluating-rag',
    university: 'Information Systems',
    category: 'System Architecture',
    difficulty: 'Intermediate',
    question: 'How do you scientifically evaluate a RAG system without relying on subjective human "vibe checks"? What is the RAG Triad / RAGAS framework?',
    academicSignificance: 'Introduces quantitative benchmarks and empirical methodologies for evaluating component-level and end-to-end information retrieval accuracy.',
    answer: `The **RAG Triad** evaluates the three critical failure modes of RAG independently:
1. **Context Relevance (Retriever Quality):** Is the retrieved context actually relevant to the user query? Measures noise ratio.
   $$\\text{Context Relevance} = \\frac{|\\text{Relevant Retrieved Sentences}|}{|\\text{Total Retrieved Sentences}|}$$
2. **Groundedness / Faithfulness (Generator Quality):** Is every atomic claim in the LLM answer mathematically entailed by the retrieved context? (Mitigates hallucinations).
   $$\\text{Faithfulness} = \\frac{|\\text{Context-Supported Claims in Answer}|}{|\\text{Total Claims in Answer}|}$$
3. **Answer Relevance (End-to-End Task):** Does the synthesized answer actually answer what the user asked, without extraneous tangents?
   $$\\text{Answer Relevance} = \\text{Cosine}(\\text{Embed}(\\text{Generated Answer}), \\text{Embed}(\\text{Synthetic Questions}))$$`,
    keyTakeaways: [
      'RAGAS: Retrieval Augmented Generation Assessment',
      'The RAG Triad: Context Relevance, Groundedness (Faithfulness), Answer Relevance',
      'Automated synthetic test dataset generation with LLM-as-a-judge',
    ],
  },
  {
    id: 'general-lost-in-middle',
    university: 'General',
    category: 'System Architecture',
    difficulty: 'Advanced',
    question: 'What is the "Lost in the Middle" phenomenon (Liu et al. 2023) in LLM context windows, and how does your RAG re-ranker mitigate it?',
    academicSignificance: 'Explores empirical findings on Transformer self-attention positional degradation across multi-thousand token contexts and mitigation via re-ranking.',
    answer: `LLMs with self-attention mechanisms exhibit a **U-shaped performance curve** regarding information retrieval in long contexts:
• Models perform best when key relevant facts are placed at the **very beginning** (primacy bias) or at the **very end** (recency bias) of the input context prompt.
• When relevant information is stuffed in the **middle 40-70%** of a large context prompt, retrieval accuracy plummets by up to 30-50%.

**RAG Mitigations:**
1. **Re-ordering / Context Re-ranking:** Place top rank #1 and #2 chunks at the start and end of the formatted prompt, placing lower-confidence chunks in the middle.
2. **Top-K Tightening:** Keep $K=3-5$ high-precision chunks rather than stuffing 20 mediocre chunks.`,
    keyTakeaways: [
      'U-shaped retrieval curve in Transformer self-attention heads',
      'Primacy & Recency attention bias',
      'Optimal chunk positioning: Highest cosine relevance placed at outer edges of context prompt',
    ],
  },
];
