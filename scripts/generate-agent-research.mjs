import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'public', 'data', 'agent-research.json');

const NOW = new Date();
const SINCE = new Date(NOW.getTime() - 7 * 24 * 60 * 60 * 1000);
const HN_QUERIES = ['agentic ai', 'llm agents', 'mcp', 'computer use', 'openai anthropic qwen'];
const REDDIT_SUBREDDITS = ['LocalLLaMA', 'MachineLearning', 'ArtificialInteligence', 'OpenAI', 'ClaudeAI'];
const REDDIT_QUERIES = ['agentic ai', 'mcp', 'qwen', 'claude', 'openai', 'computer use'];
const HF_QUERIES = ['agent', 'qwen', 'claude', 'openai'];
const LAB_FEEDS = [
  ['OpenAI', 'https://openai.com/news/rss.xml'],
  ['Anthropic', 'https://www.anthropic.com/news/rss.xml'],
  ['Google AI', 'https://blog.google/technology/ai/rss/'],
];
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36';
const REDDIT_AGENT = 'NimitAgentResearch/1.0 (by nimit2801)';

const TOPIC_RULES = [
  ['MCP', ['mcp', 'model context protocol']],
  ['Browser agents', ['browser', 'web automation', 'computer use']],
  ['Tool use', ['tool use', 'function calling', 'tool calling', 'tools']],
  ['Multi-agent workflows', ['multi-agent', 'orchestr', 'planner', 'workflow', 'autonom']],
  ['Memory and state', ['memory', 'checkpoint', 'scratchpad', 'state']],
  ['Evaluation', ['eval', 'benchmark', 'leaderboard', 'arena']],
  ['Voice and multimodal', ['voice', 'audio', 'video', 'multimodal']],
  ['Open weights', ['qwen', 'llama', 'mistral', 'open weight', 'local']],
  ['Major labs', ['openai', 'anthropic', 'qwen', 'deepmind', 'google']],
  ['Coding agents', ['coding', 'code', 'terminal', 'cli', 'dev']],
];

const displaySource = (source) => {
  if (source.startsWith('r/')) return 'Reddit';
  if (['OpenAI', 'Anthropic', 'Google AI'].includes(source)) return 'Major labs';
  return source;
};

const cleanText = (value) => String(value ?? '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const clamp = (text, limit = 180) => {
  const value = cleanText(text);
  return value.length <= limit ? value : `${value.slice(0, limit - 1).trimEnd()}…`;
};

const utcIso = (date) => new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');

const topicsFor = (...parts) => {
  const haystack = parts.map((part) => cleanText(part).toLowerCase()).join(' ');
  const topics = [];
  for (const [label, needles] of TOPIC_RULES) {
    if (needles.some((needle) => haystack.includes(needle))) topics.push(label);
  }
  return [...new Set(topics)].slice(0, 4);
};

const insightForTopics = (topics, source) => {
  const topicSet = new Set(topics);
  if (topicSet.has('MCP')) return 'Standardized tool surfaces keep showing up as the connective tissue for agentic systems.';
  if (topicSet.has('Browser agents')) return 'Browser and computer-use loops are still where the most visible agent demos live.';
  if (topicSet.has('Open weights')) return 'Open-weight releases keep lowering the cost of trying agent loops locally.';
  if (topicSet.has('Evaluation')) return 'People are still searching for reliable ways to measure agent quality, not just vibes.';
  if (topicSet.has('Multi-agent workflows')) return 'The field keeps circling back to orchestration, planning, and tighter loops between steps.';
  if (topicSet.has('Major labs')) return 'The big labs still set the tone when they ship model or platform changes.';
  if (source === 'Reddit') return 'Builders are trading practical tips, bugs, and small wins in public.';
  return 'This is a useful signal for how people are actually building with agents right now.';
};

