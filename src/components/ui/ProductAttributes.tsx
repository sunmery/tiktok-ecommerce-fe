import React from 'react';
import { AttributeValue } from '@/types/products';

interface ProductAttributesProps {
  attributes: Record<string, AttributeValue>;
  className?: string;
}

const AttributeItem: React.FC<{
  name: string;
  value: AttributeValue;
  level?: number;
}> = ({ name, value, level = 0 }) => {
  const paddingLeft = `${level * 1.5}rem`;

  // 格式化属性名称
  const formatName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // 渲染不同类型的值
  const renderValue = (value: AttributeValue) => {
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 rounded-md text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val]) => (
            <AttributeItem
              key={key}
              name={key}
              value={val}
              level={level + 1}
            />
          ))}
        </div>
      );
    }

    return <span className="text-gray-700">{value}</span>;
  };

  return (
    <div className="py-1" style={{ paddingLeft }}>
      <div className="font-medium text-gray-900">{formatName(name)}</div>
      <div className="mt-1">{renderValue(value)}</div>
    </div>
  );
};

export const ProductAttributes: React.FC<ProductAttributesProps> = ({
  attributes,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(attributes).map(([name, value]) => (
        <AttributeItem key={name} name={name} value={value} />
      ))}
    </div>
  );
}; 