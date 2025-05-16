import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Input, Option, Select, Typography } from '@mui/joy';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from "@mui/icons-material";
import { t } from "i18next";

interface PaginationProps {
    count: number
    page: number
    onChange: (event: React.SyntheticEvent, value: number) => void
    size?: 'sm' | 'md' | 'lg'
    showFirstButton?: boolean
    showLastButton?: boolean
    siblingCount?: number
    boundaryCount?: number
}
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


/**
 * 自定义分页组件
 * @param props PaginationProps
 * @returns JSX.Element
 */
function Pagination({
                                       count,
                                       page,
                                       onChange,
                                       size = 'md',
                                       showFirstButton = false,
                                       showLastButton = false,
                                       siblingCount = 1,
                                       boundaryCount = 1
                                   }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState(page)
    const [inputPage, setInputPage] = useState('')

    useEffect(() => {
        setCurrentPage(page)
    }, [page])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= count) {
            onChange({} as React.SyntheticEvent, newPage)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPage(e.target.value)
    }

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const pageNumber = parseInt(inputPage)
            if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= count) {
                handlePageChange(pageNumber)
                setInputPage('')
            }
        }
    }

    const getPageNumbers = () => {
        const range = (start: number, end: number) =>
            Array.from({length: end - start + 1}, (_, i) => start + i)

        const startPages = range(1, Math.min(boundaryCount, count))
        const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

        const siblingsStart = Math.max(
            Math.min(
                currentPage - siblingCount,
                count - boundaryCount - siblingCount * 2 - 1
            ),
            boundaryCount + 2
        )

        const siblingsEnd = Math.min(
            Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
            endPages.length > 0 ? endPages[0] - 2 : count - 1
        )

        return [
            ...startPages,
            ...(siblingsStart > boundaryCount + 2
                ? ['ellipsis']
                : boundaryCount + 1 < count - boundaryCount
                    ? [boundaryCount + 1]
                    : []),
            ...range(siblingsStart, siblingsEnd),
            ...(siblingsEnd < count - boundaryCount - 1
                ? ['ellipsis']
                : count - boundaryCount > boundaryCount
                    ? [count - boundaryCount]
                    : []),
            ...endPages
        ]
    }

    const buttonSizeProps = {
        sm: {size: 'sm' as const, sx: {minWidth: 32, height: 32}},
        md: {size: 'md' as const, sx: {minWidth: 40, height: 40}},
        lg: {size: 'lg' as const, sx: {minWidth: 48, height: 48}}
    }[size]

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}
        >
            {showFirstButton && (
                <IconButton
                    {...buttonSizeProps}
                    variant="outlined"
                    color="neutral"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    <FirstPage/>
                </IconButton>
            )}

            <IconButton
                {...buttonSizeProps}
                variant="outlined"
                color="neutral"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <KeyboardArrowLeft/>
            </IconButton>

            {getPageNumbers().map((item, index) => (
                item === 'ellipsis' ? (
                    <Typography key={`ellipsis-${index}`} sx={{mx: 1}}>...</Typography>
                ) : (
                    <Button
                        key={item}
                        {...buttonSizeProps}
                        variant={currentPage === item ? 'solid' : 'outlined'}
                        color={currentPage === item ? 'primary' : 'neutral'}
                        onClick={() => handlePageChange(item as number)}
                    >

                        {item}
                    </Button>
                )
            ))}

            <IconButton
                {...buttonSizeProps}
                variant="outlined"
                color="neutral"
                disabled={currentPage === count}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <KeyboardArrowRight/>
            </IconButton>

            {showLastButton && (
                <IconButton
                    {...buttonSizeProps}
                    variant="outlined"
                    color="neutral"
                    disabled={currentPage === count}
                    onClick={() => handlePageChange(count)}
                >
                    <LastPage/>
                </IconButton>
            )}

            <Input
                size={size}
                placeholder={t('pagination.inputPlaceholder')}
                value={inputPage}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyPress}
                sx={{width: 80}}
            />
        </Box>
    )
}
