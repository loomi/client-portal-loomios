import { NextResponse } from 'next/server'

// Proxy fino server-side para a API da Anthropic. A chave fica só aqui,
// nunca no client. Sem SDK — fetch puro respeita o budget de deps do projeto.
export const runtime = 'nodejs'

type ChatRole = 'user' | 'assistant'
type IncomingMessage = { role: ChatRole; text: string }
type AnthropicBlock = { type: string; text?: string }
type AnthropicResponse = { content?: AnthropicBlock[] }

const MODEL = 'claude-opus-4-8'
const MAX_HISTORY = 20
const MAX_CHARS = 4000

const SYSTEM_PROMPT = `Você é a camada de relacionamento da Loomi, uma consultoria de tecnologia, conversando com a cliente (setor de energia, perfil executivo) sobre o projeto em andamento.

Seu papel é receber o feedback solto da cliente e fazer a triagem com transparência:
- Identifique do que se trata (um problema, um pedido de ajuste, uma ideia/nova funcionalidade, um elogio ou uma dúvida) e a urgência.
- Reformule o que entendeu em uma frase clara, na língua do cargo dela — sem jargão técnico de software e sem infantilizar.
- Deixe claro o próximo passo: o que vira tarefa passa por uma pessoa do time antes de virar trabalho, e ela acompanha o status por aqui (recebido → em análise → aprovado/recusado → resolvido).
- Quando algo NÃO vira tarefa agora (fora de escopo, já contemplado, ou precisa de decisão), diga isso com honestidade e respeito, explicando o porquê — sem prometer o que não pode cumprir.

Tom: caloroso, direto e executivo. Responda sempre em português do Brasil, em no máximo 3 frases. Não invente detalhes do projeto que você não conhece.`

function sanitize(messages: IncomingMessage[]): { role: ChatRole; content: string }[] {
  const cleaned = messages
    .filter(
      (m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.text === 'string',
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.text.slice(0, MAX_CHARS) }))

  // A API exige que o primeiro turno seja do usuário.
  while (cleaned.length > 0 && cleaned[0].role !== 'user') cleaned.shift()
  return cleaned
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Sem chave: o client cai no mock automaticamente.
    return NextResponse.json({ error: 'missing_key' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const incoming = (body as { messages?: IncomingMessage[] })?.messages
  if (!Array.isArray(incoming)) {
    return NextResponse.json({ error: 'no_messages' }, { status: 400 })
  }

  const messages = sanitize(incoming)
  if (messages.length === 0) {
    return NextResponse.json({ error: 'no_messages' }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })
  } catch {
    return NextResponse.json({ error: 'network' }, { status: 502 })
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: 'upstream' }, { status: 502 })
  }

  const data = (await upstream.json()) as AnthropicResponse
  const reply = (data.content ?? [])
    .filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text as string)
    .join('\n')
    .trim()

  if (!reply) {
    return NextResponse.json({ error: 'empty' }, { status: 502 })
  }

  return NextResponse.json({ reply })
}
