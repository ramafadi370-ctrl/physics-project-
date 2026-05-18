export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      `data: ${JSON.stringify({ error: 'Missing GROQ API key' })}\n\n`,
      { status: 500, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { messages, pdfContext } = data;

  const groqMessages = [];
  if (pdfContext) {
    groqMessages.push({
      role: 'system',
      content: `You are a helpful physics tutor. Below is the content of a document provided by the user. Use it to answer questions.\n\n${pdfContext}`,
    });
  }
  groqMessages.push(...messages);

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
      stream: true,
    }),
  });

  if (!groqRes.ok) {
    const errorText = await groqRes.text();
    return new Response(
      `data: ${JSON.stringify({ error: `Groq API error: ${groqRes.status} - ${errorText}` })}\n\n`,
      { status: 500, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const dataStr = line.slice(6);
        if (dataStr === '[DONE]') {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          continue;
        }
        try {
          const parsed = JSON.parse(dataStr);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content, done: false })}\n\n`));
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }

    await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
    await writer.close();
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}