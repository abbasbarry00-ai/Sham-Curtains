'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

const colors = [
  { id: 'white', hex: '#ffffff', name: 'أبيض' },
  { id: 'beige', hex: '#f5f5dc', name: 'بيج' },
  { id: 'grey', hex: '#808080', name: 'رمادي' },
  { id: 'navy', hex: '#1b2e4b', name: 'كحلي' },
  { id: 'olive', hex: '#556b2f', name: 'أخضر زيتي' },
  { id: 'rose', hex: '#dcaebb', name: 'وردي مغبر' }
];

const stylePrompts: Record<string, string> = {
  modern: "modern sleek contemporary custom curtain with clean vertical lines and neat folds",
  classic: "luxurious classic elegant traditional curtain, rich dense folds, ornate drapery, premium heavy staging",
  minimalist: "simple minimalist clean solid curtain, neat and tidy styling, elegant simplicity",
  roman: "roman style fold-up fabric shade curtain, crisp horizontal pleats, custom fit to the window frame",
  sheer: "light sheer translucent window curtain, soft filtering natural light, delicate airy fabric texture"
};

const fabricPrompts: Record<string, string> = {
  velvet: "heavy premium soft velvet fabric with a rich matte texture and soft sheen highlights",
  linen: "textured natural organic linen fabric with a visible weave and rustic elegance",
  silk: "shiny smooth premium mulberry silk fabric with elegant flowing draping and soft highlights",
  cotton: "soft high-quality organic cotton fabric with a clean smooth matte finish",
  lace: "delicately patterned sheer lace fabric with detailed embroidery and openwork texture"
};

const colorPrompts: Record<string, string> = {
  white: "pure solid white tone",
  beige: "warm classic beige tone",
  grey: "neutral charcoal grey tone",
  navy: "dark elegant navy blue tone",
  olive: "earthy olive green tone",
  rose: "dusty rose pink tone"
};

