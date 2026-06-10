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
  wave: "modern ripple fold curtain with continuous elegant S-curve wave pattern, neat uniform vertical undulating folds, minimalist clean aesthetic, smooth flowing fabric waves",
  pleated: "pencil pleat curtain with tightly gathered neat small pleats at the top heading, structured vertical fabric folds flowing downward, elegant classic draping style",
  gathered: "gathered curtain with soft bunched fabric style, casual ruffled heading at the top, soft natural gathers creating a relaxed organic look",
  pinch: "pinch pleat curtain with double pinch pleats heading style, classic structured vertical folds gathered in neat pinches at the top, elegant formal draping",
  sunscreen: "modern sunscreen roller blinds, flat translucent mesh roller shades, sun filtering weave, fitted neatly inside the window frame, minimal tech look",
  blackout: "premium blackout suede roller blinds, thick matte suede fabric roll-up shade, 100% light-blocking solid fabric flat panel, neat clean roller mechanism",
  dk: "modern vertical day and night blinds, DK vertical sheer and opaque fabric slats, vertical zebra style panels, rotating vertical fabric louvers",
  classic_rod: "classic grommet eyelet curtain with large metal ring grommets punched along the top edge, heavy drapery with deep luxurious folds, formal traditional draping style",
  zebra: "zebra roller blinds, dual-layer roller shade with alternating horizontal stripes of sheer mesh and solid opaque fabric, zebra pattern window blinds",
  wood_venetian: "horizontal wooden venetian blinds, premium wood slat jalousie blinds, adjustable timber slats, fitted inside the window casing, warm wood grain texture",
  metal_venetian: "horizontal aluminum venetian blinds, sleek metal slat jalousie blinds, silver-grey adjustable metal slats, minimalist industrial office look",
  side_pull: "elegant side-gathered curtain with decorative tie-back cords holding the fabric to the sides, graceful draped swag style with flowing curves",
  stage: "dramatic theater style curtain with heavy deep velvet drapery, massive dense folds, theatrical pleated header, majestic grand stage style draping"
};

const blindStyles = ['sunscreen', 'blackout', 'dk', 'zebra', 'wood_venetian', 'metal_venetian'];
const isBlindStyle = (styleId: string) => blindStyles.includes(styleId);


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

const barPrompts: Record<string, string> = {
  wood_bar: "The curtain hangs from a prominent visible luxurious decorative wooden curtain rod mounted on the wall above the window. The rod has ornate carved wood finials on both ends and decorative wooden brackets. The wood grain finish is warm and complements the room furniture. The rod and brackets must be clearly visible.",
  metal_bar: "The curtain hangs from a prominent visible decorative wrought iron curtain rod mounted on the wall above the window. The rod has elegant ornate metal finials on both ends and decorative iron brackets. The metallic finish is polished and matches the room decor. The rod and brackets must be clearly visible.",
  modern_bar: "The curtain hangs from a prominent visible minimalist modern curtain rod mounted on the wall above the window. The rod has clean geometric finials and slim metal brackets in brushed steel or matte black. The rod must be clearly visible.",
  hidden: "The curtain hangs from a completely hidden recessed ceiling track that is invisible. There is absolutely NO visible curtain rod, NO pole, NO bar, NO finials, NO brackets, and NO exposed mounting hardware whatsoever. The fabric appears to emerge directly from a clean ceiling slot."
};

const curtainPositionPrompts: Record<string, string> = {
  closed: "IMPORTANT: The curtain panels are FULLY CLOSED, meeting perfectly at the center with no gap. The fabric covers the ENTIRE window from edge to edge with no opening. No part of the window glass or daylight is visible behind the curtain. The fabric hangs in continuous elegant folds across the complete window width.",
  half_open: "IMPORTANT: The curtain panels are pulled OPEN to both sides, gathered and bunched at the left and right edges of the window. The CENTER of the window is fully EXPOSED and UNCOVERED, with bright natural sunlight streaming through the bare window glass in the middle."
};

const opacityPrompts: Record<string, string> = {
  sheer: "sheer translucent fabric that lets natural sunlight pass through, creating a bright airy ambiance with soft light filtering",
  semi: "semi-opaque light-filtering fabric that dims the light and offers privacy while maintaining a warm ambient glow",
  blackout: "100% thick blackout fabric that completely blocks out all incoming daylight, providing full room darkening and absolute privacy"
};

