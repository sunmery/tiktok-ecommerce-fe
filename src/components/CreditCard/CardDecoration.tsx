import { Box, SxProps } from '@mui/joy';

interface CardDecorationProps {
  variant?: 'green' | 'purple';
  sx?: SxProps;
}

/**
 * 信用卡装饰组件
 * 为卡片背景添加3D球体或漩涡等装饰效果
 */
const CardDecoration = ({ variant = 'green', sx = {} }: CardDecorationProps) => {
  // 根据变体类型返回不同的装饰效果
  if (variant === 'green') {
    return (
      <>
        {/* 绿色球体装饰 */}
        <Box
          sx={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            top: '15%',
            left: '15%',
            background: 'radial-gradient(circle, rgba(144, 238, 144, 0.9) 0%, rgba(76, 175, 80, 0.7) 70%, rgba(76, 175, 80, 0) 100%)',
            borderRadius: '50%',
            filter: 'blur(2px)',
            zIndex: 0,
            ...sx
          }}
        />
        {/* 小球体装饰 */}
        <Box
          sx={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            bottom: '20%',
            right: '10%',
            background: 'radial-gradient(circle, rgba(144, 238, 144, 0.7) 0%, rgba(76, 175, 80, 0.5) 70%, rgba(76, 175, 80, 0) 100%)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            zIndex: 0,
            ...sx
          }}
        />
        {/* 光晕效果 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 20%),
              radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 20%)
            `,
            zIndex: 0,
            borderRadius: 'inherit',
            ...sx
          }}
        />
      </>
    );
  }
  
  // 紫色漩涡装饰
  return (
    <>
      {/* 紫色漩涡背景 */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background: `
            repeating-conic-gradient(
              rgba(255, 255, 255, 0.1) 0deg 10deg,
              rgba(255, 255, 255, 0) 10deg 20deg
            ),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.1) 100%)
          `,
          zIndex: 0,
          borderRadius: 'inherit',
          transform: 'rotate(45deg)',
          opacity: 0.7,
          ...sx
        }}
      />
      {/* 光晕效果 */}
      <Box
        sx={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          transform: 'rotate(45deg)',
          zIndex: 0,
          ...sx
        }}
      />
      {/* 小光点装饰 */}
      <Box
        sx={{
          position: 'absolute',
          width: '5px',
          height: '5px',
          top: '20%',
          right: '30%',
          background: 'white',
          borderRadius: '50%',
          opacity: 0.6,
          boxShadow: '0 0 5px 2px rgba(255,255,255,0.3)',
          zIndex: 0,
          ...sx
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '3px',
          height: '3px',
          bottom: '40%',
          left: '20%',
          background: 'white',
          borderRadius: '50%',
          opacity: 0.6,
          boxShadow: '0 0 4px 1px rgba(255,255,255,0.3)',
          zIndex: 0,
          ...sx
        }}
      />
    </>
  );
};

export default CardDecoration;