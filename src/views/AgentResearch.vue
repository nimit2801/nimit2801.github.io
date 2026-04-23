<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type ResearchItem = {
  title: string;
  source: string;
  url: string;
  meta?: string;
  why?: string;
  topics?: string[];
  publishedAt?: string;
  score?: number;
};

type SourceSection = {
  key: string;
  label: string;
  items: ResearchItem[];
};

type RawResearchItem = {
  title: string;
  source?: string;
  url: string;
  meta?: string;
  why?: string;
  topics?: string[];
  publishedAt?: string;
  score?: number;
  points?: number;
  date?: string;
  topic?: string;
};

type RawResearchPayload = {
  generatedAt: string;
  windowDays: number;
  summary: string;
  sourceStats: {
    items: number;
    sources: Record<string, number>;
  };
  highlights: RawResearchItem[];
  sourceSections: Record<string, RawResearchItem[]> | SourceSection[];
  tangentRadar: Array<{
    topic?: string;
    theme?: string;
    signalCount?: number;
    whyItMatters: string;
    signals?: string[];
  }>;
  experimentQueue: Array<{
    title?: string;
    name?: string;
    why?: string;
    description?: string;
    prompt?: string;
    topics?: string[];
  }>;
  method: string | string[];
};

type ResearchPayload = {
  generatedAt: string;
  windowDays: number;
  summary: string;
  sourceStats: {
    items: number;
    sources: Record<string, number>;
  };
  highlights: ResearchItem[];
  sourceSections: SourceSection[];
  tangentRadar: Array<{
    topic: string;
    signalCount: number;
    whyItMatters: string;
    signals: string[];
  }>;
  experimentQueue: Array<{
    title: string;
    why: string;
    prompt: string;
  }>;
  method: string[];
};

const payload = ref<ResearchPayload | null>(null);
const loading = ref(true);
const error = ref('');

const sectionLabels: Record<string, string> = {
  majorLabs: 'Major Labs',
  hackerNews: 'Hacker News',
  reddit: 'Reddit',
  huggingFace: 'Hugging Face',
  github: 'GitHub',
};

const sourcesTracked = computed(() => Object.keys(payload.value?.sourceStats.sources ?? {}).length);

const formatDate = (value?: string) => {
  if (!value) return 'Unknown';
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date) + ' UTC';
};

const toIsoDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const buildMeta = (item: RawResearchItem) => {
  if (item.meta) return item.meta;

  const parts: string[] = [];

  if (typeof item.points === 'number' && item.points > 0) {
    parts.push(`${item.points} points`);
  }

  if (item.topic) {
    parts.push(item.topic);
  }

  return parts.join(' · ');
};

const normalizeItem = (item: RawResearchItem, fallbackSource?: string): ResearchItem => ({
  title: item.title,
  source: item.source ?? fallbackSource ?? 'Unknown',
  url: item.url,
  meta: buildMeta(item),
  why: item.why,
  topics: item.topics ?? (item.topic ? [item.topic] : []),
  publishedAt: item.publishedAt ?? toIsoDate(item.date),
  score: item.score,
});

const normalizeSourceSections = (sourceSections: RawResearchPayload['sourceSections']): SourceSection[] => {
  if (Array.isArray(sourceSections)) {
    return sourceSections.map((section) => ({
      ...section,
      items: section.items.map((item) => normalizeItem(item, section.label)),
    }));
  }

  return Object.entries(sourceSections).map(([key, items]) => ({
    key,
    label: sectionLabels[key] ?? key,
    items: items.map((item) => normalizeItem(item, sectionLabels[key] ?? key)),
  }));
};

const normalizePayload = (raw: RawResearchPayload): ResearchPayload => ({
  generatedAt: raw.generatedAt,
  windowDays: raw.windowDays,
  summary: raw.summary,
  sourceStats: raw.sourceStats,
  highlights: raw.highlights.map((item) => normalizeItem(item, item.source)),
  sourceSections: normalizeSourceSections(raw.sourceSections),
  tangentRadar: raw.tangentRadar.map((entry) => ({
    topic: entry.topic ?? entry.theme ?? 'Signal',
    signalCount: entry.signalCount ?? entry.signals?.length ?? 0,
    whyItMatters: entry.whyItMatters,
    signals: entry.signals ?? [],
  })),
  experimentQueue: raw.experimentQueue.map((item) => ({
    title: item.title ?? item.name ?? 'Untitled experiment',
    why: item.why ?? item.description ?? '',
    prompt: item.prompt ?? (item.topics?.length ? `Focus areas: ${item.topics.join(', ')}` : 'Explore this signal in the next cycle.'),
  })),
  method: Array.isArray(raw.method) ? raw.method : [raw.method],
});

