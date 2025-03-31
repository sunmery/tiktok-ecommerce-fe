import { useState, useCallback } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalItems: (totalItems: number) => void;
  handlePageChange: (event: React.SyntheticEvent, value: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
}

/**
 * 分页逻辑处理钩子
 * @param props 初始页码、每页数量和总条目数
 * @returns 分页状态和处理函数
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems = 0,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(totalItems);

  // 计算总页数
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // 设置总条目数
  const setTotalItems = useCallback((count: number) => {
    setTotalCount(count);
  }, []);

  // 页码变化处理
  const handlePageChange = useCallback((_event: React.SyntheticEvent, value: number) => {
    if (value >= 1 && value <= totalPages) {
      setPage(value);
    }
  }, [totalPages]);

  // 每页数量变化处理
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    // 计算当前页在新的pageSize下应该处于哪一页
    const firstItemIndex = (page - 1) * pageSize;
    const newPage = Math.floor(firstItemIndex / newPageSize) + 1;
    
    setPageSize(newPageSize);
    setPage(newPage);
  }, [page, pageSize]);

  return {
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    setTotalItems,
    handlePageChange,
    handlePageSizeChange,
  };
} 