const scoreHn = (item) => {
  const points = Number(item.points ?? 0);
  const comments = Number(item.num_comments ?? 0);
  const created = new Date((item.created_at_i ?? 0) * 1000);
  const ageHours = Math.max((NOW.getTime() - created.getTime()) / 36e5, 1);
  const recency = Math.max(0, 72 - ageHours) / 72;
  return points * 2 + comments * 3 + recency * 25;
};

const scoreReddit = (item) => {
  const score = Number(item.score ?? 0);
  const comments = Number(item.num_comments ?? 0);
  const created = new Date((item.created_utc ?? 0) * 1000);
  const ageHours = Math.max((NOW.getTime() - created.getTime()) / 36e5, 1);
  const recency = Math.max(0, 72 - ageHours) / 72;
  return score * 1.5 + comments * 2 + recency * 20;
};

const scoreHf = (item) => {
  const likes = Number(item.likes ?? 0);
  const downloads = Number(item.downloads ?? 0);
  const created = item.createdAt ? new Date(item.createdAt) : NOW;
  const ageDays = Math.max((NOW.getTime() - created.getTime()) / 86400000, 1);
  const recency = Math.max(0, 14 - ageDays) / 14;
  return likes * 2.5 + downloads / 5000 + recency * 30;
};

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchHnQuery(query) {
  const params = new URLSearchParams({ query, tags: 'story', hitsPerPage: '12' });
  const payload = await fetchJson(`https://hn.algolia.com/api/v1/search_by_date?${params}`);
  return (payload.hits ?? [])
    .filter((hit) => (hit.created_at_i ?? 0) >= Math.floor(SINCE.getTime() / 1000))
    .map((hit) => ({
      title: cleanText(hit.title),
      source: 'Hacker News',
      url: cleanText(hit.url) || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      meta: `${Number(hit.points ?? 0)} points · ${Number(hit.num_comments ?? 0)} comments`,
      why: insightForTopics(topicsFor(hit.title, hit.story_text ?? ''), 'Hacker News'),
      topics: topicsFor(hit.title, hit.story_text ?? ''),
      publishedAt: hit.created_at,
      score: scoreHn(hit),
    }))
    .filter((item) => item.title);
}

async function fetchRedditQuery(subreddit, query) {
  const params = new URLSearchParams({
    q: query,
    restrict_sr: 'on',
    sort: 'new',
    t: 'month',
    limit: '10',
    raw_json: '1',
  });
  const payload = await fetchJson(`https://www.reddit.com/r/${subreddit}/search.json?${params}`, {
    'User-Agent': REDDIT_AGENT,
  });
  const children = payload?.data?.children ?? [];
  return children
    .map((child) => child.data)
    .filter((item) => (item.created_utc ?? 0) >= Math.floor(SINCE.getTime() / 1000))
    .map((item) => ({
      title: cleanText(item.title),
      source: `r/${subreddit}`,
      url: cleanText(item.url) || `https://www.reddit.com${item.permalink ?? ''}`,
      meta: `${Number(item.score ?? 0)} upvotes · ${Number(item.num_comments ?? 0)} comments`,
      why: insightForTopics(topicsFor(item.title, item.selftext ?? ''), 'Reddit'),
      topics: topicsFor(item.title, item.selftext ?? ''),
      publishedAt: utcIso(new Date((item.created_utc ?? 0) * 1000)),
      score: scoreReddit(item),
    }))
    .filter((item) => item.title);
}

