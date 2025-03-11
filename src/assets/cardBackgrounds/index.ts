import purpleCardBg from './purple-card-bg.png';
import greenCardBg from './green-card-bg.png';

type CardBackground = {
  url: string;
  style: string;
};

const cardBackgrounds: CardBackground[] = [
  {
    url: purpleCardBg,
    style: 'linear-gradient(135deg, rgba(26, 35, 126, 0.9) 0%, rgba(40, 53, 147, 0.9) 100%), url(${purpleCardBg}) center/cover'
  },
  {
    url: greenCardBg,
    style: 'linear-gradient(135deg, rgba(67, 160, 71, 0.9) 0%, rgba(102, 187, 106, 0.9) 100%), url(${greenCardBg}) center/cover'
  }
];

export const getRandomCardBackground = (): string => {
  const randomIndex = Math.floor(Math.random() * cardBackgrounds.length);
  return cardBackgrounds[randomIndex].style;
};

export const getCardBackgroundByBrand = (brand: string): string => {
  // 根据品牌返回特定背景，如果没有匹配则随机返回
  return getRandomCardBackground();
};