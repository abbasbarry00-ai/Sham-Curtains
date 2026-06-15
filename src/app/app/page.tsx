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
  wave: "ripplefold wave curtain heading on track carriers: identical soft S-shaped waves from top to bottom, evenly spaced sinusoidal folds, no sewn pinch pleat groups, no rod pocket bunching, no eyelet rings",
  pleated: "pencil pleat tape curtain: many slim close-set vertical pencil folds gathered by heading tape across the top, small regular pleats, not triple pinch pleats, not wave folds, not eyelet rings",
  gathered: "rod pocket gathered curtain: fabric sleeve pocket at the top gathered densely around a round rod, soft irregular bunching along the header, no grommet rings, no pinch pleat stitching, no wave track carriers",
  pinch: "American triple pinch pleat curtain: stitched three-finger pleat groups sewn at fixed intervals along the header, each pleat pinched at the top and fanning into tailored vertical folds below, formal structured drapery",
  sunscreen: "sunscreen roller blind: one single flat solar-screen mesh fabric sheet rolling from a top tube with a straight weighted bottom bar, subtly translucent woven mesh, no folds, no pleats, no curtain fabric panels",
  dk: "day and night double roller blind system: two separate roller fabrics in one headrail, one sheer day screen and one opaque night blackout layer, dual-roll/cassette mechanism, not zebra stripes, not fabric curtains",
  classic_rod: "eyelet grommet curtain on visible round rod: large metal grommet rings punched through the top header and threaded on a visible round pole, creating broad even waves below each ring, no hidden track, no rod pocket, no pinch pleats",
  zebra: "zebra roller blind: one continuous looped banded shade with alternating horizontal opaque and sheer stripes across the same flat panel, stripes align to control privacy, single cassette/roller, no pleats or curtain folds",
  wood_venetian: "wood Venetian blind: rigid horizontal natural wood slats stacked evenly with ladder tapes/cords and a top headrail, slats can tilt, visible wood grain, no fabric sheet, no pleats, no drapery folds",
  metal_venetian: "aluminum mini Venetian blind: thin narrow horizontal metallic slats with crisp reflective edges, ladder cords and compact headrail, slats can tilt, no fabric sheet, no pleats, no curtain panels",
  stage: "theatrical stage drape: very heavy opulent fabric with oversized deep vertical folds, extreme fullness, dramatic floor-length drop, rich performance-hall look, not simple residential pencil pleats"
};

const blindStyles = ['sunscreen', 'dk', 'zebra', 'wood_venetian', 'metal_venetian'];
const isBlindStyle = (styleId: string) => blindStyles.includes(styleId);


const fabricPrompts: Record<string, string> = {
  velvet: "heavy premium soft velvet fabric with a rich matte texture and soft sheen highlights",
  linen: "textured natural organic linen fabric with a visible weave and rustic elegance",
  silk: "shiny smooth premium mulberry silk fabric with elegant flowing draping and soft highlights",
  cotton: "soft high-quality organic cotton fabric with a clean smooth matte finish",
  lace: "delicately patterned sheer lace fabric with detailed embroidery and openwork texture",
  blackout_chamois: "thick chamois suede blackout fabric, dense opaque backing, soft matte nap texture, heavy room-darkening drape"
};

const colorPrompts: Record<string, string> = {
  white: "pure solid white tone",
  beige: "warm classic beige tone",
  grey: "neutral charcoal grey tone",
  navy: "dark elegant navy blue tone",
  olive: "earthy olive green tone",
  rose: "dusty rose pink tone"
};

const styleNames: Record<string, string> = {
  wave: 'ويفي',
  pleated: 'كسرات',
  gathered: 'زم',
  pinch: 'تكسير امريكي',
  sunscreen: 'رول سنسكرين',
  dk: 'دي كي (DK)',
  classic_rod: 'كلاسيك بوري',
  zebra: 'رول زيبرا',
  wood_venetian: 'جالوزي خشبي',
  metal_venetian: 'جالوزي معدني',
  stage: 'مسرحي كسرات'
};

const fabricNames: Record<string, string> = {
  velvet: 'مخمل ثقيل',
  linen: 'كتان طبيعي',
  silk: 'حرير ناعم',
  cotton: 'قطن ناعم',
  lace: 'دانتيل منقوش',
  blackout_chamois: 'بلاك آوت شامواه'
};