export default function AppPage() {
  const [style, setStyle] = useState('modern');
  const [fabric, setFabric] = useState('velvet');
  const [selectedColor, setSelectedColor] = useState('white');
  
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [generatedImageSrc, setGeneratedImageSrc] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('16/10');
  
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const [dragging, setDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Measure and set original image aspect ratio dynamically
  React.useEffect(() => {
    if (!originalImageSrc) return;
    const img = new Image();
    img.onload = () => {
      if (img.width && img.height) {
        setImageAspectRatio(`${img.width}/${img.height}`);
      }
    };
    img.src = originalImageSrc;
  }, [originalImageSrc]);

  // Helper to resize image on client side to keep base64 string under 1MB and optimize upload speed
  const getResizedImageBase64 = (src: string, maxDimension = 1024): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = src;
    });
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('الرجاء رفع ملف صورة صالح.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const rawBase64 = e.target.result;
        setLoading(true);
        setLoadingMessage('جاري معالجة الصورة وضغطها...');
        
        try {
          const resized = await getResizedImageBase64(rawBase64, 1024);
          setOriginalImageSrc(resized);
        } catch (err) {
          console.error(err);
          setOriginalImageSrc(rawBase64);
        } finally {
          setLoading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const triggerGenerate = async () => {
    if (!originalImageSrc) return;

    setLoading(true);
    setLoadingMessage('جاري الاتصال بخادم الذكاء الاصطناعي... قد يستغرق ذلك 20-30 ثانية');

    try {
      const styleDesc = stylePrompts[style];
      const fabricDesc = fabricPrompts[fabric];
      const colorDesc = colorPrompts[selectedColor];

      const prompt = `A highly realistic professional photo of the room featuring a new custom-fit ${colorDesc} curtain made of ${fabricDesc} in a ${styleDesc} style. The curtain is precisely tailored to the window's exact size and frame, hanging naturally and realistically. The fabric folds, shadows, and draping match the room's lighting, window size, and overall environment perfectly. All other parts of the room, including the furniture, walls, floor, and lighting, remain completely identical and unchanged. High-resolution architectural photography, photorealistic interior design, virtual staging.`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: originalImageSrc,
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'فشل الاتصال بالخادم.');
      }

      const result = await response.json();
      setGeneratedImageSrc(result.image_url);
    } catch (error: any) {
      console.error(error);
      alert(`عذراً، حدث خطأ أثناء التوليد: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const resetWorkspace = () => {
    setOriginalImageSrc(null);
    setGeneratedImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async () => {
    if (!generatedImageSrc) return;
    
    try {
      const btn = document.getElementById('btn-download');
      if (btn) btn.textContent = 'جاري التحميل... ⏳';
      
      const response = await fetch(generatedImageSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `setara-ai-design-${Date.now()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      if (btn) btn.textContent = 'تحميل التصميم 💾';
    } catch (e) {
      console.error(e);
      window.open(generatedImageSrc, '_blank');
    }
  };

  return (
    <>
      <Header activePage="app" />

      <div className="container">
        <main className="workspace">
          {/* Left Panel: Controls */}
          <section className="controls-panel">
            <h2 className="panel-title">خيارات التصميم</h2>
            
            {/* Style Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="curtain-style">طراز الستارة (Style)</label>
              <select 
                id="curtain-style" 
                className="form-control"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="modern">مودرن (Modern)</option>
                <option value="classic">كلاسيك فاخر (Classic)</option>
                <option value="minimalist">بسيط هادئ (Minimalist)</option>
                <option value="roman">روماني مطوي (Roman)</option>
                <option value="sheer">شيفون شفاف (Sheer)</option>
              </select>
            </div>

            {/* Fabric Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="curtain-fabric">نوع القماش (Fabric)</label>
              <select 
                id="curtain-fabric" 
                className="form-control"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
              >
                <option value="velvet">مخمل ثقيل (Velvet)</option>
                <option value="linen">كتان طبيعي (Linen)</option>
                <option value="silk">حرير ناعم (Silk)</option>
                <option value="cotton">قطن ناعم (Cotton)</option>
                <option value="lace">دانتيل منقوش (Lace)</option>
              </select>
            </div>

            {/* Color Selection */}
            <div className="form-group">
              <label className="form-label">اللون المفضل (Color)</label>
              <div className="color-swatches" id="color-swatches">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    className={`swatch-btn ${selectedColor === c.id ? 'selected' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.id)}
                    title={c.name}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accents-5)', marginTop: '4px' }}>
                اللون المختار: {colors.find(c => c.id === selectedColor)?.name}
              </span>
            </div>

            {/* Generate Button */}
            <button 
              className="btn btn-primary" 
              onClick={triggerGenerate} 
              disabled={!originalImageSrc || loading}
              style={{ width: '100%', fontWeight: 600, padding: '10px 20px', fontSize: '14px' }}
            >
              توليد بالذكاء الاصطناعي ✨
            </button>

            {/* Instructions Card */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', background: 'rgba(255,255,255,0.015)' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>💡 تعليمات الاستخدام:</h4>
              <ul className="tips-list">
                <li>ارفع صورة واضحة لنافذتك وغرفتك الحقيقية بالكامل.</li>
                <li>اختر الطراز المفضل لديك ونوع القماش ولون الستارة من اللوحة.</li>
                <li>اضغط توليد وسيتولى نموذج Flux Kontext Pro الذكي دمج الستارة بدقة فائقة مع إضاءة غرفتك الأصلية.</li>
              </ul>
            </div>
          </section>

          {/* Right Panel: Workspace */}
          <section className="canvas-panel">
            <div className="canvas-header">
              <h3 className="canvas-title">
                <span>
                  {generatedImageSrc 
                    ? "تم تصميم ستارتك بنجاح! 🎉" 
                    : originalImageSrc 
                      ? "تم رفع الصورة! اختر خيارات الستارة ثم اضغط توليد" 
                      : "لوحة التصميم"}
                </span>
              </h3>
              {originalImageSrc && (
                <div className="canvas-toolbar">
                  <button className="btn btn-secondary" onClick={resetWorkspace} style={{ padding: '6px 14px', fontSize: '13px' }}>
                    تصميم جديد ↻
                  </button>
                </div>
              )}
            </div>

            <div className="canvas-container" style={{ position: 'relative', minHeight: '400px' }}>
              {/* Dropzone for upload */}
              {!originalImageSrc && !generatedImageSrc && (
                <div 
                  className="dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  style={{ 
                    borderColor: dragging ? 'var(--foreground)' : 'var(--border)',
                    background: dragging ? 'rgba(255, 255, 255, 0.03)' : undefined
                  }}
                >
                  {/* Modern Premium SVG icon representing image upload */}
                  <svg className="dropzone-svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accents-5)', marginBottom: '4px' }}>
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <rect x="7" y="11" width="10" height="7" rx="1" />
                    <path d="m7 16 3-3 3 3" />
                    <circle cx="14" cy="13" r="0.5" fill="currentColor" />
                  </svg>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: '2px 0 0 0' }}>
                    اسحب صورة نافذتك هنا
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--accents-5)', margin: 0 }}>
                    أو اضغط لتصفح الملفات
                  </p>
                  <div className="btn btn-secondary dropzone-btn" style={{ pointerEvents: 'none', padding: '6px 14px', fontSize: '12px', marginTop: '6px', borderRadius: '6px' }}>
                    اختر صورة
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--accents-4)', marginTop: '8px' }}>
                    الصيغ المدعومة: PNG, JPG (الحد الأقصى: 10 ميجابايت)
                  </span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={(e) => { if (e.target.files?.length) handleImageFile(e.target.files[0]); }}
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                </div>
              )}

              {/* Source Image Display */}
              {originalImageSrc && !generatedImageSrc && (
                <div className="editor-wrapper" style={{ display: 'block' }}>
                  <img src={originalImageSrc} className="editor-image" alt="النافذة المرفوعة" />
                </div>
              )}

              {/* Comparison Result View */}
              {originalImageSrc && generatedImageSrc && (
                <div style={{ width: '100%' }}>
                  <BeforeAfterSlider
                    beforeImage={originalImageSrc}
                    afterImage={generatedImageSrc}
                    beforeAlt="قبل"
                    afterAlt="بعد"
                    aspectRatio={imageAspectRatio}
                  />
                </div>
              )}

              {/* Loading Overlay */}
              {loading && (
                <div className="loading-overlay" style={{ display: 'flex' }}>
                  <div className="spinner"></div>
                  <p className="loading-text">{loadingMessage}</p>
                </div>
              )}
            </div>
            
            {/* Bottom bar when result is shown */}
            {originalImageSrc && generatedImageSrc && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accents-1)' }}>
                <span style={{ fontSize: '12px', color: 'var(--accents-5)' }}>
                  اسحب المقبض في المنتصف لمقارنة النتيجة مع النافذة الأصلية.
                </span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" id="btn-download" onClick={handleDownload} style={{ padding: '8px 16px', fontSize: '13px' }}>
                    تحميل التصميم 💾
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
