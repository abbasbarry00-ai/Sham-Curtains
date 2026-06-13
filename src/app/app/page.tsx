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
  wood_bar: "The curtains hang from a thick, highly visible decorative classic wooden curtain pole mounted above the window, featuring a warm natural wood grain finish (such as oak, walnut, or mahogany) with elegant carved wooden finials on both ends.",
  wood_rail: "The curtains are mounted behind a highly visible decorative wooden valance pelmet box (wood cover frame or crown molding cornice box) running horizontally above the window. The wood box has a clean, premium painted finish (smooth matte white or natural wood grain veneer) that completely covers the top of the curtains and track, giving a neat, custom architectural look where the curtains drop gracefully from behind the wooden cover panel.",
  metal_bar: "The curtains MUST hang from a prominent, highly visible luxury decorative metal double curtain rod mounted on the wall. The main rod has a refined metallic finish (antique brass, polished gold, or brushed bronze) with ornate, intricately carved hollow filigree grid ball finials or detailed scrollwork finials on the ends. The curtain panels are suspended from visible metal rings with small metal drapery clips holding the fabric gathered in crisp ripples.",
  modern_bar: "The curtains hang from a highly visible modern white or metallic double track profile rail mounted on the wall or ceiling above the window. The tracks are sleek with flat geometric endpoints, and the curtain fabric hangs cleanly from small white gliders/hooks sliding smoothly inside the horizontal tracks.",
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
  wood_bar: 'بار خشبي ديكور',
  wood_rail: 'rail خشبي ديكور',
  metal_bar: 'بار حديد مزخرف',
  modern_bar: 'بار مودرن بسيط',
  hidden: 'سكة مخفية (بدون بار)'
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
  const [customColor, setCustomColor] = useState('#c0a080'); // custom hex from palette
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
  const [isMagicMode, setIsMagicMode] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('magic') === 'true' || params.get('mode') === 'magic') {
        setIsMagicMode(true);
        // Automatically trigger file upload on page load if no image is uploaded
        if (!originalImageSrc) {
          setTimeout(() => {
            fileInputRef.current?.click();
          }, 350);
        }
      }
    }
  }, []);

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
        setLoadingMessage(isMagicMode 
          ? 'يقوم الذكاء الاصطناعي بتحليل الإضاءة والألوان لاختيار الستارة المثالية...' 
          : 'جاري معالجة الصورة وضغطها...');
        
        try {
          const resized = await getResizedImageBase64(rawBase64, 1024);
          setOriginalImageSrc(resized);
          if (isMagicMode) {
            await triggerGenerate(resized);
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          setOriginalImageSrc(rawBase64);
          if (isMagicMode) {
            await triggerGenerate(rawBase64);
          } else {
            setLoading(false);
          }
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

  const triggerGenerate = async (overrideImage?: string) => {
    const imageToUse = overrideImage || originalImageSrc;
    if (!imageToUse) return;

    setLoading(true);
    setLoadingMessage(isMagicMode 
      ? 'يقوم الذكاء الاصطناعي بتحليل الإضاءة والألوان لاختيار الستارة المثالية...' 
      : 'جاري الاتصال بخادم الذكاء الاصطناعي... قد يستغرق ذلك 20-30 ثانية');

    try {
      const getCohesivePrompt = () => {
        const activeStyle = isMagicMode ? 'wave' : style;
        const activeFabric = isMagicMode ? 'linen' : fabric;
        const activeColor = isMagicMode ? 'beige' : selectedColor;
        const activeBar = isMagicMode ? 'hidden' : barStyle;
        const activeOpacity = isMagicMode ? 'semi' : opacity;
        const activePosition = isMagicMode ? 'closed' : curtainPosition;
        const activeAddTulle = isMagicMode ? true : addTulle;

        // Colors & Prompts setup
        let colorDesc = '';
        let colorHex = '';
        if (!isMagicMode && selectedColor === 'custom') {
          colorHex = customColor;
          colorDesc = `exact custom color with hex code ${colorHex}`;
        } else {
          const colorObj = colors.find(c => c.id === activeColor);
          colorHex = colorObj ? colorObj.hex : '#ffffff';
          colorDesc = colorPrompts[activeColor] ?? 'pure solid color';
        }

        const fabricDesc = fabricPrompts[activeFabric];
        const styleDesc = stylePrompts[activeStyle];
        const opacityDesc = opacityPrompts[activeOpacity];

        // 1. Hardware First (Must be at the absolute top)
        let barInstruction = '';
        if (activeBar === 'hidden') barInstruction = `Curtains dropping seamlessly from a recessed architectural ceiling slit. Minimalist interior design. The curtain fabric flows directly from the pristine, flat ceiling downwards.`;
        else if (activeBar === 'wood_bar') barInstruction = `Classic thick oak wood curtain rod mounted on the wall above the window. The wooden pole features intricately carved traditional wood finials on both ends. Rich natural wood grain finish.`;
        else if (activeBar === 'wood_rail') barInstruction = `Curtains falling elegantly from behind a minimalist painted wooden pelmet box. Architectural window cornice board covering the top header of the curtains.`;
        else if (activeBar === 'metal_bar') barInstruction = `Luxury antique brass metal curtain rod mounted above the window. The rod features ornate, intricately carved hollow filigree ball finials.`;
        else if (activeBar === 'modern_bar') barInstruction = `Sleek modern white aluminum curtain track rail mounted on the ceiling. Minimalist low-profile track system, flat geometric design.`;

        // 2. Strict Layering Logic (Separating Main Curtain from Tulle)
        let positionInstruction = '';
        let tulleInstruction = '';

        if (activePosition === 'closed') {
          positionInstruction = `The main solid curtain panels are fully CLOSED and shut, meeting tightly in the center, completely covering the entire window from edge to edge.`;
          tulleInstruction = activeAddTulle ? `A secondary layer of sheer white tulle is installed hidden behind the closed main curtain.` : ``;
        } else {
          positionInstruction = `The main solid curtain panels are drawn OPEN, gathered and neatly bunched at the left and right edges of the window frame.`;
          tulleInstruction = activeAddTulle ? `DOUBLE-LAYERED TREATMENT: Behind the main side drapes, the center window glass is completely covered by a separate, delicate sheer white tulle layer.` : `The center window glass is clear and exposed with no tulle layer.`;
        }

        // 3. Constructing the final Positive Prompt
        const positivePrompt = `${barInstruction}
A photorealistic architectural interior photograph. 
MAIN CURTAINS: ${positionInstruction} These main curtains are a custom-fit ${colorDesc.toUpperCase()} (${colorHex}) made of ${fabricDesc} in a ${styleDesc} style. The main curtain fabric is strictly a ${opacityDesc} (NOT sheer lace).
SECONDARY LAYER: ${tulleInstruction}
Lighting is natural and matches the high-end interior.`;

        // 4. Strict Negative Prompt (Separated)
        const negativePrompt = "floating rods, multiple poles, double rods, floating finials, crooked rods, disconnected brackets, messy rings, overlapping tracks, curtain rod passing through fabric, architectural errors, impossible physics, broken hardware, empty hooks, wires, cables, 3d render plastic look, cartoon, text, watermarks, messy ceiling, sheer main curtains when solid expected, transparent main drapes.";

        // Return as an object so the API call can use both correctly
        return {
          prompt: positivePrompt,
          negative_prompt: negativePrompt
        };
      };

      const promptObj = getCohesivePrompt();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageToUse,
          prompt: promptObj.prompt,
          negative_prompt: promptObj.negative_prompt,
          style: isMagicMode ? 'ستارة ويفي كتان بيج' : styleNames[style],
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
    if (isMagicMode) {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 350);
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

  const handleDownload = () => {
    if (!generatedImageSrc) return;
    window.location.href = `/api/download?url=${encodeURIComponent(generatedImageSrc)}`;
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
              <span className="step-label">{isMagicMode ? 'التوليد السحري' : 'اختر الخيارات وولّد'}</span>
              <div className="step-connector"></div>
            </div>
            <div className={`workspace-step ${generatedImageSrc ? 'active' : ''}`}>
              <div className="step-badge">٣</div>
              <span className="step-label">قارن وحمّل النتيجة</span>
            </div>
          </div>
        </div>

        <div className={`studio flex flex-col w-full min-h-screen lg:flex-row lg:h-screen lg:overflow-hidden ${isMagicMode ? 'magic-studio' : ''}`} style={{ '--stage-glow': '#ffffff' } as React.CSSProperties}>
          
          {/* Column 1: Right Sidebar - Consolidated Options panel */}
          {!isMagicMode && (
            <aside className="studio-sidebar relative w-full h-auto flex flex-col lg:w-[30%] lg:h-full lg:overflow-y-auto" aria-label="خيارات التصميم">
            
            {/* Accordion system — no inner scroll on mobile, natural body scroll */}
            <div className="accordion pb-32">
              
              {/* Step 1: المظهر والطراز */}
              <div className={`accordion-item ${activeStep === 1 ? 'active' : ''} border-b border-gray-300 bg-white`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(1)}
                  aria-expanded={activeStep === 1}
                >
                  <span className="font-bold text-black">١. المظهر والطراز</span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 1 && (
                  <div className="accordion-content">
                    <div className="flex w-full mb-4 rounded-none">
                      <button 
                        type="button" 
                        className={`flex-1 py-3 text-center font-bold cursor-pointer rounded-none border-none ${styleCategory === 'fabric' ? 'bg-[#111111] text-white' : 'bg-gray-100 text-[#111111]'}`}
                        onClick={() => handleCategoryChange('fabric')}
                      >
                        ستائر قماشية
                      </button>
                      <button 
                        type="button" 
                        className={`flex-1 py-3 text-center font-bold cursor-pointer rounded-none border-none ${styleCategory === 'roller' ? 'bg-[#111111] text-white' : 'bg-gray-100 text-[#111111]'}`}
                        onClick={() => handleCategoryChange('roller')}
                      >
                        رول وجالوزي
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {styleCategory === 'fabric' ? (
                        <>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'wave' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('wave')}
                          >
                            <span className="font-bold text-sm">ويفي</span>
                            <span className={`text-xs mt-1 ${style === 'wave' ? 'text-gray-300' : 'text-gray-500'}`}>Ripple Fold</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'pleated' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('pleated')}
                          >
                            <span className="font-bold text-sm">كسرات</span>
                            <span className={`text-xs mt-1 ${style === 'pleated' ? 'text-gray-300' : 'text-gray-500'}`}>Pleated</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'gathered' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('gathered')}
                          >
                            <span className="font-bold text-sm">زم</span>
                            <span className={`text-xs mt-1 ${style === 'gathered' ? 'text-gray-300' : 'text-gray-500'}`}>Rod Pocket</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'pinch' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('pinch')}
                          >
                            <span className="font-bold text-sm">تكسير أمريكي</span>
                            <span className={`text-xs mt-1 ${style === 'pinch' ? 'text-gray-300' : 'text-gray-500'}`}>Pinch Pleat</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'classic_rod' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('classic_rod')}
                          >
                            <span className="font-bold text-sm">كلاسيك بوري</span>
                            <span className={`text-xs mt-1 ${style === 'classic_rod' ? 'text-gray-300' : 'text-gray-500'}`}>Eyelet Grommet</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'side_pull' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('side_pull')}
                          >
                            <span className="font-bold text-sm">رفعات جانبية</span>
                            <span className={`text-xs mt-1 ${style === 'side_pull' ? 'text-gray-300' : 'text-gray-500'}`}>Sweep Pull</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'stage' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('stage')}
                          >
                            <span className="font-bold text-sm">مسرحي كسرات</span>
                            <span className={`text-xs mt-1 ${style === 'stage' ? 'text-gray-300' : 'text-gray-500'}`}>Theatrical</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'blackout' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('blackout')}
                          >
                            <span className="font-bold text-sm">بلاك آوت شامواه</span>
                            <span className={`text-xs mt-1 ${style === 'blackout' ? 'text-gray-300' : 'text-gray-500'}`}>Suede Blackout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'sunscreen' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('sunscreen')}
                          >
                            <span className="font-bold text-sm">رول سنسكرين</span>
                            <span className={`text-xs mt-1 ${style === 'sunscreen' ? 'text-gray-300' : 'text-gray-500'}`}>Sunscreen</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'dk' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('dk')}
                          >
                            <span className="font-bold text-sm">دي كي (DK)</span>
                            <span className={`text-xs mt-1 ${style === 'dk' ? 'text-gray-300' : 'text-gray-500'}`}>Double Roller</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'zebra' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('zebra')}
                          >
                            <span className="font-bold text-sm">رول زيبرا</span>
                            <span className={`text-xs mt-1 ${style === 'zebra' ? 'text-gray-300' : 'text-gray-500'}`}>Zebra Roller</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'wood_venetian' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('wood_venetian')}
                          >
                            <span className="font-bold text-sm">جالوزي خشبي</span>
                            <span className={`text-xs mt-1 ${style === 'wood_venetian' ? 'text-gray-300' : 'text-gray-500'}`}>Wood Venetian</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'metal_venetian' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setStyle('metal_venetian')}
                          >
                            <span className="font-bold text-sm">جالوزي معدني</span>
                            <span className={`text-xs mt-1 ${style === 'metal_venetian' ? 'text-gray-300' : 'text-gray-500'}`}>Alum Venetian</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: القماش والتعتيم */}
              <div className={`accordion-item ${activeStep === 2 ? 'active' : ''} border-b border-gray-300 bg-white`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(2)}
                  aria-expanded={activeStep === 2}
                >
                  <span className="font-bold text-black">٢. القماش والتعتيم</span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 2 && (
                  <div className="accordion-content">
                    {/* Fabric Selection */}
                    <div className="form-group mb-4">
                      <span className="form-label font-bold text-black mb-2 block">نوع القماش</span>
                      {isBlindStyle(style) ? (
                        <div className="border border-gray-300 rounded-none p-3 bg-gray-100 text-[#111111]">
                          <span className="font-bold text-sm block">تلقائي للموديل</span>
                          <span className="text-xs text-gray-500 mt-1">Auto fabric for blinds</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.keys(fabricNames).map((key) => (
                            <button
                              key={key}
                              type="button"
                              className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${fabric === key ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                              onClick={() => setFabric(key)}
                            >
                              <span className="font-bold text-sm">{fabricNames[key]}</span>
                              <span className={`text-xs mt-1 ${fabric === key ? 'text-gray-300' : 'text-gray-500'}`}>
                                {key === 'velvet' ? 'Velvet' : key === 'linen' ? 'Linen' : key === 'silk' ? 'Silk' : key === 'cotton' ? 'Cotton' : 'Lace'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Color Selection */}
                    <div className="form-group mb-4">
                      <span className="form-label font-bold text-black mb-2 block">اللون المفضل</span>

                      {/* Preset color squares — 7 per row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '10px' }}>
                        {colors.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedColor(c.id)}
                            title={c.name}
                            aria-label={c.name}
                            style={{
                              backgroundColor: c.hex,
                              width: '100%',
                              aspectRatio: '1/1',
                              borderRadius: '0px',
                              border: selectedColor === c.id ? '2.5px solid #111111' : '1.5px solid #D1D5DB',
                              outline: selectedColor === c.id ? '2px solid #111111' : 'none',
                              outlineOffset: '2px',
                              cursor: 'pointer',
                              position: 'relative',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {selectedColor === c.id && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.id === 'white' || c.id === 'beige' ? '#333' : '#fff'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                            )}
                          </button>
                        ))}

                        {/* Color Palette Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedColor('custom')}
                          title="لوحة الألوان"
                          aria-label="لوحة الألوان"
                          style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            borderRadius: '0px',
                            border: selectedColor === 'custom' ? '2.5px solid #111111' : '1.5px solid #D1D5DB',
                            outline: selectedColor === 'custom' ? '2px solid #111111' : 'none',
                            outlineOffset: '2px',
                            cursor: 'pointer',
                            padding: 0,
                            background: 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00cc00, #0000ff, #8800ff, #ff0000)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          {selectedColor === 'custom' && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Custom Color Picker — shows only when palette selected */}
                      {selectedColor === 'custom' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', padding: '10px', border: '1px solid #E5E7EB', background: '#F9F9F9' }}>
                          <input
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            style={{ width: '44px', height: '44px', border: '1px solid #D1D5DB', borderRadius: '0px', cursor: 'pointer', padding: '2px', background: 'white' }}
                            aria-label="اختر لوناً مخصصاً"
                          />
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111', display: 'block' }}>لون مخصص</span>
                            <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>{customColor.toUpperCase()}</span>
                          </div>
                          <div style={{ flex: 1, height: '44px', background: customColor, border: '1px solid #E5E7EB' }} aria-hidden="true" />
                        </div>
                      )}

                      <span className="form-hint text-xs text-gray-500 mt-1 block">
                        اللون المختار: {selectedColor === 'custom' ? `مخصص ${customColor.toUpperCase()}` : colors.find(c => c.id === selectedColor)?.name}
                      </span>
                    </div>

                    {/* Opacity Selection */}
                    <div className="form-group">
                      <span className="form-label font-bold text-black mb-2 block">درجة التعتيم وترشيح الضوء</span>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.keys(opacityNames).map((key) => (
                          <button
                            key={key}
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${opacity === key ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setOpacity(key)}
                          >
                            <span className="font-bold text-sm">{opacityNames[key]}</span>
                            <span className={`text-xs mt-1 ${opacity === key ? 'text-gray-300' : 'text-gray-500'}`}>
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
              <div className={`accordion-item ${activeStep === 3 ? 'active' : ''} border-b border-gray-300 bg-white`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(3)}
                  aria-expanded={activeStep === 3}
                >
                  <span className="font-bold text-black">٣. الملحقات والإضافات</span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 3 && (
                  <div className="accordion-content">
                    {/* Decorative Bar Selection */}
                    <div className="form-group mb-4">
                      <span className="form-label font-bold text-black mb-2 block">ديكور البار (طريقة التركيب)</span>
                      {isBlindStyle(style) ? (
                        <div className="border border-gray-300 rounded-none p-3 bg-gray-100 text-[#111111]">
                          <span className="font-bold text-sm block">غير متاح للرول</span>
                          <span className="text-xs text-gray-500 mt-1">Not applicable for blinds</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.keys(barNames).map((key) => (
                            <button
                              key={key}
                              type="button"
                              className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${barStyle === key ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                              onClick={() => setBarStyle(key)}
                            >
                              <span className="font-bold text-sm">{barNames[key]}</span>
                              <span className={`text-xs mt-1 ${barStyle === key ? 'text-gray-300' : 'text-gray-500'}`}>
                                {key === 'wood_bar' ? 'Wood Bar' : key === 'wood_rail' ? 'Wood Rail' : key === 'metal_bar' ? 'Iron Bar' : key === 'modern_bar' ? 'Modern Bar' : 'Hidden Track'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Tulle Toggle */}
                    <div className="form-group">
                      <span className="form-label font-bold text-black mb-2 block">إضافة طبقة تول خلف الستارة</span>
                      {isBlindStyle(style) ? (
                        <div className="border border-gray-300 rounded-none p-3 bg-gray-100 text-[#111111]">
                          <span className="font-bold text-sm block">غير متاح للرول</span>
                          <span className="text-xs text-gray-500 mt-1">Not applicable for blinds</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${!addTulle ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setAddTulle(false)}
                          >
                            <span className="font-bold text-sm">بدون تول</span>
                            <span className={`text-xs mt-1 ${!addTulle ? 'text-gray-300' : 'text-gray-500'}`}>No Sheer Tulle</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${addTulle ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => setAddTulle(true)}
                          >
                            <span className="font-bold text-sm">إضافة تول</span>
                            <span className={`text-xs mt-1 ${addTulle ? 'text-gray-300' : 'text-gray-500'}`}>Add Sheer Layer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: المعاينة والوضعية */}
              <div className={`accordion-item ${activeStep === 4 ? 'active' : ''} border-b border-gray-300 bg-white`}>
                <button 
                  type="button" 
                  className="accordion-header" 
                  onClick={() => toggleStep(4)}
                  aria-expanded={activeStep === 4}
                >
                  <span className="font-bold text-black">٤. المعاينة والوضعية</span>
                  <svg className="accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeStep === 4 && (
                  <div className="accordion-content">
                    {/* Curtain Position */}
                    <div className="form-group mb-4">
                      <span className="form-label font-bold text-black mb-2 block">وضعية الستارة</span>
                      {isBlindStyle(style) ? (
                        <div className="border border-gray-300 rounded-none p-3 bg-gray-100 text-[#111111]">
                          <span className="font-bold text-sm block">تلقائي للموديل</span>
                          <span className="text-xs text-gray-500 mt-1">Auto position for blinds</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.keys(positionNames).map((key) => (
                            <button
                              key={key}
                              type="button"
                              className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${curtainPosition === key ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                              onClick={() => setCurtainPosition(key)}
                            >
                              <span className="font-bold text-sm">{positionNames[key]}</span>
                              <span className={`text-xs mt-1 ${curtainPosition === key ? 'text-gray-300' : 'text-gray-500'}`}>
                                {key === 'closed' ? 'Closed panels' : 'Half open panels'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tips Box inside Step 4 */}
                    <div className="tips-box" style={{ marginTop: '8px' }}>
                      <h4>للحصول على أفضل نتيجة:</h4>
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

            {/* ── Desktop Sidebar Dock ── */}
            <div className="sidebar-dock hidden lg:block lg:sticky lg:bottom-0 lg:z-10 w-full" style={{ borderTop: '1px solid var(--border)', padding: '20px 16px', backgroundColor: 'var(--surface)' }}>
              {originalImageSrc && (
                <div className="dock-summary" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{styleNames[style]}</span>
                  {!isBlindStyle(style) && <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{fabricNames[fabric]}</span>}
                  <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span className="dock-swatch" style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }} aria-hidden="true"></span>
                    {colors.find(c => c.id === selectedColor)?.name}
                  </span>
                  {!isBlindStyle(style) && <span className="dock-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>{barNames[barStyle]}</span>}
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
                    تحميل التصميم
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={resetWorkspace} 
                    style={{ width: '100%', padding: '10px', fontWeight: 700, borderRadius: '0px', fontSize: '14px' }}
                  >
                    إعادة التصميم (رفع صورة جديدة)
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-generate"
                    onClick={() => triggerGenerate()}
                    disabled={!originalImageSrc || loading}
                    style={{ width: '100%', padding: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
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
          )}

          {/* ── Fixed-bottom CTA bar (mobile) ── */}
          {!isMagicMode && (
            <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 px-4 py-3 lg:hidden">
              {/* Selected options summary strip */}
              {originalImageSrc && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                  <span className="dock-tag" style={{ fontSize: '10px', padding: '2px 7px' }}>{styleNames[style]}</span>
                  {!isBlindStyle(style) && <span className="dock-tag" style={{ fontSize: '10px', padding: '2px 7px' }}>{fabricNames[fabric]}</span>}
                  <span className="dock-tag" style={{ fontSize: '10px', padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span className="dock-swatch" style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }} aria-hidden="true"></span>
                    {colors.find(c => c.id === selectedColor)?.name}
                  </span>
                  <span className="dock-tag" style={{ fontSize: '10px', padding: '2px 7px' }}>{opacityNames[opacity]}</span>
                </div>
              )}
              {originalImageSrc && generatedImageSrc ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <button className="btn btn-primary" id="btn-download-mobile" onClick={handleDownload} style={{ width: '100%', padding: '12px', fontWeight: 700 }}>
                    تحميل التصميم
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={resetWorkspace} 
                    style={{ width: '100%', padding: '10px', fontWeight: 700, borderRadius: '0px', fontSize: '13px' }}
                  >
                    إعادة تصميم جديدة
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-generate"
                    onClick={() => triggerGenerate()}
                    disabled={!originalImageSrc || loading}
                    style={{ width: '100%', padding: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                      <path d="M20 3v4"></path>
                      <path d="M22 5h-4"></path>
                    </svg>
                    <span>{!originalImageSrc ? 'ارفع صورة أولاً' : 'ولّد التصميم'}</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Column 2: Left/Center - Studio Stage */}
          <section className={`studio-stage w-full relative lg:h-full ${isMagicMode ? 'lg:w-full' : 'lg:w-[70%]'}`} style={{ minHeight: '60vw' }} aria-label="معاينة الصورة والتوليد">
            <div className="stage-header">
              <span className="stage-status" aria-live="polite">
                <span className={`stage-status-dot ${originalImageSrc ? 'is-ready' : ''} ${generatedImageSrc ? 'is-done' : ''} ${loading ? 'is-busy' : ''}`} aria-hidden="true"></span>
                <span>
                  {loading 
                    ? "جاري الاتصال بخادم الذكاء الاصطناعي..." 
                    : generatedImageSrc 
                      ? "تم تصميم ستارتك بنجاح" 
                      : originalImageSrc 
                        ? (isMagicMode ? "تم رفع الصورة وبدء التوليد السحري" : "تم رفع الصورة! حدد الخيارات واضغط توليد") 
                        : "ارفع صورة نافذتك لتبدأ"}
                </span>
              </span>
              <div className="flex gap-2">
                {originalImageSrc && generatedImageSrc && isMagicMode && (
                  <button className="btn btn-primary" onClick={handleDownload} style={{ padding: '6px 16px', fontSize: '13px', fontWeight: 700 }}>
                    تحميل التصميم
                  </button>
                )}
                {originalImageSrc && isMagicMode && (
                  <button 
                    className="stage-reset" 
                    onClick={() => setIsMagicMode(false)}
                    style={{ backgroundColor: '#f3f4f6', color: '#111111', borderColor: '#d1d5db' }}
                  >
                    تعديل التصميم يدوياً
                  </button>
                )}
                {originalImageSrc && (
                  <button className="stage-reset" onClick={resetWorkspace}>
                    تصميم جديد
                  </button>
                )}
              </div>
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
                <img src={originalImageSrc} className="editor-image object-contain" alt="النافذة المرفوعة" style={{ width: '100%', height: '100%' }} />
              )}

              {/* Comparison Result View */}
              {originalImageSrc && generatedImageSrc && (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      <div className="lg:hidden">
        <Footer />
      </div>
    </>
  );
}

