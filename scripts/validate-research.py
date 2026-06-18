import json

with open('public/data/agent-research.json') as f:
    data = json.load(f)

print(f"OK: {len(data['highlights'])} highlights, {len(data['sourceSections'])} sections, {len(data['tangentRadar'])} tangents, {len(data['experimentQueue'])} experiments")
print(f"Total items: {data['sourceStats']['items']}, generatedAt: {data['generatedAt']}")
print(f"Sections: {[s['key'] for s in data['sourceSections']]}")
print(f"Highlights: {[h['title'][:60] for h in data['highlights']]}")
print(f"Tangents: {[t['topic'][:60] for t in data['tangentRadar']]}")
print(f"Experiments: {[e['title'][:60] for e in data['experimentQueue']]}")
