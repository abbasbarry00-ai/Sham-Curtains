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
  wood_bar: "The curtains MUST hang from a highly visible, prominent decorative wooden curtain rod mounted on the wall above the window. The wooden rod has ornate wood finials on both ends and wooden brackets, with a rich warm wood grain finish. The rod and mounting brackets are clearly visible.",
  metal_bar: "The curtains MUST hang from a highly visible, prominent decorative wrought iron curtain rod mounted on the wall above the window. The rod has elegant ornate metal finials on both ends and iron brackets, with a polished metallic black or brass finish. The rod and mounting brackets are clearly visible.",
  modern_bar: "The curtains MUST hang from a highly visible, prominent sleek minimalist modern curtain rod mounted on the wall above the window. The modern rod has clean geometric finials and slim metal brackets in a brushed steel or matte black finish. The rod and brackets are clearly visible.",
  hidden: "There must be NO visible curtain rod, NO pole, NO bar, NO finials, and NO brackets above the window. The curtains must hang from a completely hidden, invisible recessed track slot in the ceiling. The fabric emerges directly from a clean narrow gap in the ceiling without any visible hanging hardware."
};

const curtainPositionPrompts: Record<string, string> = {
  closed: "The curtain panels are drawn completely shut, meeting tightly in the center. The fabric covers the entire window from the left edge to the right edge. The window glass and window frame are fully covered and hidden behind the solid continuous curtain fabric, with no center gap or opening.",
  half_open: "The curtain panels are half-open, drawn apart to the left and right sides. The curtain fabric is gathered and bunched at the left and right window edges, leaving the center of the window fully open and exposed, with natural daylight streaming through the window glass in the middle."
};

const opacityPrompts: Record<string, string> = {
  sheer: "sheer translucent fabric that lets natural sunlight pass through, creating a bright airy ambiance with soft light filtering",
  semi: "semi-opaque light-filtering fabric that dims the light and offers privacy while maintaining a warm ambient glow",
  blackout: "100% thick blackout fabric that completely blocks out all incoming daylight, providing full room darkening and absolute privacy"
};

const styleNames: Record<string, string> = {
  wave: 'ويفي',
  pleated: 'كسرات',
  gathered: 'زم',
  pinch: 'تكسير امريكي',
  sunscreen: 'رول سنسكرين',
  blackout: 'بلاك آوت شامواه',
  dk: 'دي كي (DK)',
  classic_rod: 'كلاسيك بوري',
  zebra: 'رول زيبرا',
  wood_venetian: 'جالوزي خشبي',
  metal_venetian: 'جالوزي معدني',
  side_pull: 'رفعات جانبية',
  stage: 'مسرحي كسرات'
};

const fabricNames: Record<string, string> = {
  velvet: 'مخمل ثقيل',
  linen: 'كتان طبيعي',
  silk: 'حرير ناعم',
  cotton: 'قطن ناعم',
  lace: 'دانتيل منقوش'
};

const barNames: Record<string, string> = {
  wood_bar: '🪵 بار خشبي ديكور',
  metal_bar: '⚙️ بار حديد مزخرف',
  modern_bar: '✦ بار مودرن بسيط',
  hidden: '🔲 سكة مخفية (بدون بار)'
};

const positionNames: Record<string, string> = {
  closed: 'مغلقة بالكامل',
  half_open: 'مفتوحة عالنص'
};

