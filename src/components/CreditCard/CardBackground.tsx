import {Box, SxProps} from '@mui/joy';
import {ReactNode} from 'react';

interface CardBackgroundProps {
    children: ReactNode;
    variant?: 'green' | 'purple' | 'default';
    sx?: SxProps;
}

/**
 * 信用卡背景组件
 * 提供不同风格的卡片背景效果
 */
const CardBackground = ({children, variant = 'default', sx = {}}: CardBackgroundProps) => {
    // 背景样式配置
    const getBgStyles = () => {
        switch (variant) {
            case 'green':
                return {
                    background: `
            radial-gradient(circle at 70% 70%, rgba(144, 238, 144, 0.8) 0%, rgba(0, 128, 0, 0) 50%),
            radial-gradient(circle at 20% 20%, rgba(144, 238, 144, 0.8) 0%, rgba(0, 128, 0, 0) 40%),
            linear-gradient(135deg, #4CAF50, #8BC34A)
          `,
                    '&::before': {
                        content: '""',
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
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '60px',
                        height: '60px',
                        top: '15%',
                        left: '15%',
                        background: 'radial-gradient(circle, rgba(144, 238, 144, 0.9) 0%, rgba(76, 175, 80, 0.7) 70%, rgba(76, 175, 80, 0) 100%)',
                        borderRadius: '50%',
                        filter: 'blur(2px)',
                        zIndex: 0,
                    }
                };
            case 'purple':
                return {
                    background: `
            linear-gradient(135deg, #9C27B0, #E1BEE7),
            radial-gradient(ellipse at 50% 50%, rgba(156, 39, 176, 0.3) 0%, rgba(156, 39, 176, 0) 70%)
          `,
                    '&::before': {
                        content: '""',
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
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '150%',
                        height: '150%',
                        top: '-25%',
                        left: '-25%',
                        background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
                        borderRadius: '50%',
                        transform: 'rotate(45deg)',
                        zIndex: 0,
                    }
                };
            default:
                // 默认使用现有的品牌渐变
                return {};
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                ...getBgStyles(),
                ...sx
            }}
        >
            <Box sx={{position: 'relative', zIndex: 1}}>
                {children}
            </Box>
        </Box>
    );
};

export default CardBackground;
