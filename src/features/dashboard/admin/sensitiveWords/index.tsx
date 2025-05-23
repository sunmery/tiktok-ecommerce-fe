import {useTranslation} from "react-i18next";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {SensitiveWord} from "./type.ts";
import {sensitiveWordService} from "./api";
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select, Snackbar,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    Stack
} from "@mui/material";
import {Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";

export default function Page() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingWord, setEditingWord] = useState<SensitiveWord | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        wordId: null as number | null
    });

    // 获取敏感词列表
    const { data, isLoading, error } = useQuery({
        queryKey: ['sensitiveWords', page, rowsPerPage],
        queryFn: () => sensitiveWordService.getSensitiveWords({
            page: page + 1,
            pageSize: rowsPerPage
        })
    });

    // 添加敏感词
    const addMutation = useMutation({
        mutationFn: (words: SensitiveWord[]) =>
            sensitiveWordService.setSensitiveWords({ sensitiveWords: words }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sensitiveWords'] }).then(() => {
                console.log('invalidateQueries sensitiveWords')
            })
            setSnackbar({
                open: true,
                message: '敏感词添加成功！',
                severity: 'success'
            });
            handleCloseDialog();
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: `添加失败: ${error instanceof Error ? error.message : '未知错误'}`,
                severity: 'error'
            });
        }
    });

    // 更新敏感词
    const updateMutation = useMutation({
        mutationFn: (word: SensitiveWord) =>
            sensitiveWordService.updateSensitiveWord(word.id!, word),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sensitiveWords'] }).then(() => {
                console.log('invalidateQueries sensitiveWords')
            })
            setSnackbar({
                open: true,
                message: '敏感词更新成功！',
                severity: 'success'
            });
            handleCloseDialog();
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: `更新失败: ${error instanceof Error ? error.message : '未知错误'}`,
                severity: 'error'
            });
        }
    });

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = (word?: SensitiveWord) => {
        if (word) {
            setEditingWord(word);
        } else {
            setEditingWord({
                category: '',
                word: '',
                level: 1,
                isActive: true
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingWord(null);
    };

    const handleSaveWord = () => {
        if (editingWord && editingWord.word.trim() !== '') {
            if (editingWord.id) {
                updateMutation.mutate(editingWord);
            } else {
                addMutation.mutate([editingWord]);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // 打开删除确认对话框
    const handleOpenDeleteDialog = (wordId: number) => {
        setDeleteDialog({
            open: true,
            wordId
        });
    };

    // 关闭删除确认对话框
    const handleCloseDeleteDialog = () => {
        setDeleteDialog({
            open: false,
            wordId: null
        });
    };

    // 删除敏感词
    const deleteMutation = useMutation({
        mutationFn: (id: number) => sensitiveWordService.deleteSensitiveWord(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sensitiveWords'] }).then(() => {
                console.log('invalidateQueries sensitiveWords after delete')
            });
            setSnackbar({
                open: true,
                message: '敏感词删除成功！',
                severity: 'success'
            });
            handleCloseDeleteDialog();
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: `删除失败: ${error instanceof Error ? error.message : '未知错误'}`,
                severity: 'error'
            });
            handleCloseDeleteDialog();
        }
    });

    // 确认删除敏感词
    const handleConfirmDelete = () => {
        if (deleteDialog.wordId !== null) {
            deleteMutation.mutate(deleteDialog.wordId);
        }
    };

    // 敏感级别对应的颜色
    const getLevelColor = (level: number) => {
        switch (level) {
            case 1: return 'error';
            case 2: return 'warning';
            case 3: return 'info';
            default: return 'default';
        }
    };

    // 敏感级别对应的文本
    const getLevelText = (level: number) => {
        switch (level) {
            case 1: return '高';
            case 2: return '中';
            case 3: return '低';
            default: return '未知';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {t('admin.sensitiveWords.title')}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    {t('admin.sensitiveWords.add')}
                </Button>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('admin.sensitiveWords.id')}</TableCell>
                                <TableCell>{t('admin.sensitiveWords.word')}</TableCell>
                                <TableCell>{t('admin.sensitiveWords.category')}</TableCell>
                                <TableCell>{t('admin.sensitiveWords.level')}</TableCell>
                                <TableCell>{t('admin.sensitiveWords.status')}</TableCell>
                                <TableCell>{t('admin.sensitiveWords.createdAt')}</TableCell>
                                <TableCell>{t('admin.sensitiveWords.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">{t('common.loading')}</TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        {t('admin.sensitiveWords.loadError')}: {error.message}
                                    </TableCell>
                                </TableRow>
                            ) : data?.words && data.words.length > 0 ? (
                                data.words.map((word) => (
                                    <TableRow key={word.id} hover>
                                        <TableCell>{word.id}</TableCell>
                                        <TableCell>{word.word}</TableCell>
                                        <TableCell>{word.category}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getLevelText(word.level)}
                                                color={getLevelColor(word.level) as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={word.isActive ? '启用' : '禁用'}
                                                color={word.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {word.createdAt ? new Date(word.createdAt).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleOpenDialog(word)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(word.id!)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">{t('admin.sensitiveWords.noData')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={-1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={t('common.rowsPerPage')}
                    labelDisplayedRows={({ from, to }) => `${from}-${to}`}
                />
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingWord?.id ? t('admin.sensitiveWords.edit') : t('admin.sensitiveWords.add')}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label={t('admin.sensitiveWords.word')}
                            fullWidth
                            value={editingWord?.word || ''}
                            onChange={(e) => setEditingWord(prev => prev ? { ...prev, word: e.target.value } : null)}
                            required
                        />
                        <TextField
                            label={t('admin.sensitiveWords.category')}
                            fullWidth
                            value={editingWord?.category || ''}
                            onChange={(e) => setEditingWord(prev => prev ? { ...prev, category: e.target.value } : null)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>{t('admin.sensitiveWords.level')}</InputLabel>
                            <Select
                                value={editingWord?.level || 1}
                                label={t('admin.sensitiveWords.level')}
                                onChange={(e) => setEditingWord(prev => prev ? { ...prev, level: e.target.value as number } : null)}
                            >
                                <MenuItem value={1}>{t('admin.sensitiveWords.levelHigh')}</MenuItem>
                                <MenuItem value={2}>{t('admin.sensitiveWords.levelMedium')}</MenuItem>
                                <MenuItem value={3}>{t('admin.sensitiveWords.levelLow')}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editingWord?.isActive || false}
                                    onChange={(e) => setEditingWord(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                                />
                            }
                            label={t('admin.sensitiveWords.active')}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
                    <Button
                        onClick={handleSaveWord}
                        variant="contained"
                        disabled={!editingWord || editingWord.word.trim() === '' || addMutation.isPending || updateMutation.isPending}
                    >
                        {(addMutation.isPending || updateMutation.isPending) ? t('common.saving') : t('common.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* 删除确认对话框 */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    {t('admin.sensitiveWords.deleteConfirmTitle')}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {t('admin.sensitiveWords.deleteConfirmContent')}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? t('common.deleting') : t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
