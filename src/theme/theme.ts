import {extendTheme} from '@mui/joy/styles';
import {
  black,
  gray100,
  gray200,
  gray300,
  gray400,
  gray500,
  gray600,
  gray700,
  gray800,
  gray900,
  kleinBlue,
  kleinBlueDark,
  kleinBlueDarker,
  kleinBlueLight,
  kleinBlueLighter,
  marsGreen,
  marsGreenDark,
  marsGreenDarker,
  marsGreenLight,
  marsGreenLighter,
  schoenbrunnYellow,
  schoenbrunnYellowDark,
  schoenbrunnYellowDarker,
  schoenbrunnYellowLight,
  schoenbrunnYellowLighter,
  tiffanyBlue,
  tiffanyBlueDark,
  tiffanyBlueDarker,
  tiffanyBlueLight,
  tiffanyBlueLighter,
  white
} from './colors';

// 扩展MUI Joy主题，应用四种经典色调
const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                // 主色 - 使用克莱因蓝
                primary: {
                    50: kleinBlueLighter,
                    100: kleinBlueLight,
                    200: kleinBlue,
                    300: kleinBlue,
                    400: kleinBlue,
                    500: kleinBlue,
                    600: kleinBlue,
                    700: kleinBlueDark,
                    800: kleinBlueDark,
                    900: kleinBlueDarker,
                },
                // 次要色 - 使用蒂芙尼蓝
                secondary: {
                    50: tiffanyBlueLighter,
                    100: tiffanyBlueLight,
                    200: tiffanyBlue,
                    300: tiffanyBlue,
                    400: tiffanyBlue,
                    500: tiffanyBlue,
                    600: tiffanyBlue,
                    700: tiffanyBlueDark,
                    800: tiffanyBlueDark,
                    900: tiffanyBlueDarker,
                },
                // 成功状态 - 使用马尔斯绿
                success: {
                    50: marsGreenLighter,
                    100: marsGreenLight,
                    200: marsGreen,
                    300: marsGreen,
                    400: marsGreen,
                    500: marsGreen,
                    600: marsGreen,
                    700: marsGreenDark,
                    800: marsGreenDark,
                    900: marsGreenDarker,
                },
                // 警告状态 - 使用申布伦黄
                warning: {
                    50: schoenbrunnYellowLighter,
                    100: schoenbrunnYellowLight,
                    200: schoenbrunnYellow,
                    300: schoenbrunnYellow,
                    400: schoenbrunnYellow,
                    500: schoenbrunnYellow,
                    600: schoenbrunnYellow,
                    700: schoenbrunnYellowDark,
                    800: schoenbrunnYellowDark,
                    900: schoenbrunnYellowDarker,
                },
                // 中性色调
                neutral: {
                    50: gray100,
                    100: gray200,
                    200: gray300,
                    300: gray400,
                    400: gray500,
                    500: gray600,
                    600: gray700,
                    700: gray800,
                    800: gray900,
                    900: black,
                },
                // 背景色
                background: {
                    body: white,
                    surface: white,
                    popup: white,
                    level1: gray100,
                    level2: gray200,
                    level3: gray300,
                    tooltip: gray900,
                    backdrop: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
        dark: {
            palette: {
                // 主色 - 使用克莱因蓝
                primary: {
                    50: kleinBlueDarker,
                    100: kleinBlueDark,
                    200: kleinBlue,
                    300: kleinBlue,
                    400: kleinBlue,
                    500: kleinBlue,
                    600: kleinBlueLight,
                    700: kleinBlueLight,
                    800: kleinBlueLighter,
                    900: kleinBlueLighter,
                },
                // 次要色 - 使用蒂芙尼蓝
                secondary: {
                    50: tiffanyBlueDarker,
                    100: tiffanyBlueDark,
                    200: tiffanyBlue,
                    300: tiffanyBlue,
                    400: tiffanyBlue,
                    500: tiffanyBlue,
                    600: tiffanyBlueLight,
                    700: tiffanyBlueLight,
                    800: tiffanyBlueLighter,
                    900: tiffanyBlueLighter,
                },
                // 成功状态 - 使用马尔斯绿
                success: {
                    50: marsGreenDarker,
                    100: marsGreenDark,
                    200: marsGreen,
                    300: marsGreen,
                    400: marsGreen,
                    500: marsGreen,
                    600: marsGreenLight,
                    700: marsGreenLight,
                    800: marsGreenLighter,
                    900: marsGreenLighter,
                },
                // 警告状态 - 使用申布伦黄
                warning: {
                    50: schoenbrunnYellowDarker,
                    100: schoenbrunnYellowDark,
                    200: schoenbrunnYellow,
                    300: schoenbrunnYellow,
                    400: schoenbrunnYellow,
                    500: schoenbrunnYellow,
                    600: schoenbrunnYellowLight,
                    700: schoenbrunnYellowLight,
                    800: schoenbrunnYellowLighter,
                    900: schoenbrunnYellowLighter,
                },
                // 中性色调
                neutral: {
                    50: black,
                    100: gray900,
                    200: gray800,
                    300: gray700,
                    400: gray600,
                    500: gray500,
                    600: gray400,
                    700: gray300,
                    800: gray200,
                    900: gray100,
                },
                // 背景色
                background: {
                    body: gray800,
                    surface: gray700,
                    popup: gray700,
                    level1: gray600,
                    level2: gray500,
                    level3: gray400,
                    tooltip: white,
                    backdrop: 'rgba(0, 0, 0, 0.8)',
                },
            },
        },
    },
    components: {
        JoyButton: {
            styleOverrides: {
                root: ({ownerState}) => ({
                    borderRadius: '8px',
                    fontWeight: 600,
                    ...(ownerState.color === 'primary' && {
                        backgroundColor: kleinBlue,
                        color: white,
                        '&:hover': {
                            backgroundColor: kleinBlueDark,
                            color: white,
                        },
                    }),
                    ...(ownerState.color === 'warning' && {
                        backgroundColor: schoenbrunnYellow,
                        color: black,
                        '&:hover': {
                            backgroundColor: schoenbrunnYellowDark,
                            color: black,
                        },
                    }),
                }),
            },
        },
        JoyCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                },
            },
        },
    },
    typography: {
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
    },
});

export default theme;
