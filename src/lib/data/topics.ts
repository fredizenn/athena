import type { TopicMeta } from '$lib/types';

export const TOPIC_GROUPS = [
	'Foundations',
	'Python & Tooling',
	'Classical ML',
	'Deep Learning & AI',
	'MLOps & Deployment',
	'Interviews & Ethics'
] as const;

export const TOPICS: TopicMeta[] = [
	{
		slug: 'statistics',
		name: 'Statistics',
		group: 'Foundations',
		description: 'Descriptive stats, hypothesis testing, confidence intervals, sampling.',
		icon: 'bar-chart-3',
		color: 'violet'
	},
	{
		slug: 'probability',
		name: 'Probability & Distributions',
		group: 'Foundations',
		description: "Bayes' theorem, random variables, common distributions.",
		icon: 'dice-5',
		color: 'violet'
	},
	{
		slug: 'linear-algebra',
		name: 'Linear Algebra',
		group: 'Foundations',
		description: 'Vectors, matrices, eigenvalues, SVD — the language of ML.',
		icon: 'grid-3x3',
		color: 'violet'
	},
	{
		slug: 'calculus',
		name: 'Calculus & Optimization',
		group: 'Foundations',
		description: 'Gradients, chain rule, partial derivatives, gradient descent.',
		icon: 'trending-up',
		color: 'violet'
	},
	{
		slug: 'python-numpy-pandas',
		name: 'Python, NumPy & Pandas',
		group: 'Python & Tooling',
		description: 'The practical toolkit every ML engineer uses daily.',
		icon: 'terminal',
		color: 'cyan'
	},
	{
		slug: 'feature-engineering',
		name: 'Feature Engineering & Data Cleaning',
		group: 'Python & Tooling',
		description: 'Turning messy raw data into model-ready signal.',
		icon: 'wand-2',
		color: 'cyan'
	},
	{
		slug: 'model-evaluation',
		name: 'Model Evaluation & Validation',
		group: 'Classical ML',
		description: 'Metrics, cross-validation, bias-variance, overfitting.',
		icon: 'gauge',
		color: 'amber'
	},
	{
		slug: 'regression',
		name: 'Regression',
		group: 'Classical ML',
		description: 'Linear, polynomial, and regularized regression.',
		icon: 'line-chart',
		color: 'amber'
	},
	{
		slug: 'classification',
		name: 'Classification',
		group: 'Classical ML',
		description: 'Logistic regression, decision boundaries, class imbalance.',
		icon: 'split',
		color: 'amber'
	},
	{
		slug: 'trees-ensembles',
		name: 'Trees, Random Forest & Boosting',
		group: 'Classical ML',
		description: 'Decision trees, bagging, XGBoost, LightGBM, CatBoost.',
		icon: 'git-branch',
		color: 'amber'
	},
	{
		slug: 'svm-knn-bayes',
		name: 'SVM, KNN & Naive Bayes',
		group: 'Classical ML',
		description: 'Margin-based, distance-based, and probabilistic classifiers.',
		icon: 'shapes',
		color: 'amber'
	},
	{
		slug: 'clustering-dimred',
		name: 'Clustering & Dimensionality Reduction',
		group: 'Classical ML',
		description: 'K-means, hierarchical clustering, PCA, t-SNE, UMAP.',
		icon: 'scatter-chart',
		color: 'amber'
	},
	{
		slug: 'neural-networks',
		name: 'Neural Networks & Deep Learning',
		group: 'Deep Learning & AI',
		description: 'Perceptrons, backprop, activation functions, training dynamics.',
		icon: 'brain-circuit',
		color: 'coral'
	},
	{
		slug: 'cnn-rnn',
		name: 'CNNs, RNNs & LSTMs',
		group: 'Deep Learning & AI',
		description: 'Convolutions, sequence models, and memory gates.',
		icon: 'layers',
		color: 'coral'
	},
	{
		slug: 'transformers-attention',
		name: 'Attention & Transformers',
		group: 'Deep Learning & AI',
		description: 'Self-attention, positional encoding, the architecture behind LLMs.',
		icon: 'network',
		color: 'coral'
	},
	{
		slug: 'llms-genai',
		name: 'LLMs & Generative AI',
		group: 'Deep Learning & AI',
		description: 'GPT-style models, diffusion models, generation strategies.',
		icon: 'sparkles',
		color: 'coral'
	},
	{
		slug: 'prompt-engineering',
		name: 'Prompt Engineering',
		group: 'Deep Learning & AI',
		description: 'Getting reliable behavior out of instruction-tuned models.',
		icon: 'message-square-code',
		color: 'coral'
	},
	{
		slug: 'embeddings-rag',
		name: 'Embeddings, Vector DBs & RAG',
		group: 'Deep Learning & AI',
		description: 'Semantic search, retrieval-augmented generation.',
		icon: 'search-code',
		color: 'coral'
	},
	{
		slug: 'fine-tuning',
		name: 'Fine-Tuning, LoRA & RLHF',
		group: 'Deep Learning & AI',
		description: 'Adapting pretrained models efficiently and safely.',
		icon: 'sliders-horizontal',
		color: 'coral'
	},
	{
		slug: 'mlops-deployment',
		name: 'MLOps & Deployment',
		group: 'MLOps & Deployment',
		description: 'Docker, FastAPI, MLflow, monitoring, CI/CD for ML.',
		icon: 'server-cog',
		color: 'cyan'
	},
	{
		slug: 'interview-practice',
		name: 'Interview Questions & Real-World ML',
		group: 'Interviews & Ethics',
		description: 'FAANG-style questions and how ML is applied in production.',
		icon: 'briefcase',
		color: 'violet'
	},
	{
		slug: 'ethics-responsible-ai',
		name: 'Ethics & Responsible AI',
		group: 'Interviews & Ethics',
		description: 'Bias, fairness, explainability, privacy, and security.',
		icon: 'scale',
		color: 'violet'
	}
];

export function getTopic(slug: string): TopicMeta | undefined {
	return TOPICS.find((t) => t.slug === slug);
}