async function fetchHfQuery(query) {
  const params = new URLSearchParams({ search: query, sort: 'lastModified', limit: '8' });
  const payload = await fetchJson(`https://huggingface.co/api/models?${params}`);
  return payload
    .filter((item) => !item.private)
    .map((item) => {
      const title = cleanText(item.modelId || item.id);
      const topics = topicsFor(title, (item.tags ?? []).join(' '), item.pipeline_tag ?? '');
      const metaBits = [];
      if (item.pipeline_tag) metaBits.push(item.pipeline_tag);
      if (item.likes !== undefined) metaBits.push(`${Number(item.likes ?? 0)} likes`);
      if (item.downloads !== undefined) metaBits.push(`${Number(item.downloads ?? 0).toLocaleString()} downloads`);
      return {
        title,
        source: 'Hugging Face',
        url: `https://huggingface.co/${title}`,
        meta: metaBits.length ? metaBits.join(' · ') : 'Model listing',
        why: insightForTopics(topics, 'Hugging Face'),
        topics,
        publishedAt: item.createdAt ?? utcIso(NOW),
        score: scoreHf(item),
      };
    })
    .filter((item) => item.title);
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\s\S]*?)<\/${tag}>`, 'i'));
  return match ? cleanText(match[1]) : '';
}

async function fetchFeed(feedName, url) {
  try {
    const text = await fetchText(url);
    const items = [];
    const blocks = text.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
    for (const block of blocks.slice(0, 8)) {
      const title = extractTag(block, 'title');
      const link = extractTag(block, 'link');
      if (!title || !link) continue;
      const topics = topicsFor(title);
      items.push({
        title,
        source: feedName,
        url: link,
        meta: extractTag(block, 'pubDate') || 'Announcement feed',
        why: insightForTopics(topics, feedName),
        topics,
        publishedAt: utcIso(NOW),
        score: 10,
      });
    }
    return items;
  } catch {
    return [];
  }
}

function dedupe(items) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = (item.url || item.title || '').toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function sectionItems(items) {
  return [...items].sort((a, b) => b.score - a.score).slice(0, 5);
}

function buildSummary(items) {
  const counts = new Map();
  for (const item of items) {
    for (const topic of item.topics ?? []) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  const topTopics = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([topic]) => topic);
  if (!topTopics.length) return 'Fresh signals are trickling in, but the best move is still to watch for recurring patterns rather than single posts.';
  if (topTopics.length === 1) return `This cycle is mainly about ${topTopics[0].toLowerCase()}, with the community still looking for practical agent workflows that actually stick.`;
  if (topTopics.length === 2) return `This cycle is centered on ${topTopics[0].toLowerCase()} and ${topTopics[1].toLowerCase()}, with the broader ecosystem still chasing easier, more reliable agent loops.`;
  return `This cycle is clustering around ${topTopics[0].toLowerCase()}, ${topTopics[1].toLowerCase()}, and ${topTopics[2].toLowerCase()}. The strongest signal is that people want better tool surfaces, tighter evals, and less fragile agent loops.`;
}

function buildTangentRadar(items) {
  const topicCounts = new Map();
  const topicSignals = new Map();
  for (const item of items) {
    for (const topic of item.topics ?? []) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
      if ((topicSignals.get(topic) ?? []).length < 4) {
        const arr = topicSignals.get(topic) ?? [];
        arr.push(`${item.source}: ${item.title}`);
        topicSignals.set(topic, arr);
      }
    }
  }
  return [...topicCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([topic, count]) => ({
      topic,
      signalCount: count,
      whyItMatters: insightForTopics([topic], 'Hacker News'),
      signals: topicSignals.get(topic) ?? [],
    }));
}

function buildExperiments(topics) {
  const topicSet = new Set(topics);
  const experiments = [
    {
      title: 'Prototype one MCP-backed workflow',
      why: 'See whether a single standardized tool surface makes the agent easier to trust.',
      prompt: 'Build a tiny MCP service for one real workflow, then benchmark how reliably an agent can use it end to end.',
    },
    {
      title: 'Run a browser-use comparison',
      why: 'Browser and computer-use loops are still the most visible agent frontier.',
      prompt: 'Compare a browser-driven agent against a simpler scripted workflow on the same task and log where the agent wins or breaks.',
    },
    {
      title: 'Measure local vs cloud model drift',
      why: 'Open-weight releases keep changing the tradeoff surface for agents.',
      prompt: 'Pick one agent task and compare a local open-weight model to a frontier model on latency, cost, and tool accuracy.',
    },
  ];
  if (topicSet.has('Evaluation')) {
    experiments[2] = {
      title: 'Build a better agent eval harness',
      why: 'The field needs cleaner ways to measure success than anecdotes.',
      prompt: 'Create a lightweight benchmark that scores agent runs on completion rate, retries, and tool misuse.',
    };
  }
  if (topicSet.has('Memory and state')) {
    experiments[1] = {
      title: 'Add durable memory to one workflow',
      why: 'Persistent state is one of the main gaps between demos and useful agents.',
      prompt: 'Give the agent a minimal memory layer, then replay the same task over multiple sessions and compare behavior.',
    };
  }
  if (topicSet.has('Major labs')) {
    experiments[0] = {
      title: 'Track lab releases against your workflow',
      why: 'Major lab changes often shift the agent design space overnight.',
      prompt: 'Map the newest lab release to a specific workflow in your stack and test whether it meaningfully reduces friction.',
    };
  }
  return experiments;
}

async function main() {
  const jobs = [];
  for (const query of HN_QUERIES) jobs.push(fetchHnQuery(query));
  for (const subreddit of REDDIT_SUBREDDITS) {
    for (const query of REDDIT_QUERIES.slice(0, 4)) jobs.push(fetchRedditQuery(subreddit, query));
  }
  for (const query of HF_QUERIES) jobs.push(fetchHfQuery(query));
  for (const [name, url] of LAB_FEEDS) jobs.push(fetchFeed(name, url));

  const settled = await Promise.allSettled(jobs);
  const items = dedupe(settled.flatMap((entry) => (entry.status === 'fulfilled' ? entry.value : [])));
  const grouped = new Map();
  for (const item of items) {
    const source = displaySource(item.source);
    if (!grouped.has(source)) grouped.set(source, []);
    grouped.get(source).push(item);
  }

  const majorLabItems = items.filter((item) => (item.topics ?? []).includes('Major labs'));
  const sourceSections = ['Hacker News', 'Reddit', 'Hugging Face', 'Major labs'].map((label) => ({
    key: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    items: label === 'Major labs' ? sectionItems(majorLabItems) : sectionItems(grouped.get(label) ?? []),
  }));

  const topicCounts = [...buildTangentRadar(items)].map((entry) => entry.topic);

  const payload = {
    generatedAt: utcIso(NOW),
    windowDays: 7,
    summary: buildSummary(items),
    sourceStats: {
      items: items.length,
      sources: {
        ...Object.fromEntries([...grouped.entries()].map(([source, list]) => [source, list.length])),
        'Major labs': majorLabItems.length,
      },
    },
    highlights: buildHighlights(items),
    sourceSections,
    tangentRadar: buildTangentRadar(items),
    experimentQueue: buildExperiments(topicCounts),
    method: [
      'Hacker News Algolia search over agentic AI keywords',
      'Reddit public search JSON across practical builder communities',
      'Hugging Face model search for open-weight and lab-related drops',
      'Best-effort RSS checks for major lab announcement feeds',
    ],
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`wrote ${path.relative(repoRoot, outputPath)} with ${items.length} items`);
}

function buildHighlights(items) {
  const bySource = new Map();
  for (const item of items) {
    const source = displaySource(item.source);
    if (!bySource.has(source)) bySource.set(source, []);
    bySource.get(source).push(item);
  }

  const picked = [];
  for (const source of ['Hacker News', 'Reddit', 'Hugging Face', 'Major labs']) {
    if (bySource.get(source)?.length) picked.push(bySource.get(source)[0]);
  }

  if (picked.length < 8) {
    const seen = new Set(picked.map((item) => item.url));
    for (const item of items) {
      if (seen.has(item.url)) continue;
      picked.push(item);
      seen.add(item.url);
      if (picked.length >= 8) break;
    }
  }

  return picked.slice(0, 8).map((item) => ({ ...item, topics: item.topics ?? [] }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