const loadResearch = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('/data/agent-research.json', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to load research data (${response.status})`);
    }

    const rawPayload = (await response.json()) as RawResearchPayload;
    payload.value = normalizePayload(rawPayload);
  } catch (err) {
    console.error(err);
    error.value = 'The research feed is not available yet. Run the generator or let the 4-hour automation update it.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  document.title = 'Agent Research | Nimit Savant';
  loadResearch();
});
</script>

<template>
  <div class="agent-research-page">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Fresh every 4 hours</p>
        <h1>Agent Research</h1>
        <p class="lede">
          A living digest of what people are doing with Agentic AI right now, from model drops to practical workflows to strange but useful tangents.
        </p>

        <div v-if="loading" class="status-card">Loading research snapshot...</div>
        <div v-else-if="error" class="status-card error-card">{{ error }}</div>

        <div v-else class="meta-grid">
          <article class="meta-card">
            <span class="meta-label">Last updated</span>
            <strong>{{ formatDate(payload?.generatedAt) }}</strong>
          </article>
          <article class="meta-card">
            <span class="meta-label">Research window</span>
            <strong>{{ payload?.windowDays }} days</strong>
          </article>
          <article class="meta-card">
            <span class="meta-label">Signals tracked</span>
            <strong>{{ payload?.sourceStats.items ?? 0 }}</strong>
          </article>
          <article class="meta-card">
            <span class="meta-label">Sources watched</span>
            <strong>{{ sourcesTracked }}</strong>
          </article>
        </div>
      </div>

      <aside v-if="payload" class="hero-panel">
        <p class="panel-kicker">GURU lens</p>
        <ul>
          <li v-for="item in payload.tangentRadar.slice(0, 4)" :key="item.topic">
            <strong>{{ item.topic }}:</strong> {{ item.whyItMatters }}
          </li>
        </ul>
      </aside>
    </section>

    <template v-if="payload">
      <section class="section summary-section">
        <p class="section-kicker">Snapshot</p>
        <h2>What the current cycle is saying</h2>
        <p class="summary-copy">{{ payload.summary }}</p>
      </section>

      <section class="section">
        <p class="section-kicker">Highlights</p>
        <h2>Best signals across the feed</h2>
        <div class="card-grid">
          <article v-for="item in payload.highlights" :key="item.url" class="highlight-card">
            <div class="card-title">
              <h3>{{ item.title }}</h3>
              <span class="badge">{{ item.source }}</span>
            </div>
            <div class="card-meta">
              <span>{{ item.meta }}</span>
              <span>{{ formatDate(item.publishedAt) }}</span>
            </div>
            <p class="card-why">{{ item.why }}</p>
            <div v-if="item.topics?.length" class="topic-row">
              <span v-for="topic in item.topics" :key="topic" class="topic-tag">{{ topic }}</span>
            </div>
            <a :href="item.url" target="_blank" rel="noopener noreferrer" class="card-url">{{ item.url }}</a>
          </article>
        </div>
      </section>

      <section class="section">
        <p class="section-kicker">Source watch</p>
        <h2>Where the signal came from</h2>
        <div class="stack">
          <article v-for="section in payload.sourceSections" :key="section.key" class="source-card">
            <div class="source-card-header">
              <div>
                <h3>{{ section.label }}</h3>
                <p>{{ section.items.length }} items in this cycle</p>
              </div>
            </div>

            <div v-if="section.items.length" class="source-items">
              <div v-for="item in section.items" :key="item.url" class="source-item">
                <h4>
                  <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
                </h4>
                <p>{{ item.meta }} · {{ formatDate(item.publishedAt) }}</p>
                <p>{{ item.why }}</p>
                <div v-if="item.topics?.length" class="topic-row">
                  <span v-for="topic in item.topics" :key="`${item.url}-${topic}`" class="topic-tag">{{ topic }}</span>
                </div>
              </div>
            </div>

            <p v-else class="empty-state">No strong items landed here in this cycle.</p>
          </article>
        </div>
      </section>

      <section class="two-up">
        <div class="section-card">
          <p class="section-kicker">Tangent radar</p>
          <h2>What to keep an eye on next</h2>
          <div class="stack">
            <article v-for="entry in payload.tangentRadar" :key="entry.topic" class="tangent-card">
              <div class="card-title">
                <h3>{{ entry.topic }}</h3>
                <span class="badge">{{ entry.signalCount }} signals</span>
              </div>
              <p>{{ entry.whyItMatters }}</p>
              <ul>
                <li v-for="signal in entry.signals" :key="signal">{{ signal }}</li>
              </ul>
            </article>
          </div>
        </div>

        <div class="section-card">
          <p class="section-kicker">Experiment queue</p>
          <h2>Good next moves for the GURU brain</h2>
          <div class="stack">
            <article v-for="item in payload.experimentQueue" :key="item.title" class="experiment-card">
              <h3>{{ item.title }}</h3>
              <p>{{ item.why }}</p>
              <p class="prompt">Try this: {{ item.prompt }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section method-section">
        <p class="section-kicker">Method</p>
        <h2>How the feed is built</h2>
        <ul class="method-list">
          <li v-for="step in payload.method" :key="step">{{ step }}</li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.agent-research-page {
  width: min(1240px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 12px 0 56px;
}

.hero,
.section,
.section-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: rgba(18, 21, 31, 0.72);
  backdrop-filter: blur(14px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
}

.hero {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 20px;
  padding: 28px;
  margin-bottom: 20px;
}

.hero-copy h1,
.section h2,
.section-card h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 1;
}

.lede {
  max-width: 70ch;
  color: rgba(240, 235, 206, 0.76);
  line-height: 1.7;
  margin: 14px 0 0;
}

.eyebrow,
.section-kicker,
.panel-kicker,
.meta-label {
  margin: 0 0 10px;
  color: #8fd3ff;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.meta-card,
.status-card {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.meta-card strong {
  display: block;
  font-size: 1.1rem;
}

.status-card {
  margin-top: 20px;
}

.error-card {
  border-color: rgba(255, 125, 163, 0.25);
  background: rgba(255, 125, 163, 0.08);
}

.hero-panel {
  padding: 20px;
}

.hero-panel ul {
  margin: 0;
  padding-left: 18px;
  color: rgba(240, 235, 206, 0.82);
  line-height: 1.7;
}

.section {
  padding: 24px 28px;
  margin-bottom: 20px;
}

.summary-section {
  background: linear-gradient(180deg, rgba(24, 30, 44, 0.82), rgba(17, 20, 30, 0.72));
}

.summary-copy {
  margin: 12px 0 0;
  max-width: 85ch;
  color: rgba(240, 235, 206, 0.85);
  line-height: 1.75;
  font-size: 1.05rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.highlight-card,
.source-card,
.tangent-card,
.experiment-card {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.card-title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.card-title h3,
.source-item h4,
.experiment-card h3,
.tangent-card h3 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.35;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(143, 211, 255, 0.12);
  border: 1px solid rgba(143, 211, 255, 0.25);
  color: #8fd3ff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  white-space: nowrap;
}

.card-meta,
.source-item p,
.experiment-card p,
.tangent-card p,
.empty-state,
.method-list {
  color: rgba(240, 235, 206, 0.7);
  line-height: 1.7;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.card-meta span {
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.card-why {
  margin: 12px 0 0;
  color: rgba(240, 235, 206, 0.84);
  line-height: 1.7;
}

.topic-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.topic-tag {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(143, 211, 255, 0.08);
  border: 1px solid rgba(143, 211, 255, 0.16);
  color: #d8efff;
  font-size: 0.75rem;
}

.card-url {
  display: inline-block;
  margin-top: 12px;
  color: #8fd3ff;
  word-break: break-word;
}

.stack {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.source-card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.source-card-header p {
  margin: 0;
  color: rgba(240, 235, 206, 0.7);
}

.source-items {
  display: grid;
  gap: 14px;
}

.source-item {
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.source-item:first-child {
  border-top: 0;
  padding-top: 0;
}

.source-item a {
  color: #f0ebce;
}

.two-up {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.section-card {
  padding: 24px 28px;
}

.tangent-card ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: rgba(240, 235, 206, 0.72);
  line-height: 1.7;
}

.prompt {
  color: #d8efff;
}

.method-list {
  margin: 14px 0 0;
  padding-left: 18px;
}

.method-list li + li {
  margin-top: 10px;
}

@media (max-width: 960px) {
  .hero,
  .two-up,
  .card-grid,
  .meta-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .agent-research-page {
    width: min(100vw - 18px, 1240px);
  }

  .hero,
  .section,
  .section-card {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