const fabricEnglishNames: Record<string, string> = {
  velvet: 'Velvet',
  linen: 'Linen',
  silk: 'Silk',
  cotton: 'Cotton',
  lace: 'Lace',
  blackout_chamois: 'Chamois Blackout'
};

const barNames: Record<string, string> = {
  wood_bar: 'بار خشبي ديكور',
  wood_rail: 'بلمت خشبي (سكة مخفية)',
  metal_bar: 'بار حديد مزخرف',
  modern_bar: 'سكة ألمنيوم مودرن',
  hidden: 'سكة مخفية (بدون بار)'
};

const barEnglishNames: Record<string, string> = {
  wood_bar: 'Wood Rod',
  wood_rail: 'Wood Pelmet Track',
  metal_bar: 'Iron Rod',
  modern_bar: 'Aluminum Track',
  hidden: 'Hidden Track'
};

const positionNames: Record<string, string> = {
  closed: 'مغلقة بالكامل',
  open_sides: 'مسحوبة للجانبين',
  side_pull: 'رفعات جانبية'
};

const positionEnglishNames: Record<string, string> = {
  closed: 'Closed panels',
  open_sides: 'Open sides',
  side_pull: 'Side tiebacks'
};

const opacityNames: Record<string, string> = {
  sheer: 'شفاف يمرر الضوء',
  semi: 'شبه تعتيم',
  blackout: 'تعتيم كامل'
};

const hardwareRequirements: Record<string, { type: string; required: string; forbidden: string }> = {
  hidden: {
    type: 'concealed track only, no visible hardware',
    required: 'Use a fully concealed recessed ceiling track hidden inside the ceiling pocket. The curtain fabric must appear to drop directly from a narrow ceiling slot or shadow gap, with no visible hardware at all.',
    forbidden: 'Do not show any visible curtain rod, pole, rail, track, pelmet box, brackets, finials, rings, grommets, black horizontal bar, wooden bar, or metal bar.'
  },
  wood_bar: {
    type: 'visible round wooden rod/pole',
    required: 'Use one visible round natural oak wooden curtain rod mounted on wall brackets above the window, with carved wooden finials on both ends. This is a rod/pole, not a rail.',
    forbidden: 'Do not use a metal rod, black rod, brass rod, ceiling track, hidden track, pelmet box, square rail, aluminum track, or recessed slot.'
  },
  wood_rail: {
    type: 'flat wooden pelmet/cornice with hidden internal track, no visible rod',
    required: 'Use a straight flat rectangular wooden pelmet/cornice box above the window that conceals an internal curtain track. The curtain fabric must emerge from underneath the wooden box. The visible hardware is a wooden box only, never a round pole.',
    forbidden: 'Do not show any round rod, cylindrical pole, finials, rings, grommets, brackets, black metal bar, brass pole, exposed aluminum track, or ceiling slot.'
  },
  metal_bar: {
    type: 'visible round decorative iron rod/pole',
    required: 'Use one visible round decorative dark iron curtain rod mounted on wall brackets above the window, with matching decorative metal finials. This is a rod/pole, not a rail.',
    forbidden: 'Do not use a wooden rod, hidden track, ceiling slit, white aluminum track, wooden pelmet, square rail, or recessed ceiling slot.'
  },
  modern_bar: {
    type: 'visible slim aluminum track/rail, not a rod',
    required: 'Use a slim straight white aluminum curtain track/rail mounted close to the ceiling. It must look like a flat low-profile linear track, not a cylindrical rod, with no finials or rings.',
    forbidden: 'Do not use any round rod, cylindrical pole, finials, rings, grommets, black metal bar, wooden bar, carved decorative hardware, or wooden pelmet box.'
  }
};

const opacityRequirements: Record<string, string> = {
  sheer: 'Use sheer light-filtering fabric. It may glow with daylight, but the selected curtain shape must remain physically continuous and clear.',
  semi: 'Use semi-opaque light-filtering fabric that softens daylight and blocks a clear outside view.',
  blackout: 'Use fully opaque blackout fabric that blocks daylight and hides the outside view.'
};

