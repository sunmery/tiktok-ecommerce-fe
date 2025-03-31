import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemButton, Typography, Breadcrumbs, Chip } from '@mui/joy';
import { Category } from '@/types/category';
import { categoryService } from '@/api/categoryService';
import { Link } from '@tanstack/react-router';

interface CategoryNavigatorProps {
  initialRootId?: string; // 初始根分类ID，默认为1（根分类）
  onCategorySelect?: (category: Category) => void; // 选择分类时的回调
}

const CategoryNavigator: React.FC<CategoryNavigatorProps> = ({ 
  initialRootId = "1", 
  onCategorySelect 
}) => {
  // 当前显示的分类列表
  const [categories, setCategories] = useState<Category[]>([]);
  // 当前选中的分类
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  // 导航路径（面包屑）
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(false);

  // 加载分类
  const loadCategories = async (parentId: string) => {
    setLoading(true);
    try {
      // 使用新添加的API获取直接子分类
      const response = await categoryService.getDirectSubCategories({ parentId });
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载分类路径
  const loadCategoryPath = async (categoryId: string) => {
    try {
      const response = await categoryService.getCategoryPath({ categoryId });
      // 路径是从根到当前的顺序
      setBreadcrumbs(response.categories || []);
    } catch (error) {
      console.error('Failed to load category path:', error);
    }
  };

  // 初始化：加载根分类的子分类
  useEffect(() => {
    loadCategories(initialRootId);
  }, [initialRootId]);

  // 处理分类点击事件
  const handleCategoryClick = async (category: Category) => {
    setCurrentCategory(category);
    
    // 如果是叶子节点，调用回调
    if (category.isLeaf) {
      onCategorySelect && onCategorySelect(category);
      return;
    }
    
    // 如果不是叶子节点，加载其子分类
    loadCategories(category.id);
    loadCategoryPath(category.id);
  };

  // 处理面包屑导航点击
  const handleBreadcrumbClick = async (category: Category, index: number) => {
    // 点击面包屑时，更新当前分类和面包屑导航
    setCurrentCategory(category);
    loadCategories(category.id);
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  // 返回上一级
  const handleGoBack = () => {
    if (breadcrumbs.length > 1) {
      const parentCategory = breadcrumbs[breadcrumbs.length - 2];
      handleCategoryClick(parentCategory);
    } else {
      // 如果只有一个面包屑（根分类），则加载根分类的子分类
      loadCategories(initialRootId);
      setBreadcrumbs([]);
      setCurrentCategory(null);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 面包屑导航 */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          size="sm" 
          sx={{ mb: 2, px: 2 }}
          separator="›"
        >
          {breadcrumbs.map((category, index) => (
            <Chip
              key={category.id}
              size="sm"
              variant={index === breadcrumbs.length - 1 ? "solid" : "soft"}
              color={index === breadcrumbs.length - 1 ? "primary" : "neutral"}
              onClick={() => handleBreadcrumbClick(category, index)}
              sx={{ cursor: 'pointer' }}
            >
              {category.name}
            </Chip>
          ))}
        </Breadcrumbs>
      )}

      {/* 返回上一级按钮 */}
      {breadcrumbs.length > 0 && (
        <Box sx={{ mb: 1, px: 2 }}>
          <Chip 
            size="sm" 
            variant="outlined" 
            onClick={handleGoBack}
            sx={{ cursor: 'pointer' }}
          >
            返回上一级
          </Chip>
        </Box>
      )}

      {/* 分类列表 */}
      <List>
        {loading ? (
          // 加载状态
          Array(5).fill(0).map((_, index) => (
            <ListItem key={index}>
              <Typography level="body-sm" color="neutral">
                加载中...
              </Typography>
            </ListItem>
          ))
        ) : categories.length > 0 ? (
          // 显示分类列表
          categories.map((category) => (
            <ListItem key={category.id}>
              <ListItemButton 
                onClick={() => handleCategoryClick(category)}
                selected={currentCategory?.id === category.id}
              >
                <Typography level="body-sm">
                  {category.name}
                  {category.isLeaf && <Chip size="sm" variant="soft" color="success" sx={{ ml: 1 }}>叶子</Chip>}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          // 无数据提示
          <ListItem>
            <Typography level="body-sm" color="neutral">
              暂无分类数据
            </Typography>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default CategoryNavigator; 