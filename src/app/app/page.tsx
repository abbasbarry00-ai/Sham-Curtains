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
  wave: "modern wave fold ripple fold curtain, elegant continuous uniform s-curve vertical folds, sleek architectural draping",
  pleated: "tailored pleated curtain, crisp structured vertical fabric folds, neat tailoring",
  gathered: "tightly gathered rod pocket curtain, bunched fabric firmly gathered at the top header, soft dense continuous ruffles",
  pinch: "classic American pinch pleat custom curtain, rigid tailored 3-finger pinch folds firmly sewn at the top header, elegant traditional drape",
  sunscreen: "sleek architectural sunscreen roller blind, ONE single completely flat continuous vertical translucent fabric sheet, smooth surface, NO folds, NO wrinkles",
  blackout: "premium heavy suede chamois blackout curtain, 100% opaque thick matte texture, heavy vertical drop, straight hem",
  dk: "modern day and night double roller blind system, flat clean architectural window covering, flat vertical surface",
  classic_rod: "classic eyelet grommet curtain, large metal rings cleanly threaded through a thick visible horizontal metal pipe rod, deep wavy folds",
  zebra: "modern zebra blind, flat alternating horizontal translucent and solid opaque fabric stripes, straight flat surface, NO folds",
  wood_venetian: "luxurious wooden horizontal Venetian blinds, distinct thick natural wood horizontal slats, architectural window treatment",
  metal_venetian: "sleek architectural aluminum mini Venetian blinds, thin sharp horizontal metal slats, modern minimalist style",
  side_pull: "elegant drapery smoothly swept to the outer sides and tightly secured with decorative fabric tie-backs, sweeping curved drape opening clearly in the center",
  stage: "grand theatrical drape, heavy luxurious dramatic curtains with extremely deep rich vertical pleats, opulent thick hanging, extreme fabric fullness"
};

