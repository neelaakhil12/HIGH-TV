import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { title, description, body } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in the environment variables (.env)' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional English-to-Telugu translator for a premium news portal.
Translate the following English content into formal, professional, natural, and polite Telugu.
The tone should be engaging and journalism-appropriate (avoid literal/rude translations).

If translating HTML content (e.g. body), preserve all HTML tags (like <p>, <a>, <img>, <strong>, etc.) exactly unchanged. Only translate the textual content inside the HTML tags. Do not change links, class names, or attributes.

English Content to translate:
Title: ${title || ''}
Description: ${description || ''}
Body: ${body || ''}

Return the output strictly in this JSON structure (do not wrap in markdown code blocks):
{
  "title": "Translated Telugu Title",
  "description": "Translated Telugu Description/Excerpt",
  "body": "Translated Telugu Body HTML"
}`;

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      return NextResponse.json(
        { error: `Gemini API returned error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      return NextResponse.json({ error: 'Empty response from Gemini API' }, { status: 500 });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(textResponse.trim());
    } catch (parseError) {
      console.error('Error parsing Gemini response:', textResponse);
      return NextResponse.json({ error: 'Failed to parse translation JSON response' }, { status: 500 });
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message || 'Translation failed' }, { status: 500 });
  }
}
