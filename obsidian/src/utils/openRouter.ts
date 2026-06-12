export async function generateAiDescription({
  url,
  title,
  apiKey,
  model = 'meta-llama/llama-3.2-3b-instruct:free',
}: {
  url: string;
  title: string;
  apiKey: string;
  model?: string;
}): Promise<string | null> {
  const prompt =
    `Provide a concise 1-2 sentence description of this web page.\nURL: ${url}\nTitle: ${title}\nRespond with only the description, no preamble.`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content?.trim() || null;
}