const blindStyles = ['sunscreen', 'dk', 'zebra', 'wood_venetian', 'metal_venetian'];
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

  // Layout revamp states
  const [activeStep, setActiveStep] = useState<number>(1);
  const [styleCategory, setStyleCategory] = useState<'fabric' | 'roller'>('fabric');

  const toggleStep = (stepNumber: number) => {
    setActiveStep(activeStep === stepNumber ? 0 : stepNumber);
  };

  const handleCategoryChange = (cat: 'fabric' | 'roller') => {
    setStyleCategory(cat);
    if (cat === 'fabric' && isBlindStyle(style)) {
      setStyle('wave');
    } else if (cat === 'roller' && !isBlindStyle(style)) {
      setStyle('sunscreen');
    }
  };

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
          const blindStyleDesc = stylePrompts[style];
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
          style: styleNames[style],
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
          
          {/* Column 1: Right Sidebar - Consolidated Options panel */}
          <aside className="studio-sidebar" aria-label="خيارات التصميم">
            
            {/* Accordion system */}
            <div className="accordion">
              
              {/* Step 1: المظهر والطراز */}
              <div className={`accordion-item ${activeStep === 1 ? 'active' : ''}`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(1)}
                  aria-expanded={activeStep === 1}
                >
                  <span className="accordion-header-title">
                    <span>١. المظهر والطراز</span>
                  </span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 1 && (
                  <div className="accordion-content">
                    <div className="category-tabs">
                      <button 
                        type="button" 
                        className={`category-tab ${styleCategory === 'fabric' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('fabric')}
                      >
                        🧵 ستائر قماشية
                      </button>
                      <button 
                        type="button" 
                        className={`category-tab ${styleCategory === 'roller' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('roller')}
                      >
                        ⚙️ رول وجالوزي
                      </button>
                    </div>
                    
                    <div className="option-grid">
                      {styleCategory === 'fabric' ? (
                        <>
                          <button
                            type="button"
                            className={`option-card ${style === 'wave' ? 'selected' : ''}`}
                            onClick={() => setStyle('wave')}
                          >
                            <span className="option-card-title">ويفي</span>
                            <span className="option-card-subtitle">Ripple Fold</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'pleated' ? 'selected' : ''}`}
                            onClick={() => setStyle('pleated')}
                          >
                            <span className="option-card-title">كسرات</span>
                            <span className="option-card-subtitle">Pleated</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'gathered' ? 'selected' : ''}`}
                            onClick={() => setStyle('gathered')}
                          >
                            <span className="option-card-title">زم</span>
                            <span className="option-card-subtitle">Rod Pocket</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'pinch' ? 'selected' : ''}`}
                            onClick={() => setStyle('pinch')}
                          >
                            <span className="option-card-title">تكسير أمريكي</span>
                            <span className="option-card-subtitle">Pinch Pleat</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'classic_rod' ? 'selected' : ''}`}
                            onClick={() => setStyle('classic_rod')}
                          >
                            <span className="option-card-title">كلاسيك بوري</span>
                            <span className="option-card-subtitle">Eyelet Grommet</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'side_pull' ? 'selected' : ''}`}
                            onClick={() => setStyle('side_pull')}
                          >
                            <span className="option-card-title">رفعات جانبية</span>
                            <span className="option-card-subtitle">Sweep Pull</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'stage' ? 'selected' : ''}`}
                            onClick={() => setStyle('stage')}
                          >
                            <span className="option-card-title">مسرحي كسرات</span>
                            <span className="option-card-subtitle">Theatrical</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'blackout' ? 'selected' : ''}`}
                            onClick={() => setStyle('blackout')}
                          >
                            <span className="option-card-title">بلاك آوت شامواه</span>
                            <span className="option-card-subtitle">Suede Blackout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`option-card ${style === 'sunscreen' ? 'selected' : ''}`}
                            onClick={() => setStyle('sunscreen')}
                          >
                            <span className="option-card-title">رول سنسكرين</span>
                            <span className="option-card-subtitle">Sunscreen</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'dk' ? 'selected' : ''}`}
                            onClick={() => setStyle('dk')}
                          >
                            <span className="option-card-title">دي كي (DK)</span>
                            <span className="option-card-subtitle">Double Roller</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'zebra' ? 'selected' : ''}`}
                            onClick={() => setStyle('zebra')}
                          >
                            <span className="option-card-title">رول زيبرا</span>
                            <span className="option-card-subtitle">Zebra Roller</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'wood_venetian' ? 'selected' : ''}`}
                            onClick={() => setStyle('wood_venetian')}
                          >
                            <span className="option-card-title">جالوزي خشبي</span>
                            <span className="option-card-subtitle">Wood Venetian</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${style === 'metal_venetian' ? 'selected' : ''}`}
                            onClick={() => setStyle('metal_venetian')}
                          >
                            <span className="option-card-title">جالوزي معدني</span>
                            <span className="option-card-subtitle">Alum Venetian</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: القماش والتعتيم */}
              <div className={`accordion-item ${activeStep === 2 ? 'active' : ''}`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(2)}
                  aria-expanded={activeStep === 2}
                >
                  <span className="accordion-header-title">
                    <span>٢. القماش والتعتيم</span>
                  </span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 2 && (
                  <div className="accordion-content">
                    {/* Fabric Selection */}
                    <div className="form-group">
                      <span className="form-label">نوع القماش</span>
                      {isBlindStyle(style) ? (
                        <div className="option-card disabled">
                          <span className="option-card-title">تلقائي للموديل</span>
                          <span className="option-card-subtitle">Auto fabric for blinds</span>
                        </div>
                      ) : (
                        <div className="option-grid">
                          {Object.keys(fabricNames).map((key) => (
                            <button
                              key={key}
                              type="button"
                              className={`option-card ${fabric === key ? 'selected' : ''}`}
                              onClick={() => setFabric(key)}
                            >
                              <span className="option-card-title">{fabricNames[key]}</span>
                              <span className="option-card-subtitle">
                                {key === 'velvet' ? 'Velvet' : key === 'linen' ? 'Linen' : key === 'silk' ? 'Silk' : key === 'cotton' ? 'Cotton' : 'Lace'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Color Selection */}
                    <div className="form-group">
                      <span className="form-label">اللون المفضل</span>
                      <div className="color-swatch-grid">
                        {colors.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className={`swatch-btn ${selectedColor === c.id ? 'selected' : ''}`}
                            style={{ backgroundColor: c.hex, width: '100%', aspectRatio: '1/1', borderRadius: '50%' }}
                            onClick={() => setSelectedColor(c.id)}
                            title={c.name}
                            aria-label={c.name}
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

                    {/* Opacity Selection */}
                    <div className="form-group">
                      <span className="form-label">درجة التعتيم وترشيح الضوء</span>
                      <div className="option-grid">
                        {Object.keys(opacityNames).map((key) => (
                          <button
                            key={key}
                            type="button"
                            className={`option-card ${opacity === key ? 'selected' : ''}`}
                            onClick={() => setOpacity(key)}
                          >
                            <span className="option-card-title">{opacityNames[key]}</span>
                            <span className="option-card-subtitle">
                              {key === 'sheer' ? 'Sheer' : key === 'semi' ? 'Semi-Opaque' : 'Blackout'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: الملحقات */}
              <div className={`accordion-item ${activeStep === 3 ? 'active' : ''}`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(3)}
                  aria-expanded={activeStep === 3}
                >
                  <span className="accordion-header-title">
                    <span>٣. الملحقات والإضافات</span>
                  </span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 3 && (
                  <div className="accordion-content">
                    {/* Decorative Bar Selection */}
                    <div className="form-group">
                      <span className="form-label">ديكور البار (طريقة التركيب)</span>
                      {isBlindStyle(style) ? (
                        <div className="option-card disabled">
                          <span className="option-card-title">غير متاح للرول</span>
                          <span className="option-card-subtitle">Not applicable for blinds</span>
                        </div>
                      ) : (
                        <div className="option-grid">
                          {Object.keys(barNames).map((key) => (
                            <button
                              key={key}
                              type="button"
                              className={`option-card ${barStyle === key ? 'selected' : ''}`}
                              onClick={() => setBarStyle(key)}
                            >
                              <span className="option-card-title">{barNames[key].replace(/🪵 |⚙️ |✦ |🔲 /g, '')}</span>
                              <span className="option-card-subtitle">
                                {key === 'wood_bar' ? 'Wood Bar' : key === 'metal_bar' ? 'Iron Bar' : key === 'modern_bar' ? 'Modern Bar' : 'Hidden Track'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Tulle Toggle */}
                    <div className="form-group">
                      <span className="form-label">إضافة طبقة تول خلف الستارة</span>
                      {isBlindStyle(style) ? (
                        <div className="option-card disabled">
                          <span className="option-card-title">غير متاح للرول</span>
                          <span className="option-card-subtitle">Not applicable for blinds</span>
                        </div>
                      ) : (
                        <div className="option-grid">
                          <button
                            type="button"
                            className={`option-card ${!addTulle ? 'selected' : ''}`}
                            onClick={() => setAddTulle(false)}
                          >
                            <span className="option-card-title">بدون تول</span>
                            <span className="option-card-subtitle">No Sheer Tulle</span>
                          </button>
                          <button
                            type="button"
                            className={`option-card ${addTulle ? 'selected' : ''}`}
                            onClick={() => setAddTulle(true)}
                          >
                            <span className="option-card-title">إضافة تول ✨</span>
                            <span className="option-card-subtitle">Add Sheer Layer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: المعاينة والوضعية */}
              <div className={`accordion-item ${activeStep === 4 ? 'active' : ''}`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(4)}
                  aria-expanded={activeStep === 4}
                >
                  <span className="accordion-header-title">
                    <span>٤. المعاينة والوضعية</span>
                  </span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 4 && (
                  <div className="accordion-content">
                    {/* Curtain Position */}
                    <div className="form-group">
                      <span className="form-label">وضعية الستارة</span>
                      {isBlindStyle(style) ? (
                        <div className="option-card disabled">
                          <span className="option-card-title">تلقائي للموديل</span>
                          <span className="option-card-subtitle">Auto position for blinds</span>
                        </div>
                      ) : (
                        <div className="option-grid">
                          {Object.keys(positionNames).map((key) => (
                            <button
                              key={key}
                              type="button"
                              className={`option-card ${curtainPosition === key ? 'selected' : ''}`}
                              onClick={() => setCurtainPosition(key)}
                            >
                              <span className="option-card-title">{positionNames[key]}</span>
                              <span className="option-card-subtitle">
                                {key === 'closed' ? 'Closed panels' : 'Half open panels'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tips Box inside Step 4 */}
                    <div className="tips-box" style={{ marginTop: '8px' }}>
                      <h4>💡 للحصول على أفضل نتيجة:</h4>
                      <ul className="tips-list">
                        <li>صوّر النافذة كاملة بإضاءة نهارية واضحة.</li>
                        <li>تجنّب الصور المائلة جداً أو شديدة الظلام.</li>
                        <li>لإظهار التول، اختر "مفتوحة عالنص" مع تفعيل التول.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar Dock: Action Buttons & Selected Options Summary */}
            <div className="sidebar-dock" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              {originalImageSrc && (
                <div className="dock-summary" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{styleNames[style]}</span>
                  {!isBlindStyle(style) && <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{fabricNames[fabric]}</span>}
                  <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span className="dock-swatch" style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }} aria-hidden="true"></span>
                    {colors.find(c => c.id === selectedColor)?.name}
                  </span>
                  {!isBlindStyle(style) && <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{barNames[barStyle].replace(/🪵 |⚙️ |✦ |🔲 /g, '')}</span>}
                  {!isBlindStyle(style) && <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{positionNames[curtainPosition]}</span>}
                  {!isBlindStyle(style) && addTulle && <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>مع تول</span>}
                  <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{opacityNames[opacity]}</span>
                </div>
              )}

              {originalImageSrc && generatedImageSrc ? (
                <div className="dock-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span className="dock-compare-hint" style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
                    اسحب المقبض في المنتصف لمقارنة التصميم الجديد بالنافذة الأصلية.
                  </span>
                  <button className="btn btn-primary" id="btn-download" onClick={handleDownload} style={{ width: '100%', padding: '12px', fontWeight: 700 }}>
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
                    style={{ width: '100%', padding: '14px', borderRadius: '980px', fontWeight: 700 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                      <path d="M20 3v4"></path>
                      <path d="M22 5h-4"></path>
                    </svg>
                    <span>ولّد التصميم</span>
                  </button>
                  {!originalImageSrc && (
                    <span className="dock-hint" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>ارفع صورة نافذتك لتتمكن من التوليد.</span>
                  )}
                </>
              )}
            </div>

          </aside>

          {/* Column 2: Left/Center - Studio Stage */}
          <section className="studio-stage" aria-label="معاينة الصورة والتوليد">
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
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

