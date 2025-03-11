import { Box, Button, IconButton, Input, Typography } from '@mui/joy'
import { KeyboardArrowLeft, KeyboardArrowRight, FirstPage, LastPage } from '@mui/icons-material'
import { useState, useEffect } from 'react'

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

/**
 * 自定义分页组件
 * @param props PaginationProps
 * @returns JSX.Element
 */
export default function Pagination({
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
      Array.from({ length: end - start + 1 }, (_, i) => start + i)

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

    const itemList = [
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

    return itemList
  }

  const buttonSizeProps = {
    sm: { size: 'sm', sx: { minWidth: 32, height: 32 } },
    md: { size: 'md', sx: { minWidth: 40, height: 40 } },
    lg: { size: 'lg', sx: { minWidth: 48, height: 48 } }
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
          <FirstPage />
        </IconButton>
      )}

      <IconButton
        {...buttonSizeProps}
        variant="outlined"
        color="neutral"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <KeyboardArrowLeft />
      </IconButton>

      {getPageNumbers().map((item, index) => (
        item === 'ellipsis' ? (
          <Typography key={`ellipsis-${index}`} sx={{ mx: 1 }}>...</Typography>
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
        <KeyboardArrowRight />
      </IconButton>

      {showLastButton && (
        <IconButton
          {...buttonSizeProps}
          variant="outlined"
          color="neutral"
          disabled={currentPage === count}
          onClick={() => handlePageChange(count)}
        >
          <LastPage />
        </IconButton>
      )}

      <Input
        size={size}
        placeholder="跳转到"
        value={inputPage}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyPress}
        sx={{ width: 80 }}
      />
    </Box>
  )
}