const opacityNames: Record<string, string> = {
  sheer: 'شفاف يمرر الضوء',
  semi: 'شبه تعتيم',
  blackout: 'تعتيم كامل'
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
      const getCohesivePrompt = () => {
        const colorObj = colors.find(c => c.id === selectedColor);
        const colorName = colorObj ? colorObj.name : 'أبيض';
        const colorHex = colorObj ? colorObj.hex : '#ffffff';
        const colorDesc = colorPrompts[selectedColor];
        
        let lightingInstruction = '';
        if (opacity === 'sheer') {
          lightingInstruction = "The room's lighting must be bright and naturally lit by daylight filtering through the open or sheer window coverings. All other parts of the room, including the furniture, walls, and floor, must remain completely identical and unchanged.";
        } else if (opacity === 'semi') {
          lightingInstruction = "The room's lighting must be softly diffused with gentle ambient light. All other parts of the room, including the furniture, walls, and floor, must remain completely identical and unchanged.";
        } else {
          // blackout
          lightingInstruction = "The room's interior lighting must match the blackout effect, showing less direct daylight and soft dimmed indoor ambient lighting. All other parts of the room, including the furniture, walls, and floor, must remain completely identical and unchanged.";
        }

        const qualityDirectives = "This is a professional architectural photograph. Avoid any cartoonish, 3D render, digital illustration, flat vector, or artificial look. The materials must have realistic photographic textures, natural fabric folds, physical shadows, and ambient reflections matching a high-end interior design catalog photo.";

        if (isBlindStyle(style)) {
          let blindStyleDesc = '';
          if (style === 'sunscreen') {
            if (opacity === 'blackout') {
              blindStyleDesc = `modern solid blackout roller blinds, flat opaque fabric roller shades, completely blocking all light, fitted neatly inside the window frame, minimal tech look, with premium realistic fabric texture`;
            } else if (opacity === 'sheer') {
              blindStyleDesc = `modern sheer sunscreen roller blinds, flat translucent mesh roller shades, sun filtering weave, fitted neatly inside the window frame, minimal tech look, with visible fine mesh fabric texture`;
            } else { // semi
              blindStyleDesc = `modern semi-opaque sunscreen roller blinds, flat light-filtering mesh roller shades, fitted neatly inside the window frame, minimal tech look, with premium fabric texture`;
            }
          } else if (style === 'blackout') {
            blindStyleDesc = `premium blackout suede roller blinds, thick matte suede fabric roll-up shade, 100% light-blocking solid fabric flat panel, neat clean roller mechanism, with rich matte fabric texture`;
          } else if (style === 'zebra') {
            if (opacity === 'blackout') {
              blindStyleDesc = `zebra roller blinds, dual-layer roller shade with alternating horizontal stripes of sheer mesh and thick solid blackout fabric, zebra pattern window blinds, with photographic fabric textures`;
            } else {
              blindStyleDesc = `zebra roller blinds, dual-layer roller shade with alternating horizontal stripes of sheer mesh and solid light-filtering fabric, zebra pattern window blinds, with photographic fabric textures`;
            }
          } else if (style === 'wood_venetian' || style === 'metal_venetian') {
            const material = style === 'wood_venetian' ? 'wooden timber' : 'aluminum metal';
            if (opacity === 'blackout') {
              blindStyleDesc = `horizontal ${material} venetian blinds, premium jalousie blinds with adjustable slats, the slats are fully closed and tilted shut to block out all incoming daylight, fitted inside the window casing, with realistic physical texture`;
            } else if (opacity === 'sheer') {
              blindStyleDesc = `horizontal ${material} venetian blinds, premium jalousie blinds with adjustable slats, the slats are fully open and tilted horizontally to let maximum sunlight stream in, fitted inside the window casing, with realistic physical texture`;
            } else {
              blindStyleDesc = `horizontal ${material} venetian blinds, premium jalousie blinds with adjustable slats, the slats are tilted partially open to filter the light, fitted inside the window casing, with realistic physical texture`;
            }
          } else if (style === 'dk') {
            if (opacity === 'blackout') {
              blindStyleDesc = `modern vertical day and night blinds, DK vertical sheer and thick blackout fabric slats, slats are turned to the closed blackout position to block all light, with realistic vertical slat textures`;
            } else {
              blindStyleDesc = `modern vertical day and night blinds, DK vertical sheer and opaque fabric slats, vertical zebra style panels, with realistic vertical slat textures`;
            }
          }

          return `Edit this photo of the room to add a new custom-fit ${colorDesc.toUpperCase()} (${colorHex}) ${blindStyleDesc} inside the window frame. The blinds must be neatly installed, precisely fitted to the window's exact size, looking clean and realistic. The blinds fabric is ${opacityPrompts[opacity]}. The slats, shadows, and light filtering must match the room's window size. ${lightingInstruction} ${qualityDirectives}`;
        }

        // Curtains
        const fabricDesc = fabricPrompts[fabric];
        const styleDesc = stylePrompts[style];
        const opacityDesc = opacityPrompts[opacity];

        let positionInstruction = '';
        if (curtainPosition === 'closed') {
          positionInstruction = `In this photo, REPLACE the window view by completely covering the entire window with a CLOSED, SHUT, solid ${colorDesc.toUpperCase()} (${colorHex}) curtain. The curtain panels MUST be drawn completely closed and shut, meeting tightly in the center. The curtain fabric MUST cover the entire window from the left edge to the right edge. The window glass, window frame, and background view MUST be fully covered and hidden behind the solid continuous curtain fabric, with absolutely no center gap, no opening, and no window visible.`;
        } else {
          // half_open
          if (addTulle) {
            positionInstruction = `In this photo, add a ${colorDesc.toUpperCase()} (${colorHex}) curtain on the sides of the window, and REPLACE the center window glass with a sheer white tulle layer. The main curtain panels are drawn open, gathered and bunched at the left and right edges of the window. In the center, fully covering the window glass, there is a sheer white tulle layer with fine mesh netting (sheer lace layer) that filters the daylight. The sheer tulle curtain covers the middle of the window glass, while the main curtains are on the sides.`;
          } else {
            positionInstruction = `In this photo, add a ${colorDesc.toUpperCase()} (${colorHex}) curtain on the sides of the window. The curtain panels are drawn open, gathered and bunched at the left and right edges of the window. The center of the window is fully open and exposed, showing the clear window glass with daylight streaming through, and no tulle or sheer layer.`;
          }
        }

        let barInstruction = '';
        if (barStyle === 'hidden') {
          barInstruction = `The curtains must hang from a completely hidden, invisible ceiling track mount. The fabric emerges directly from a clean narrow gap in the ceiling. There must be no visible curtain rod, no metal pole, no rings, no finials, and no brackets above the window. The wall above the window is completely empty and clean, and the curtain is flush with the ceiling.`;
        } else if (barStyle === 'wood_bar') {
          barInstruction = `Mount the curtains from a highly visible, prominent decorative wooden curtain rod installed on the wall above the window. The wooden rod has ornate wood finials on both ends and wooden brackets, with a rich warm wood grain finish. The rod and brackets are clearly visible.`;
        } else if (barStyle === 'metal_bar') {
          barInstruction = `Mount the curtains from a highly visible, prominent decorative wrought iron curtain rod installed on the wall above the window. The rod has elegant ornate metal finials on both ends and iron brackets, with a polished metallic black or brass finish. The rod and brackets are clearly visible.`;
        } else if (barStyle === 'modern_bar') {
          barInstruction = `Mount the curtains from a highly visible, prominent sleek minimalist modern curtain rod installed on the wall above the window. The modern rod has clean geometric finials and slim metal brackets in a brushed steel or matte black finish. The rod and brackets are clearly visible.`;
        }

        // Tulle layer behind if closed
        const tulleLayerBehind = (addTulle && curtainPosition === 'closed') 
          ? ' A secondary layer of sheer white tulle is installed behind the closed main curtain, close to the window glass (mostly hidden by the closed main curtain).'
          : '';

        return `${positionInstruction}
The curtain must be a custom-fit ${colorDesc.toUpperCase()} curtain made of ${fabricDesc} in a ${styleDesc} style. The curtain fabric is ${opacityDesc}.${tulleLayerBehind}
${barInstruction}
${lightingInstruction} High-resolution architectural photography, photorealistic interior design.`;
      };

      const prompt = getCohesivePrompt();

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

      <div className="container container--wide">
        <div className="workspace-head">
          <h1 className="section-title">صمّم ستارتك الآن</h1>
          
          {/* Steps Progress Indicator */}
          <div className="workspace-steps">
            <div className={`workspace-step ${originalImageSrc ? 'completed' : 'active'}`}>
              <div className="step-badge">١</div>
              <span className="step-label">ارفع صورة غرفتك</span>
              <div className="step-connector"></div>
            </div>
            <div className={`workspace-step ${originalImageSrc && !generatedImageSrc ? 'active' : ''} ${generatedImageSrc ? 'completed' : ''}`}>
              <div className="step-badge">٢</div>
              <span className="step-label">اختر الخيارات وولّد</span>
              <div className="step-connector"></div>
            </div>
            <div className={`workspace-step ${generatedImageSrc ? 'active' : ''}`}>
              <div className="step-badge">٣</div>
              <span className="step-label">قارن وحمّل النتيجة</span>
            </div>
          </div>
        </div>

        <div className="studio" style={{ '--stage-glow': '#ffffff' } as React.CSSProperties}>
          
          {/* Column 1: Right Panel - المظهر والخامة */}
          <section className="studio-side studio-side--right" aria-label="خيارات المظهر والخامة">
            <h2 className="side-title">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m12 2 8.5 5L12 12 3.5 7 12 2Z"></path>
                <path d="m3.5 12 8.5 5 8.5-5"></path>
                <path d="m3.5 17 8.5 5 8.5-5"></path>
              </svg>
              <span>المظهر والخامة</span>
            </h2>

            {/* Style Selection */}
            <div className="form-group">
              <span className="form-label" id="style-label">الطراز</span>
              <div className="chip-grid" role="group" aria-labelledby="style-label">
                {Object.keys(styleNames).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`chip ${style === key ? 'selected' : ''}`}
                    onClick={() => setStyle(key)}
                    aria-pressed={style === key}
                  >
                    {styleNames[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Selection */}
            <div className="form-group">
              <span className="form-label" id="fabric-label">نوع القماش</span>
              <div className="chip-grid" role="group" aria-labelledby="fabric-label">
                {isBlindStyle(style) ? (
                  <button type="button" className="chip selected" disabled>
                    تلقائي للموديل
                  </button>
                ) : (
                  Object.keys(fabricNames).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`chip ${fabric === key ? 'selected' : ''}`}
                      onClick={() => setFabric(key)}
                      aria-pressed={fabric === key}
                    >
                      {fabricNames[key]}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="form-group">
              <span className="form-label" id="color-label">اللون المفضل</span>
              <div className="color-swatches" role="group" aria-labelledby="color-label">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`swatch-btn ${selectedColor === c.id ? 'selected' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.id)}
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={selectedColor === c.id}
                  >
                    {selectedColor === c.id && (
                      <svg className={`swatch-check ${c.id === 'white' || c.id === 'beige' ? 'swatch-check--dark' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <span className="form-hint">
                اللون المختار: {colors.find(c => c.id === selectedColor)?.name}
              </span>
            </div>
          </section>

          {/* Column 2: Center - Studio Stage */}
          <section className="studio-stage" aria-label="رفع الصورة والتوليد">
            <div className="stage-header">
              <span className="stage-status" aria-live="polite">
                <span className={`stage-status-dot ${originalImageSrc ? 'is-ready' : ''} ${generatedImageSrc ? 'is-done' : ''} ${loading ? 'is-busy' : ''}`} aria-hidden="true"></span>
                <span>
                  {loading 
                    ? "جاري الاتصال بخادم الذكاء الاصطناعي..." 
                    : generatedImageSrc 
                      ? "تم تصميم ستارتك بنجاح! 🎉" 
                      : originalImageSrc 
                        ? "تم رفع الصورة! حدد الخيارات واضغط توليد" 
                        : "ارفع صورة نافذتك لتبدأ"}
                </span>
              </span>
              {originalImageSrc && (
                <button className="stage-reset" onClick={resetWorkspace}>
                  تصميم جديد ↻
                </button>
              )}
            </div>

            <div className="stage-canvas">
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
                >
                  <svg className="dropzone-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 20V11a7 7 0 0 1 14 0v9" />
                    <path d="M4 20h16" />
                    <path d="M12 15V8" />
                    <path d="m9 11 3-3 3 3" />
                  </svg>
                  <h3>اسحب صورة نافذتك إلى هنا</h3>
                  <p>أو اضغط لاختيار صورة من جهازك</p>
                  <span className="btn btn-secondary" style={{ pointerEvents: 'none', marginTop: '8px', fontSize: '13px' }}>
                    اختر صورة
                  </span>
                  <button 
                    type="button"
                    className="dropzone-sample"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadReadyImage();
                    }}
                  >
                    أو جرّب بصورة جاهزة
                  </button>
                  <span className="dropzone-formats">
                    PNG أو JPG – حتى ١٠ ميجابايت
                  </span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={(e) => { if (e.target.files?.length) handleImageFile(e.target.files[0]); }}
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    aria-label="رفع صورة النافذة"
                  />
                </div>
              )}

              {/* Source Image Display */}
              {originalImageSrc && !generatedImageSrc && (
                <img src={originalImageSrc} className="editor-image" alt="النافذة المرفوعة" />
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
                <div className="loading-overlay">
                  <div className="curtain-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p className="loading-text">{loadingMessage}</p>
                  <span className="loading-note">قد يستغرق ذلك حوالي ٢٠-٣٠ ثانية. يرجى الانتظار...</span>
                </div>
              )}
            </div>
            
            {/* Stage Dock: Summary & Action Buttons */}
            <div className="stage-dock">
              {originalImageSrc && (
                <div className="dock-summary" aria-live="polite">
                  <span className="dock-tag">{styleNames[style]}</span>
                  {!isBlindStyle(style) && <span className="dock-tag">{fabricNames[fabric]}</span>}
                  <span className="dock-tag">
                    <span className="dock-swatch" style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }} aria-hidden="true"></span>
                    {colors.find(c => c.id === selectedColor)?.name}
                  </span>
                  {!isBlindStyle(style) && <span className="dock-tag">{barNames[barStyle].replace(/🪵 |⚙️ |✦ |🔲 /g, '')}</span>}
                  {!isBlindStyle(style) && <span className="dock-tag">{positionNames[curtainPosition]}</span>}
                  {!isBlindStyle(style) && addTulle && <span className="dock-tag">مع طبقة تول</span>}
                  <span className="dock-tag">{opacityNames[opacity]}</span>
                </div>
              )}

              {originalImageSrc && generatedImageSrc ? (
                <div className="dock-actions">
                  <span className="dock-compare-hint">
                    اسحب المقبض في المنتصف لمقارنة التصميم الجديد بالنافذة الأصلية.
                  </span>
                  <button className="btn btn-primary" id="btn-download" onClick={handleDownload} style={{ padding: '10px 24px', fontWeight: 600 }}>
                    تحميل التصميم 💾
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    type="button"
                    className="btn-generate"
                    onClick={triggerGenerate} 
                    disabled={!originalImageSrc || loading}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                      <path d="M20 3v4"></path>
                      <path d="M22 5h-4"></path>
                    </svg>
                    <span>ولّد التصميم</span>
                  </button>
                  {!originalImageSrc && (
                    <span className="dock-hint">ارفع صورة نافذتك لتتمكن من التوليد.</span>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Column 3: Left Panel - التركيب والإضاءة */}
          <section className="studio-side studio-side--left" aria-label="خيارات التركيب والإضاءة">
            <h2 className="side-title">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <span>التركيب والإضاءة</span>
            </h2>
            
            {/* Decorative Bar Selection */}
            <div className="form-group">
              <span className="form-label">ديكور البار (طريقة التركيب)</span>
              <div className="chip-grid">
                {isBlindStyle(style) ? (
                  <button type="button" className="chip selected" disabled>
                    بدون بار (تلقائي للبلايند)
                  </button>
                ) : (
                  Object.keys(barNames).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`chip ${barStyle === key ? 'selected' : ''}`}
                      onClick={() => setBarStyle(key)}
                      aria-pressed={barStyle === key}
                    >
                      {barNames[key]}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Curtain Position */}
            <div className="form-group">
              <span className="form-label">وضعية الستارة</span>
              <div className="chip-grid">
                {isBlindStyle(style) ? (
                  <button type="button" className="chip selected" disabled>
                    تلقائي للبلايند
                  </button>
                ) : (
                  Object.keys(positionNames).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`chip ${curtainPosition === key ? 'selected' : ''}`}
                      onClick={() => setCurtainPosition(key)}
                      aria-pressed={curtainPosition === key}
                    >
                      {positionNames[key]}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Add Tulle Toggle */}
            <div className="form-group">
              <span className="form-label">إضافة طبقة تول خلف الستارة</span>
              <div className="chip-grid">
                {isBlindStyle(style) ? (
                  <button type="button" className="chip selected" disabled>
                    غير متاح للبلايند
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`chip ${!addTulle ? 'selected' : ''}`}
                      onClick={() => setAddTulle(false)}
                      aria-pressed={!addTulle}
                    >
                      بدون تول
                    </button>
                    <button
                      type="button"
                      className={`chip ${addTulle ? 'selected' : ''}`}
                      onClick={() => setAddTulle(true)}
                      aria-pressed={addTulle}
                    >
                      ✨ إضافة تول
                    </button>
                  </>
                )}
              </div>
              {addTulle && !isBlindStyle(style) && (
                <span className="form-hint" style={{ color: 'var(--blue)' }}>
                  💡 اختر وضعية الستارة "مفتوحة عالنص" لإظهار التول بوضوح مع أشعة الشمس.
                </span>
              )}
            </div>

            {/* Opacity Selection */}
            <div className="form-group">
              <span className="form-label">درجة التعتيم وترشيح الضوء</span>
              <div className="chip-grid">
                {Object.keys(opacityNames).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`chip ${opacity === key ? 'selected' : ''}`}
                    onClick={() => setOpacity(key)}
                    aria-pressed={opacity === key}
                  >
                    {opacityNames[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="tips-box">
              <h4>💡 للحصول على أفضل نتيجة:</h4>
              <ul className="tips-list">
                <li>صوّر النافذة كاملة بإضاءة نهارية واضحة.</li>
                <li>تجنّب الصور المائلة جداً أو شديدة الظلام.</li>
                <li>لإظهار التول، اختر "مفتوحة عالنص" مع تفعيل التول.</li>
              </ul>
            </div>
          </section>
          
        </div>
      </div>

      <Footer />
    </>
  );
}