const getHardwareSpec = (styleId: string, barId: string) => {
  if (styleId === 'sunscreen' || styleId === 'zebra') {
    return {
      type: 'roller blind cassette/headrail only',
      required: 'Use only the compact roller blind cassette or top tube that belongs to the selected roller blind. No curtain rod or decorative curtain bar is used.',
      forbidden: 'Do not show curtain rods, poles, finials, curtain rings, grommets, pelmet boxes, decorative bars, or drapery hardware.'
    };
  }

  if (styleId === 'dk') {
    return {
      type: 'double roller cassette/headrail only',
      required: 'Use a compact double-roller headrail/cassette containing two separate roller fabrics. No curtain rod or decorative curtain bar is used.',
      forbidden: 'Do not show curtain rods, poles, finials, curtain rings, grommets, pelmet boxes, decorative bars, or drapery hardware.'
    };
  }

  if (styleId === 'wood_venetian' || styleId === 'metal_venetian') {
    return {
      type: 'Venetian blind headrail only',
      required: 'Use only a compact rectangular Venetian blind headrail at the top of the slats. No curtain rod or decorative curtain bar is used.',
      forbidden: 'Do not show curtain rods, poles, finials, curtain rings, grommets, pelmet boxes, decorative bars, curtain tracks, or drapery hardware.'
    };
  }

  return hardwareRequirements[barId] || hardwareRequirements.hidden;
};

