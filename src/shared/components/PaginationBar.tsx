import React, {useEffect} from 'react';
import {Box, Option, Select, Typography} from '@mui/joy';
import Pagination from '@/components/Pagination';

interface PaginationBarProps {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    pageSizeOptions?: number[];
    onPageChange: (event: React.SyntheticEvent, value: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    showPageSizeSelector?: boolean;
    showTotalItems?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * 通用分页条组件，包含页码切换和每页数量选择
 */
const PaginationBar: React.FC<PaginationBarProps> = ({
                                                         page,
                                                         pageSize,
                                                         totalItems,
                                                         totalPages,
                                                         pageSizeOptions = [10, 20, 50, 100],
                                                         onPageChange,
                                                         onPageSizeChange,
                                                         showPageSizeSelector = true,
                                                         showTotalItems = true,
                                                         size = 'md',
                                                     }) => {
    // 确保页码在有效范围内
    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            onPageChange({} as React.SyntheticEvent, totalPages);
        }
    }, [page, totalPages, onPageChange]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                width: '100%',
                mt: 2,
                mb: 2,
            }}
        >
            {showTotalItems && (
                <Typography level="body-sm" sx={{flexShrink: 0, mr: 2}}>
                    共 {totalItems} 条记录，第 {page} / {totalPages} 页
                </Typography>
            )}

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 2
            }}>
                {showPageSizeSelector && (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Typography level="body-sm">每页显示</Typography>
                        <Select
                            value={pageSize.toString()}
                            onChange={(_, value) => {
                                if (value) {
                                    onPageSizeChange(Number(value));
                                }
                            }}
                            size={size}
                            sx={{minWidth: 70, height: 40}}
                        >
                            {pageSizeOptions.map((option) => (
                                <Option key={option} value={option.toString()}>
                                    {option}
                                </Option>
                            ))}
                        </Select>
                    </Box>
                )}

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={onPageChange}
                    size={size}
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Box>
    );
};

export default PaginationBar;
