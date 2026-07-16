import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, description, paragraphs } = await request.json();
    
    // Helper to translate single text via Google Translate API
    const translateText = async (text: string) => {
      if (!text || text.trim() === '') return '';
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) return text; // Fallback to original text if fetch fails
        const json = await res.json();
        if (json && json[0]) {
          return json[0].map((x: any) => x[0]).join('').trim();
        }
        return text;
      } catch (e) {
        console.error('Single text translation error:', e);
        return text;
      }
    };

    // Run translations in parallel
    const titlePromise = translateText(title);
    const descPromise = translateText(description);
    const paragraphsPromises = (paragraphs || []).map((p: string) => translateText(p));

    const [translatedTitle, translatedDesc, ...translatedParagraphs] = await Promise.all([
      titlePromise,
      descPromise,
      ...paragraphsPromises
    ]);

    return NextResponse.json({
      title: translatedTitle,
      description: translatedDesc,
      paragraphs: translatedParagraphs
    });
  } catch (error: any) {
    console.error('Translation server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
