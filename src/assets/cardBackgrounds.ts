export * from './cardBackgrounds';

/**
 * 信用卡背景图片URL数组
 * 这些URL对应用户提供的信用卡背景图片
 */
export const cardBackgrounds = {
  // 品牌特定背景
  visa: [
    // 紫色漩涡背景 (用户提供的图片)
    '/src/assets/img/visa_purple_swirl.jpg',
    'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  ],
  mastercard: [
    // 绿色球体背景 (用户提供的图片)
    '/src/assets/img/mastercard_green_spheres.jpg',
    'https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  ],
  // 通用背景
  generic: [
    // 多彩卡片组合背景
    'https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    // 多层卡片堆叠背景
    'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  ]
};

/**
 * 根据卡片品牌和索引获取背景样式
 * @param brand 卡片品牌
 * @param index 卡片索引
 * @returns 背景样式对象
 */
export const getCardBackgroundStyle = (brand: string, index: number) => {
  // 获取品牌对应的背景图片数组，如果没有则使用通用背景
  const brandLower = brand.toLowerCase();
  const backgrounds = cardBackgrounds[brandLower as keyof typeof cardBackgrounds] || cardBackgrounds.generic;
  
  // 使用索引来随机选择背景图片
  const randomIndex = index % backgrounds.length;
  const backgroundUrl = backgrounds[randomIndex];
  
  // 根据品牌设置不同的滤镜效果和渐变叠加
  let filter = '';
  let gradientOverlay = '';
  let animationProperties = {};
  
  switch (brandLower) {
    case 'visa':
      filter = 'hue-rotate(240deg) saturate(1.5)';
      gradientOverlay = 'linear-gradient(135deg, rgba(26, 35, 126, 0.7) 0%, rgba(40, 53, 147, 0.7) 100%)';
      animationProperties = {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '200%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
          animation: 'shimmer 3s infinite',
        },
        '@keyframes shimmer': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(50%)' }
        }
      };
      break;
    case 'mastercard':
      filter = 'hue-rotate(30deg) saturate(1.2)';
      gradientOverlay = 'linear-gradient(135deg, rgba(255, 152, 0, 0.7) 0%, rgba(245, 124, 0, 0.7) 100%)';
      animationProperties = {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          animation: 'pulse 2s infinite',
        },
        '@keyframes pulse': {
          '0%': { opacity: 0.5, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
          '100%': { opacity: 0.5, transform: 'scale(0.8)' }
        }
      };
      break;
    case 'amex':
      filter = 'hue-rotate(180deg) saturate(1.3)';
      gradientOverlay = 'linear-gradient(135deg, rgba(0, 111, 207, 0.7) 0%, rgba(16, 80, 158, 0.7) 100%)';
      animationProperties = {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
          transform: 'rotate(45deg)',
          animation: 'rotate 8s linear infinite',
        },
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      };
      break;
    case 'discover':
      filter = 'hue-rotate(20deg) saturate(1.4)';
      gradientOverlay = 'linear-gradient(135deg, rgba(255, 111, 0, 0.7) 0%, rgba(255, 143, 0, 0.7) 100%)';
      animationProperties = {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0) 40%)',
          animation: 'wave 3s ease-in-out infinite',
        },
        '@keyframes wave': {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      };
      break;
    case 'unionpay':
      filter = 'hue-rotate(0deg) saturate(1.5)';
      gradientOverlay = 'linear-gradient(135deg, rgba(229, 57, 53, 0.7) 0%, rgba(198, 40, 40, 0.7) 100%)';
      animationProperties = {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
          animation: 'spotlight 4s ease-in-out infinite',
        },
        '@keyframes spotlight': {
          '0%': { transform: 'scale(0.8) translate(-30%, -30%)' },
          '50%': { transform: 'scale(1.2) translate(30%, 30%)' },
          '100%': { transform: 'scale(0.8) translate(-30%, -30%)' }
        }
      };
      break;
    default:
      // 对于其他卡片类型，随机使用混合渐变背景
      if (typeof useGradient !== 'undefined' && useGradient && typeof cardGradients !== 'undefined') {
        const mixedGradients = cardGradients.mixed;
        const randomGradientIndex = Math.floor(Math.random() * mixedGradients.length);
        return {
          background: mixedGradients[randomGradientIndex],
          backgroundSize: 'cover',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
            transform: 'rotate(45deg)',
            transition: 'all 0.3s ease-in-out'
          }
        };
      }
      filter = 'grayscale(0.3) saturate(0.8)';
      gradientOverlay = 'linear-gradient(135deg, rgba(66, 66, 66, 0.7) 0%, rgba(33, 33, 33, 0.7) 100%)';
      animationProperties = {
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
          transform: 'rotate(45deg)',
          transition: 'all 0.3s ease-in-out'
        }
      };
      break;
  }

  return {
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: gradientOverlay,
    },
    ...animationProperties
  };
}