const isVisibleRodHardware = (barId: string) => barId === 'wood_bar' || barId === 'metal_bar';

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

  const handleStyleSelect = (styleId: string) => {
    setStyle(styleId);
    if (styleId === 'classic_rod' && !['wood_bar', 'metal_bar'].includes(barStyle)) {
      setBarStyle('metal_bar');
    }
  };

  const handleCurtainPositionSelect = (positionId: string) => {
    setCurtainPosition(positionId);
  };

  const handleFabricSelect = (fabricId: string) => {
    setFabric(fabricId);
    if (fabricId === 'blackout_chamois') {
      setOpacity('blackout');
    }
  };

  const handleBarStyleSelect = (barId: string) => {
    setBarStyle(barId);
    if (style === 'classic_rod' && !['wood_bar', 'metal_bar'].includes(barId)) {
      setStyle('wave');
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

  const getSelectedColorHex = () => {
    if (!isMagicMode && selectedColor === 'custom') return customColor;
    const activeColor = isMagicMode ? 'beige' : selectedColor;
    return colors.find((c) => c.id === activeColor)?.hex || '#c8b28f';
  };

  const hexToRgb = (hex: string) => {
    const normalized = hex.replace('#', '');
    const value = normalized.length === 3
      ? normalized.split('').map((char) => char + char).join('')
      : normalized;
    const parsed = parseInt(value, 16);
    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255
    };
  };

  const createClosedCurtainGuideImageBase64 = (src: string, colorHex: string, styleId: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const scan = ctx.getImageData(0, 0, width, height).data;
        const scanMinX = Math.floor(width * 0.16);
        const scanMaxX = Math.floor(width * 0.84);
        const scanMinY = Math.floor(height * 0.06);
        const scanMaxY = Math.floor(height * 0.78);
        let minX = scanMaxX;
        let maxX = scanMinX;
        let minY = scanMaxY;
        let maxY = scanMinY;
        let count = 0;

        for (let y = scanMinY; y < scanMaxY; y += 3) {
          for (let x = scanMinX; x < scanMaxX; x += 3) {
            const index = (y * width + x) * 4;
            const r = scan[index];
            const g = scan[index + 1];
            const b = scan[index + 2];
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            const colorSpread = Math.max(r, g, b) - Math.min(r, g, b);
            if (luma > 148 && (luma > 182 || colorSpread > 28)) {
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
              count++;
            }
          }
        }

        const minUsefulPixels = ((scanMaxX - scanMinX) * (scanMaxY - scanMinY)) / 9 * 0.025;
        if (count < minUsefulPixels || minX >= maxX || minY >= maxY) {
          minX = Math.floor(width * 0.26);
          maxX = Math.floor(width * 0.74);
          minY = Math.floor(height * 0.13);
          maxY = Math.floor(height * 0.80);
        } else {
          minX = Math.max(0, minX - Math.floor(width * 0.045));
          maxX = Math.min(width, maxX + Math.floor(width * 0.045));
          minY = Math.max(0, minY - Math.floor(height * 0.045));
          maxY = Math.min(height, maxY + Math.floor(height * 0.10));
        }

        const guideWidth = maxX - minX;
        const guideHeight = maxY - minY;
        const rgb = hexToRgb(colorHex);
        const isBlindGuide = isBlindStyle(styleId);

        ctx.save();
        ctx.globalAlpha = 0.96;
        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fillRect(minX, minY, guideWidth, guideHeight);

        if (isBlindGuide) {
          ctx.globalAlpha = 0.22;
          ctx.strokeStyle = rgb.r + rgb.g + rgb.b > 620 ? 'rgba(70, 60, 45, 0.5)' : 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = Math.max(1, height * 0.003);
          const stripeStep = Math.max(10, guideHeight / 18);
          for (let y = minY + stripeStep; y < maxY; y += stripeStep) {
            ctx.beginPath();
            ctx.moveTo(minX, y);
            ctx.lineTo(maxX, y);
            ctx.stroke();
          }
        } else {
          const foldCount = 18;
          const foldWidth = guideWidth / foldCount;
          for (let i = 0; i < foldCount; i++) {
            const x = minX + i * foldWidth;
            const shade = i % 2 === 0 ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.18)';
            const gradient = ctx.createLinearGradient(x, minY, x + foldWidth, minY);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.45, shade);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.globalAlpha = 0.95;
            ctx.fillStyle = gradient;
            ctx.fillRect(x, minY, foldWidth, guideHeight);
          }
          ctx.globalAlpha = 0.35;
          ctx.strokeStyle = 'rgba(40, 30, 20, 0.55)';
          ctx.lineWidth = Math.max(1, width * 0.002);
          ctx.beginPath();
          ctx.moveTo(minX + guideWidth / 2, minY);
          ctx.lineTo(minX + guideWidth / 2, maxY);
          ctx.stroke();
        }

        ctx.globalAlpha = 0.28;
        ctx.fillStyle = 'rgba(30, 20, 10, 0.45)';
        ctx.fillRect(minX, minY, guideWidth, Math.max(4, height * 0.01));
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  };

  const detectWindowBounds = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scan = ctx.getImageData(0, 0, width, height).data;
    const scanMinX = Math.floor(width * 0.16);
    const scanMaxX = Math.floor(width * 0.84);
    const scanMinY = Math.floor(height * 0.06);
    const scanMaxY = Math.floor(height * 0.78);
    let minX = scanMaxX;
    let maxX = scanMinX;
    let minY = scanMaxY;
    let maxY = scanMinY;
    let count = 0;

    for (let y = scanMinY; y < scanMaxY; y += 3) {
      for (let x = scanMinX; x < scanMaxX; x += 3) {
        const index = (y * width + x) * 4;
        const r = scan[index];
        const g = scan[index + 1];
        const b = scan[index + 2];
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const colorSpread = Math.max(r, g, b) - Math.min(r, g, b);
        if (luma > 148 && (luma > 182 || colorSpread > 28)) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          count++;
        }
      }
    }

    const minUsefulPixels = ((scanMaxX - scanMinX) * (scanMaxY - scanMinY)) / 9 * 0.025;
    if (count < minUsefulPixels || minX >= maxX || minY >= maxY) {
      return {
        minX: Math.floor(width * 0.26),
        maxX: Math.floor(width * 0.74),
        minY: Math.floor(height * 0.13),
        maxY: Math.floor(height * 0.80)
      };
    }

    return {
      minX: Math.max(0, minX - Math.floor(width * 0.045)),
      maxX: Math.min(width, maxX + Math.floor(width * 0.045)),
      minY: Math.max(0, minY - Math.floor(height * 0.045)),
      maxY: Math.min(height, maxY + Math.floor(height * 0.10))
    };
  };

  const sampleWallColor = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number }
  ) => {
    const sampleY = Math.max(0, Math.floor(bounds.minY - height * 0.08));
    const sampleXs = [
      Math.max(0, Math.floor(bounds.minX - width * 0.08)),
      Math.min(width - 1, Math.floor(bounds.maxX + width * 0.08)),
      Math.floor(width * 0.5)
    ];
    let r = 0;
    let g = 0;
    let b = 0;
    sampleXs.forEach((x) => {
      const pixel = ctx.getImageData(x, sampleY, 1, 1).data;
      r += pixel[0];
      g += pixel[1];
      b += pixel[2];
    });
    return {
      r: Math.round(r / sampleXs.length),
      g: Math.round(g / sampleXs.length),
      b: Math.round(b / sampleXs.length)
    };
  };

  const createHardwareGuideImageBase64 = (src: string, barId: string, styleId: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const bounds = detectWindowBounds(ctx, width, height);
        const rodHardware = isVisibleRodHardware(barId);
        const guideMinX = rodHardware
          ? Math.max(0, bounds.minX - Math.floor(width * 0.08))
          : Math.max(0, Math.min(bounds.minX - Math.floor(width * 0.12), Math.floor(width * 0.08)));
        const guideMaxX = rodHardware
          ? Math.min(width, bounds.maxX + Math.floor(width * 0.08))
          : Math.min(width, Math.max(bounds.maxX + Math.floor(width * 0.12), Math.floor(width * 0.92)));
        const guideWidth = guideMaxX - guideMinX;
        const wall = sampleWallColor(ctx, width, height, bounds);
        const isBlind = isBlindStyle(styleId);

        ctx.save();

        if (isBlind) {
          ctx.fillStyle = 'rgba(245, 245, 242, 0.94)';
          ctx.fillRect(guideMinX, Math.max(0, bounds.minY - height * 0.035), guideWidth, Math.max(5, height * 0.018));
          ctx.restore();
          resolve(canvas.toDataURL('image/jpeg', 0.86));
          return;
        }

        if (barId === 'hidden') {
          const clearY = Math.max(0, bounds.minY - Math.floor(height * 0.12));
          const clearHeight = Math.max(22, Math.floor(height * 0.105));
          ctx.fillStyle = `rgba(${wall.r}, ${wall.g}, ${wall.b}, 0.96)`;
          ctx.fillRect(guideMinX, clearY, guideWidth, clearHeight);
          ctx.fillStyle = 'rgba(25, 22, 20, 0.32)';
          ctx.fillRect(guideMinX + width * 0.015, bounds.minY - height * 0.012, guideWidth - width * 0.03, Math.max(2, height * 0.004));
        } else if (barId === 'wood_rail') {
          const clearY = Math.max(0, bounds.minY - Math.floor(height * 0.12));
          const clearHeight = Math.max(22, Math.floor(height * 0.105));
          ctx.fillStyle = `rgba(${wall.r}, ${wall.g}, ${wall.b}, 0.90)`;
          ctx.fillRect(guideMinX, clearY, guideWidth, clearHeight);

          const boxY = Math.max(0, bounds.minY - height * 0.105);
          const boxHeight = Math.max(18, height * 0.072);
          const gradient = ctx.createLinearGradient(guideMinX, boxY, guideMaxX, boxY + boxHeight);
          gradient.addColorStop(0, '#8f6538');
          gradient.addColorStop(0.5, '#c09358');
          gradient.addColorStop(1, '#7d552d');
          ctx.fillStyle = gradient;
          ctx.fillRect(guideMinX, boxY, guideWidth, boxHeight);
          ctx.fillStyle = 'rgba(255, 235, 195, 0.20)';
          ctx.fillRect(guideMinX, boxY + Math.max(2, height * 0.006), guideWidth, Math.max(2, height * 0.004));
          ctx.fillStyle = 'rgba(60, 35, 15, 0.22)';
          ctx.fillRect(guideMinX, boxY + boxHeight - Math.max(3, height * 0.006), guideWidth, Math.max(3, height * 0.006));
        } else if (barId === 'modern_bar') {
          const clearY = Math.max(0, bounds.minY - Math.floor(height * 0.085));
          const clearHeight = Math.max(15, Math.floor(height * 0.06));
          ctx.fillStyle = `rgba(${wall.r}, ${wall.g}, ${wall.b}, 0.88)`;
          ctx.fillRect(guideMinX, clearY, guideWidth, clearHeight);

          const railY = Math.max(0, bounds.minY - height * 0.052);
          ctx.fillStyle = 'rgba(248, 248, 246, 0.96)';
          ctx.fillRect(guideMinX, railY, guideWidth, Math.max(5, height * 0.012));
          ctx.fillStyle = 'rgba(180, 180, 175, 0.55)';
          ctx.fillRect(guideMinX, railY + Math.max(5, height * 0.012), guideWidth, Math.max(1, height * 0.003));
        } else {
          const rodY = Math.max(0, bounds.minY - height * 0.045);
          const isWood = barId === 'wood_bar';
          ctx.strokeStyle = isWood ? '#7a4d25' : '#171717';
          ctx.lineWidth = Math.max(4, height * 0.012);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(guideMinX, rodY);
          ctx.lineTo(guideMaxX, rodY);
          ctx.stroke();
          ctx.fillStyle = isWood ? '#7a4d25' : '#171717';
          const finialRadius = Math.max(7, height * 0.022);
          ctx.beginPath();
          ctx.arc(guideMinX, rodY, finialRadius, 0, Math.PI * 2);
          ctx.arc(guideMaxX, rodY, finialRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => resolve(src);
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
        const activePosition = isMagicMode ? 'closed' : curtainPosition === 'half_open' ? 'open_sides' : curtainPosition; 
        const activeAddTulle = isMagicMode ? false : addTulle;
        const isClosedPosition = activePosition === 'closed';
        const isSideTiebackPosition = activePosition === 'side_pull';

        let colorDesc = '';
        if (!isMagicMode && selectedColor === 'custom') {
          colorDesc = `exact custom color hex ${customColor}`;
        } else {
          const colorObj = colors.find(c => c.id === activeColor);
          colorDesc = colorObj ? colorPrompts[activeColor] : 'solid color';
        }

        const hardwareSpec = getHardwareSpec(activeStyle, activeBar);
        const opacitySpec = opacityRequirements[activeOpacity] || opacityRequirements.semi;
        const hardwareGuideInstruction = isBlindStyle(activeStyle)
          ? 'The top guide in the input image indicates the selected blind headrail/cassette. Preserve it as blind hardware and do not convert it into a curtain rod.'
          : isVisibleRodHardware(activeBar)
            ? 'The top guide in the input image indicates the selected visible round rod. Keep it as the chosen rod hardware.'
            : 'The top guide in the input image indicates the selected track/rail/pelmet. Preserve that flat non-rod hardware exactly and never replace it with a round rod, pole, rings, brackets, or finials.';

        let positionInstruction = '';
        let tulleInstruction = '';
        let constructionInstruction = stylePrompts[activeStyle];

        let negativePrompt = `wrong curtain style, wrong hardware, ${hardwareSpec.forbidden}, blank wall, painted wall, drywall, plaster patch, changed wall color, changed furniture, changed floor, changed ceiling, distorted room layout`;

        if (isClosedPosition) {
          if (isBlindStyle(activeStyle)) {
            constructionInstruction = `${stylePrompts[activeStyle]}, fully lowered across the complete window opening as one continuous closed window covering`;
          } else {
            constructionInstruction = `${stylePrompts[activeStyle]}, arranged as closed full-width curtain panels with folds continuing through the center seam`;
          }

          positionInstruction = `Required final position: CLOSED. The selected main curtain or blind must cover the entire window opening from left edge to right edge. For fabric curtains, fill the center with the same continuous fabric folds; the center seam is only a narrow vertical meeting line, not a gap. Do not leave panels parked on the left and right sides. Do not show exposed glass, window frame, clear daylight, or outside scenery in the middle.`;
          tulleInstruction = `Do not add a separate visible tulle layer in front of the closed main curtain.`;
          negativePrompt = `${negativePrompt}, exposed center opening, open curtains, side-stacked curtains, visible window glass, visible window frame, outside view, daylight in the center, separate tulle panel over an open window`;
        } else if (isSideTiebackPosition) {
          positionInstruction = `Required final position: SIDE TIEBACKS. Pull the main curtain panels outward to the left and right sides and secure each panel with visible fabric tiebacks or holdbacks around the middle height. The drapery should curve gracefully toward the side tiebacks, leaving the center window intentionally exposed.`;
          tulleInstruction = activeAddTulle 
            ? `Add a separate hanging sheer white tulle curtain behind the tied-back side panels. It must be suspended from the curtain hardware with visible soft vertical fabric folds and a small air gap from the glass. It must not be a coating, tint, film, plastic sheet, sticker, or wrap on the glass.`
            : `Do not add tulle. Keep the original window glass transparent and uncovered behind the tied-back side panels.`;
          negativePrompt = `${negativePrompt}, closed full-width curtain, covered center window, plain open panels without tiebacks, frosted glass, tinted window film, privacy film, vinyl wrap, plastic cover on glass, milky glass`;
        } else {
          positionInstruction = `Required final position: OPEN SIDES. Move the main curtain fabric to the left and right sides of the window. The center window area remains visible, and the side fabric should stack naturally at the outer edges without tiebacks.`;
          tulleInstruction = activeAddTulle 
            ? `Add a separate hanging sheer white tulle curtain behind the open side panels. It must be suspended from the curtain hardware with visible soft vertical fabric folds and a small air gap from the glass. It must not look like frosted glass, tinted film, vinyl, plastic sheet, sticker, or a flat coating on the window.`
            : `Do not add tulle. Keep the original window glass transparent, uncovered, untinted, and free of any film or wrap.`;
          negativePrompt = `${negativePrompt}, closed full-width curtain, covered center window, tiebacks, holdbacks, frosted glass, tinted window film, privacy film, vinyl wrap, plastic cover on glass, milky glass`;
        }

        const prompt = `Edit this room photo as a strict product visualization. The selected specifications override the original photo and must not be substituted.

Required selected specifications:
- Curtain/blind style: ${constructionInstruction}.
- Fabric/material/color: ${colorDesc}; ${isBlindStyle(activeStyle) ? 'use the selected blind material surface' : fabricPrompts[activeFabric]}.
- Opacity: ${opacitySpec}
- Selected hardware option: ${barEnglishNames[activeBar] || activeBar}
- Hardware type: ${hardwareSpec.type}
- Hardware requirement: ${hardwareSpec.required}
- Hardware guide: ${hardwareGuideInstruction}
- Position: ${positionInstruction}
- Tulle: ${tulleInstruction}
- Window glass: ${isClosedPosition ? 'glass may be hidden only by the closed main curtain fabric.' : 'keep the original glass transparent and readable; never turn the glass into frosted film, tint, vinyl wrap, plastic cover, or a flat milky overlay.'}

Forbidden changes:
- ${hardwareSpec.forbidden}
- Do not change wall color, furniture, floor, ceiling, camera angle, room layout, or general lighting.
- Do not invent a different curtain type, different pleat construction, different bar, or different position.

Execution:
Action 1: Replace only the existing window treatment area with the selected specifications above.
Action 2: Follow the top hardware guide in the input image as the exact hardware category and silhouette.
Action 3: ${isClosedPosition ? 'Use the rough closed-curtain color guide in the input image only as spatial guidance, and refine it into realistic fabric that fully covers the window.' : 'Use the original image as the room reference.'}
Action 4: Preserve the room and architecture outside the window treatment area.
Action 5: Make the final image photorealistic and internally consistent.
Final compliance check: the generated result must match every selected specification: style, color, opacity, hardware, tulle setting, and ${isClosedPosition ? 'fully closed position with no open center gap.' : `${positionEnglishNames[activePosition] || activePosition} position.`}`;

        return {
          prompt: prompt,
          negative_prompt: negativePrompt,
          curtain_position: activePosition,
          hardware_id: activeBar
        };
      };

      const promptObj = getCohesivePrompt();
      const guideStyle = isMagicMode ? 'wave' : style;
      const positionGuideImage = promptObj.curtain_position === 'closed'
        ? await createClosedCurtainGuideImageBase64(imageToUse, getSelectedColorHex(), guideStyle)
        : imageToUse;
      const imageForGeneration = await createHardwareGuideImageBase64(positionGuideImage, promptObj.hardware_id, guideStyle);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageForGeneration,
          prompt: promptObj.prompt,
          negative_prompt: promptObj.negative_prompt,
          curtain_position: promptObj.curtain_position,
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
                            onClick={() => handleStyleSelect('wave')}
                          >
                            <span className="font-bold text-sm">ويفي</span>
                            <span className={`text-xs mt-1 ${style === 'wave' ? 'text-gray-300' : 'text-gray-500'}`}>Ripple Fold</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'pleated' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('pleated')}
                          >
                            <span className="font-bold text-sm">كسرات</span>
                            <span className={`text-xs mt-1 ${style === 'pleated' ? 'text-gray-300' : 'text-gray-500'}`}>Pleated</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'gathered' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('gathered')}
                          >
                            <span className="font-bold text-sm">زم</span>
                            <span className={`text-xs mt-1 ${style === 'gathered' ? 'text-gray-300' : 'text-gray-500'}`}>Rod Pocket</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'pinch' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('pinch')}
                          >
                            <span className="font-bold text-sm">تكسير أمريكي</span>
                            <span className={`text-xs mt-1 ${style === 'pinch' ? 'text-gray-300' : 'text-gray-500'}`}>Pinch Pleat</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'classic_rod' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('classic_rod')}
                          >
                            <span className="font-bold text-sm">كلاسيك بوري</span>
                            <span className={`text-xs mt-1 ${style === 'classic_rod' ? 'text-gray-300' : 'text-gray-500'}`}>Eyelet Grommet</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'stage' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('stage')}
                          >
                            <span className="font-bold text-sm">مسرحي كسرات</span>
                            <span className={`text-xs mt-1 ${style === 'stage' ? 'text-gray-300' : 'text-gray-500'}`}>Theatrical</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'sunscreen' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('sunscreen')}
                          >
                            <span className="font-bold text-sm">رول سنسكرين</span>
                            <span className={`text-xs mt-1 ${style === 'sunscreen' ? 'text-gray-300' : 'text-gray-500'}`}>Sunscreen</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'dk' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('dk')}
                          >
                            <span className="font-bold text-sm">دي كي (DK)</span>
                            <span className={`text-xs mt-1 ${style === 'dk' ? 'text-gray-300' : 'text-gray-500'}`}>Double Roller</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'zebra' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('zebra')}
                          >
                            <span className="font-bold text-sm">رول زيبرا</span>
                            <span className={`text-xs mt-1 ${style === 'zebra' ? 'text-gray-300' : 'text-gray-500'}`}>Zebra Roller</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'wood_venetian' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('wood_venetian')}
                          >
                            <span className="font-bold text-sm">جالوزي خشبي</span>
                            <span className={`text-xs mt-1 ${style === 'wood_venetian' ? 'text-gray-300' : 'text-gray-500'}`}>Wood Venetian</span>
                          </button>
                          <button
                            type="button"
                            className={`border border-gray-300 rounded-none p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${style === 'metal_venetian' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                            onClick={() => handleStyleSelect('metal_venetian')}
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
                              onClick={() => handleFabricSelect(key)}
                            >
                              <span className="font-bold text-sm">{fabricNames[key]}</span>
                              <span className={`text-xs mt-1 ${fabric === key ? 'text-gray-300' : 'text-gray-500'}`}>
                                {fabricEnglishNames[key]}
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
                              onClick={() => handleBarStyleSelect(key)}
                            >
                              <span className="font-bold text-sm">{barNames[key]}</span>
                              <span className={`text-xs mt-1 ${barStyle === key ? 'text-gray-300' : 'text-gray-500'}`}>
                                {barEnglishNames[key]}
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
                              onClick={() => handleCurtainPositionSelect(key)}
                            >
                              <span className="font-bold text-sm">{positionNames[key]}</span>
                              <span className={`text-xs mt-1 ${curtainPosition === key ? 'text-gray-300' : 'text-gray-500'}`}>
                                {positionEnglishNames[key]}
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
                        <li>لإظهار التول، اختر "مسحوبة للجانبين" مع تفعيل التول.</li>
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
                <div 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <img 
                    src={originalImageSrc} 
                    className="editor-image object-contain" 
                    alt="النافذة المرفوعة" 
                    style={{ 
                      width: 'auto', 
                      height: 'auto', 
                      maxWidth: '100%', 
                      maxHeight: 'calc(100vh - 250px)', 
                      display: 'block' 
                    }} 
                  />
                </div>
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
