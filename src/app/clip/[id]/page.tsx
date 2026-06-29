import { notFound, redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface ClipPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ClipPageProps) {
  const { id } = await params;

  if (id.startsWith('article-')) {
    return {
      title: 'High TV E-Paper Article',
    };
  }

  const imageUrl = `https://hightv.in/uploads/clips/${id}.jpg`;

  return {
    title: 'హై టీవీ ఈ-పేపర్ క్లిప్పింగ్ | High TV E-Paper Clip',
    description: 'హై టీవీ ఈ-పేపర్ నుండి క్లిప్ చేయబడిన వార్త.',
    openGraph: {
      title: 'హై టీవీ ఈ-పేపర్ క్లిప్పింగ్',
      description: 'హై టీవీ ఈ-పేపర్ నుండి క్లిప్ చేయబడిన వార్త.',
      images: [
        {
          url: imageUrl,
          alt: 'High TV E-Paper Clip',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'హై టీవీ ఈ-పేపర్ క్లిప్పింగ్',
      description: 'హై టీవీ ఈ-పేపర్ నుండి క్లిప్ చేయబడిన వార్త.',
      images: [imageUrl],
    },
  };
}

export default async function ClipPage({ params }: ClipPageProps) {
  const { id } = await params;

  // Handle article redirects to prevent breaking old links
  if (id.startsWith('article-')) {
    const articleId = id.replace('article-', '');
    redirect(`/category/epaper?view=article&articleId=${articleId}`);
  }

  // Verify the clip file exists on disk
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'clips', `${id}.jpg`);
  const fileExists = fs.existsSync(filePath);

  if (!fileExists) {
    notFound();
  }

  const imageUrl = `/uploads/clips/${id}.jpg`;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pb-20">
      {/* Header Bar */}
      <header className="w-full max-w-4xl bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          {/* logo image */}
          <img src="/epaper-logo.png" alt="High TV Logo" className="h-12 w-auto object-contain bg-yellow-400 p-1.5 rounded-lg shadow-inner" />
        </Link>
        <Link 
          href="/category/epaper"
          className="bg-sky-600 hover:bg-sky-700 transition-colors text-xs md:text-sm font-bold text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg flex items-center gap-1.5"
        >
          📰 పూర్తి ఈ-పేపర్ చదవండి
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-xl flex-1 px-4 py-8 flex flex-col items-center gap-6">
        <div className="w-full bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center">
          {/* Crop Container */}
          <div className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-inner border border-slate-200">
            <img 
              src={imageUrl} 
              alt="Cropped E-paper Section" 
              className="w-full h-auto object-contain block mx-auto"
            />
          </div>
          
          <div className="w-full text-center mt-6 flex flex-col items-center gap-4">
            <p className="text-slate-400 text-xs md:text-sm italic">
              ఈ వార్త హై టీవీ ఈ-పేపర్ ద్వారా క్లిప్ చేయబడింది.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/category/epaper"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-sm font-bold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-[1.02]"
              >
                పూర్తి వార్తా పత్రిక చదవండి (Read Full E-Paper)
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