export default function AppPage() {
  const [style, setStyle] = useState('wave');
  const [fabric, setFabric] = useState('velvet');
  const [selectedColor, setSelectedColor] = useState('white');
  const [barStyle, setBarStyle] = useState('wood_bar');
  const [opacity, setOpacity] = useState('semi');
  const [addTulle, setAddTulle] = useState(false);
  const [curtainPosition, setCurtainPosition] = useState('closed');
  
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
      const colorDesc = colorPrompts[selectedColor];
      const barDesc = barPrompts[barStyle];
      const opacityDesc = opacityPrompts[opacity];
      const positionDesc = curtainPositionPrompts[curtainPosition];

      let prompt = '';
      if (isBlindStyle(style)) {
        prompt = `A highly realistic professional photo of the room featuring a new custom-fit ${colorDesc} ${styleDesc}. The blinds are neatly installed inside the window frame, precisely fitted to the window's exact size, looking clean and realistic. The slats, shadows, and light filtering match the room's lighting, window size, and overall environment perfectly. All other parts of the room, including the furniture, walls, floor, and lighting, remain completely identical and unchanged. High-resolution architectural photography, photorealistic interior design, virtual staging.`;
      } else {
        const fabricDesc = fabricPrompts[fabric];
        const tulleLayer = addTulle ? ` Behind the main curtain, there is a secondary sheer white tulle layer with fine mesh netting, adding depth and soft light filtering.${curtainPosition === 'half_open' ? ' The tulle layer is visible through the open center of the curtain, softly diffusing the incoming sunlight.' : ''}` : '';
        prompt = `A highly realistic professional photo of the room. ${positionDesc}. ${barDesc} The curtain is a custom-fit ${colorDesc} curtain made of ${fabricDesc} in a ${styleDesc} style, precisely tailored to the window's exact size and frame, hanging naturally and realistically. The curtain fabric is ${opacityDesc}.${tulleLayer} The fabric folds, shadows, and draping match the room's lighting, window size, and overall environment perfectly. All other parts of the room, including the furniture, walls, floor, and lighting, remain completely identical and unchanged. High-resolution architectural photography, photorealistic interior design, virtual staging.`;
      }

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

  const loadReadyImage = async () => {
    setLoading(true);
    setLoadingMessage('جاري تحميل الصورة الجاهزة...');
    try {
      const response = await fetch('/assets/window-empty.jpg');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setOriginalImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading ready image:', error);
      alert('حدث خطأ أثناء تحميل الصورة الجاهزة.');
    } finally {
      setLoading(false);
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
          
          {/* Column 1: التركيب والإعدادات (Left Panel) */}
          <section className="left-column controls-panel">
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔆</span> التركيب والإعدادات
            </h2>

            {/* Decorative Bar Selection */}
            <div className="form-group">
              <label className="form-label">ديكور البار (القضيب)</label>
              <div className="pill-grid">
                {isBlindStyle(style) ? (
                  <button type="button" className="pill-btn active" style={{ background: 'var(--accents-2)', color: 'var(--accents-6)', border: 'none' }} disabled>
                    بدون بار (تلقائي للبلايند)
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`pill-btn ${barStyle === 'wood_bar' ? 'active' : ''}`}
                      onClick={() => setBarStyle('wood_bar')}
                    >
                      🪵 بار خشبي ديكور
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${barStyle === 'metal_bar' ? 'active' : ''}`}
                      onClick={() => setBarStyle('metal_bar')}
                    >
                      ⚙️ بار حديد مزخرف
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${barStyle === 'modern_bar' ? 'active' : ''}`}
                      onClick={() => setBarStyle('modern_bar')}
                    >
                      ✦ بار مودرن بسيط
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${barStyle === 'hidden' ? 'active' : ''}`}
                      onClick={() => setBarStyle('hidden')}
                    >
                      🔲 سكة مخفية (بدون بار)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Curtain Position */}
            <div className="form-group">
              <label className="form-label">وضعية الستارة</label>
              <div className="pill-grid">
                {isBlindStyle(style) ? (
                  <button type="button" className="pill-btn active" style={{ background: 'var(--accents-2)', color: 'var(--accents-6)', border: 'none' }} disabled>
                    تلقائي للبلايند
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`pill-btn ${curtainPosition === 'closed' ? 'active' : ''}`}
                      onClick={() => setCurtainPosition('closed')}
                    >
                      مغلقة بالكامل
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${curtainPosition === 'half_open' ? 'active' : ''}`}
                      onClick={() => setCurtainPosition('half_open')}
                    >
                      مفتوحة عالنص (تبين الضوء)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Add Tulle Toggle */}
            <div className="form-group">
              <label className="form-label">إضافة طبقة تول</label>
              <div className="pill-grid">
                {isBlindStyle(style) ? (
                  <button type="button" className="pill-btn active" style={{ background: 'var(--accents-2)', color: 'var(--accents-6)', border: 'none' }} disabled>
                    غير متاح للبلايند
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`pill-btn ${!addTulle ? 'active' : ''}`}
                      onClick={() => setAddTulle(false)}
                    >
                      بدون تول
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${addTulle ? 'active' : ''}`}
                      onClick={() => setAddTulle(true)}
                    >
                      ✨ إضافة تول خلف الستارة
                    </button>
                  </>
                )}
              </div>
              {addTulle && !isBlindStyle(style) && (
                <span style={{ fontSize: '11px', color: '#3b82f6', marginTop: '4px' }}>
                  💡 اختر "مفتوحة عالنص" في وضعية الستارة لإظهار التول بوضوح مع أشعة الشمس.
                </span>
              )}
            </div>

            {/* Opacity Selection */}
            <div className="form-group">
              <label className="form-label">درجة التعتيم</label>
              <div className="pill-grid">
                <button
                  type="button"
                  className={`pill-btn ${opacity === 'sheer' ? 'active' : ''}`}
                  onClick={() => setOpacity('sheer')}
                >
                  شفاف يمرر الضوء
                </button>
                <button
                  type="button"
                  className={`pill-btn ${opacity === 'semi' ? 'active' : ''}`}
                  onClick={() => setOpacity('semi')}
                >
                  شبه تعتيم
                </button>
                <button
                  type="button"
                  className={`pill-btn ${opacity === 'blackout' ? 'active' : ''}`}
                  onClick={() => setOpacity('blackout')}
                >
                  تعتيم كامل
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', background: 'var(--background)', marginTop: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>💡 للحصول على أفضل نتيجة:</h4>
              <ul className="tips-list" style={{ paddingRight: '12px' }}>
                <li>صور النافذة كاملة بإضاءة نهارية واضحة.</li>
                <li>تأكد من عدم وجود عوائق كبيرة أمام النافذة.</li>
                <li>لإظهار التول، اختر "مفتوحة عالنص" مع تفعيل التول.</li>
              </ul>
            </div>
          </section>

          {/* Column 2: Canvas & Steps (Center Panel) */}
          <section className="center-column">
            
            {/* Page Main Title */}
            <h1 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '24px', color: 'var(--foreground)' }}>
              صمّم ستارتك الآن
            </h1>

            {/* Steps Progress Indicator */}
            <div className="steps-indicator">
              <div className={`step-item ${originalImageSrc ? 'completed' : 'active'}`}>
                <span className="step-number">1</span>
                <span className="step-text">ارفع صورة غرفتك</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${originalImageSrc && !generatedImageSrc ? 'active' : ''} ${generatedImageSrc ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-text">اختر الخيارات وولد</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${generatedImageSrc ? 'active' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-text">قارن وحمل النتيجة</span>
              </div>
            </div>

            {/* Main Canvas Area */}
            <div className="canvas-panel" style={{ flex: 1 }}>
              <div className="canvas-header">
                <h3 className="canvas-title">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: originalImageSrc ? '#10b981' : '#ccc', display: 'inline-block' }}></span>
                  <span>
                    {generatedImageSrc 
                      ? "تم تصميم ستارتك بنجاح! 🎉" 
                      : originalImageSrc 
                        ? "تم رفع الصورة! حدد خيارات الستارة واضغط توليد" 
                        : "ارفع صورة نافذتك لتبدأ"}
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

              <div className="canvas-container">
                {/* Subtle Grid Background for canvas */}
                {!originalImageSrc && !generatedImageSrc && <div className="dropzone-grid-bg"></div>}

                {/* Dropzone for upload */}
                {!originalImageSrc && !generatedImageSrc && (
                  <div 
                    className="dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    style={{ 
                      borderColor: dragging ? '#3b82f6' : 'var(--border)',
                      background: dragging ? 'rgba(59, 130, 246, 0.03)' : 'var(--background)',
                      zIndex: 1
                    }}
                  >
                    {/* Modern Premium SVG icon representing image upload */}
                    <svg className="dropzone-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M12 8l-4 4h8z" />
                      <path d="M12 16v-6" />
                    </svg>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: '4px 0' }}>
                      اسحب صورة نافذتك إلى هنا
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--accents-5)', margin: '0 0 12px 0' }}>
                      أو اضغط لاختيار صورة من جهازك
                    </p>
                    <div className="btn btn-secondary dropzone-btn" style={{ pointerEvents: 'none', padding: '8px 18px', fontSize: '13px', borderRadius: '6px', fontWeight: 600 }}>
                      اختر صورة
                    </div>
                    <button 
                      type="button"
                      className="btn-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        loadReadyImage();
                      }}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#3b82f6', 
                        fontWeight: 700, 
                        fontSize: '13px', 
                        cursor: 'pointer', 
                        marginTop: '12px',
                        textDecoration: 'underline',
                        zIndex: 2
                      }}
                    >
                      أو جرّب بصورة جاهزة
                    </button>
                    <span style={{ fontSize: '11px', color: 'var(--accents-5)', marginTop: '8px' }}>
                      PNG أو JPG – حتى 10 ميجابايت
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
                  <span style={{ fontSize: '13px', color: 'var(--accents-6)' }}>
                    اسحب المقبض في المنتصف لمقارنة النتيجة مع النافذة الأصلية.
                  </span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" id="btn-download" onClick={handleDownload} style={{ padding: '8px 16px', fontSize: '13px' }}>
                      تحميل التصميم 💾
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Column 3: المظهر والخامة (Right Panel) */}
          <section className="right-column controls-panel">
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🥞</span> المظهر والخامة
            </h2>
            
            {/* Style Selection */}
            <div className="form-group">
              <label className="form-label">الطراز</label>
              <div className="pill-grid">
                <button
                  type="button"
                  className={`pill-btn ${style === 'wave' ? 'active' : ''}`}
                  onClick={() => setStyle('wave')}
                >
                  ويفي (Wave)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'pleated' ? 'active' : ''}`}
                  onClick={() => setStyle('pleated')}
                >
                  كسرات (Pleated)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'gathered' ? 'active' : ''}`}
                  onClick={() => setStyle('gathered')}
                >
                  زم (Gathered)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'pinch' ? 'active' : ''}`}
                  onClick={() => setStyle('pinch')}
                >
                  تكسير امريكي
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'sunscreen' ? 'active' : ''}`}
                  onClick={() => setStyle('sunscreen')}
                >
                  رول سنسكرين
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'blackout' ? 'active' : ''}`}
                  onClick={() => setStyle('blackout')}
                >
                  بلاك آوت شامواه
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'dk' ? 'active' : ''}`}
                  onClick={() => setStyle('dk')}
                >
                  دي كي (DK)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'classic_rod' ? 'active' : ''}`}
                  onClick={() => setStyle('classic_rod')}
                >
                  كلاسيك بوري
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'zebra' ? 'active' : ''}`}
                  onClick={() => setStyle('zebra')}
                >
                  رول زيبرا
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'wood_venetian' ? 'active' : ''}`}
                  onClick={() => setStyle('wood_venetian')}
                >
                  جالوزي خشبي
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'metal_venetian' ? 'active' : ''}`}
                  onClick={() => setStyle('metal_venetian')}
                >
                  جالوزي معدني
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'side_pull' ? 'active' : ''}`}
                  onClick={() => setStyle('side_pull')}
                >
                  رفعات جانبية
                </button>
                <button
                  type="button"
                  className={`pill-btn ${style === 'stage' ? 'active' : ''}`}
                  onClick={() => setStyle('stage')}
                >
                  مسرحي كسرات
                </button>
              </div>
            </div>

            {/* Fabric Selection */}
            <div className="form-group">
              <label className="form-label">نوع القماش</label>
              <div className="pill-grid">
                {isBlindStyle(style) ? (
                  <button type="button" className="pill-btn active" style={{ background: 'var(--accents-2)', color: 'var(--accents-6)', border: 'none' }} disabled>
                    تلقائي للموديل (Automatic)
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`pill-btn ${fabric === 'velvet' ? 'active' : ''}`}
                      onClick={() => setFabric('velvet')}
                    >
                      مخمل ثقيل
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${fabric === 'linen' ? 'active' : ''}`}
                      onClick={() => setFabric('linen')}
                    >
                      كتان طبيعي
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${fabric === 'silk' ? 'active' : ''}`}
                      onClick={() => setFabric('silk')}
                    >
                      حرير ناعم
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${fabric === 'cotton' ? 'active' : ''}`}
                      onClick={() => setFabric('cotton')}
                    >
                      قطن ناعم
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${fabric === 'lace' ? 'active' : ''}`}
                      onClick={() => setFabric('lace')}
                    >
                      دانتيل منقوش
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="form-group">
              <label className="form-label">اللون المفضل</label>
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
              style={{ width: '100%', fontWeight: 700, padding: '12px 20px', fontSize: '15px', marginTop: '12px', background: '#3b82f6', color: '#ffffff', borderColor: '#3b82f6' }}
            >
              توليد بالذكاء الاصطناعي ✨
            </button>
          </section>

        </main>
      </div>

      <Footer />
    </>
  );
}

