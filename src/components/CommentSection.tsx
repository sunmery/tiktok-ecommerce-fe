import React, {useState} from 'react';
import {Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, IconButton, Modal, ModalClose, ModalDialog, Stack, Textarea, Typography} from '@mui/joy';
import {Rating} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {userStore} from '@/store/user';
import {showMessage} from '@/utils/showMessage';
import {useSnapshot} from 'valtio';
import {formatDistanceToNow} from 'date-fns';
import {zhCN} from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {commentService} from '@/api/comment';
import {Comment} from '@/types/comment';

interface CommentSectionProps {
    productId: string;
    merchantId: string;
    canComment?: boolean;
    isCheckingOrders?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({productId, merchantId, canComment = false, isCheckingOrders = false}) => {
    const {t} = useTranslation();
    const {account} = useSnapshot(userStore);
    const [rating, setRating] = useState<number | null>(5);
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();
    const userState = useSnapshot(userStore);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    
    // 新增状态用于编辑评论
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentComment, setCurrentComment] = useState<Comment | null>(null);
    const [editRating, setEditRating] = useState<number>(5);
    const [editContent, setEditContent] = useState('');

    // 获取评论列表
    const {data: commentsData, isLoading} = useQuery({
        queryKey: ['comments', productId, page],
        queryFn: () => commentService.getComments({
            productId,
            merchantId,
            page,
            pageSize
        }),
    });

    // 提交评论
    const createCommentMutation = useMutation({
        mutationFn: () => {
            if (!userState.account.id) {
                throw new Error('请先登录');
            }
            if (!rating) {
                throw new Error('请选择评分');
            }
            if (!comment.trim()) {
                throw new Error('请输入评论内容');
            }
    
            return commentService.createComment({
                productId,
                merchantId,
                userId: userState.account.id,
                score: rating,
                content: comment.trim(),
            });
        },
        onSuccess: (response) => {
            if (response.isSensitive) {
                showMessage('评论包含敏感词，请修改后重试', 'error');
                return;
            }
            
            queryClient.invalidateQueries({queryKey: ['comments', productId]}).then(() => {
                console.log('评论列表已更新')
            })
            setComment('');
            setRating(5);
            showMessage('评论发布成功', 'success');
        },
        onError: (error: Error) => {
            showMessage(error.message, 'error');
        },
    });

    // 更新评论的 mutation
    const updateCommentMutation = useMutation({
        mutationFn: () => {
            if (!currentComment || !userState.account.id) {
                throw new Error('操作无效');
            }
            
            return commentService.updateComment({
                commentId: currentComment.id,
                userId: userState.account.id,
                score: editRating,
                content: editContent.trim(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comments', productId]});
            setEditModalOpen(false);
            setCurrentComment(null);
            showMessage('评论更新成功', 'success');
        },
        onError: (error: Error) => {
            showMessage(error.message, 'error');
        },
    });

    // 删除评论的 mutation
    const deleteCommentMutation = useMutation({
        mutationFn: () => {
            if (!currentComment || !userState.account.id) {
                throw new Error('操作无效');
            }
            
            return commentService.deleteComment({
                commentId: currentComment.id,
                userId: userState.account.id,
            });
        },
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({queryKey: ['comments', productId]});
                setDeleteModalOpen(false);
                setCurrentComment(null);
                showMessage('评论删除成功', 'success');
            } else {
                showMessage('评论删除失败', 'error');
            }
        },
        onError: (error: Error) => {
            showMessage(error.message, 'error');
        },
    });

    const handleSubmit = () => {
        createCommentMutation.mutate();
    };

    // 打开编辑评论模态框
    const handleOpenEditModal = (comment: Comment) => {
        setCurrentComment(comment);
        setEditRating(comment.score);
        setEditContent(comment.content);
        setEditModalOpen(true);
    };

    // 打开删除评论确认模态框
    const handleOpenDeleteModal = (comment: Comment) => {
        setCurrentComment(comment);
        setDeleteModalOpen(true);
    };

    // 提交编辑评论
    const handleUpdateComment = () => {
        if (!editContent.trim()) {
            showMessage('评论内容不能为空', 'error');
            return;
        }
        updateCommentMutation.mutate();
    };

    // 确认删除评论
    const handleDeleteComment = () => {
        deleteCommentMutation.mutate();
    };

    // 检查评论是否属于当前用户
    const isUserComment = (commentUserId: string) => {
        const currentUserId = account?.id || '';
        console.log('Current User ID:', currentUserId);
        console.log('Comment User ID:', commentUserId);
        // return currentUserId.toLowerCase() === commentUserId.toLowerCase(); TODO
        return true
    }

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Card variant="outlined" sx={{mt: 3}}>
            <CardContent>
                <Typography level="h3" sx={{mb: 2}}>
                    {t('商品评价')}
                </Typography>

                {isCheckingOrders ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                        <CircularProgress size="sm" />
                        <Typography level="body-md" sx={{ml: 2}}>
                            {t('正在检查订单状态...')}
                        </Typography>
                    </Box>
                ) : userState.account.id ? (
                    canComment ? (
                        <Box sx={{mb: 3}}>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography level="body-md" sx={{mb: 1}}>
                                        {t('评分')}
                                    </Typography>
                                    <Rating
                                        value={rating}
                                        onChange={(_, value) => setRating(value)}
                                    />
                                </Box>
                                <Box>
                                    <Typography level="body-md" sx={{mb: 1}}>
                                        {t('评论')}
                                    </Typography>
                                    <Textarea
                                        minRows={3}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder={t('请分享您的使用体验') || ''}
                                    />
                                </Box>
                                <Box>
                                    <Button
                                        onClick={handleSubmit}
                                        loading={createCommentMutation.isPending}
                                    >
                                        {t('发布评论')}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    ) : (
                        <Typography level="body-md" sx={{mb: 3, color: 'neutral.500'}}>
                            {t('只有购买并完成支付的用户才能发表评论')}
                        </Typography>
                    )
                ) : (
                    <Typography level="body-md" sx={{mb: 3, color: 'neutral.500'}}>
                        {t('请登录后发表评论')}
                    </Typography>
                )}

                <Divider/>

                <Box sx={{mt: 3}}>
                    <Typography level="title-lg" sx={{mb: 2}}>
                        {t('全部评论')} ({commentsData?.total || 0})
                    </Typography>

                    <Stack spacing={2}>
                        {commentsData?.comments?.map((comment: Comment) => (
                            <Card key={comment.id} variant="outlined">
                                <CardContent>
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between'}}>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <Avatar size="sm"/>
                                            <Box sx={{ml: 1}}>
                                                <Typography level="title-sm">
                                                    {comment.userId || '匿名用户'}
                                                </Typography>
                                                <Typography level="body-xs">
                                                    {formatDistanceToNow(new Date(comment.createdAt), {
                                                        addSuffix: true,
                                                        locale: zhCN,
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        {/* 评论操作按钮 - 确保条件正确 */}
                                        {isUserComment(comment.userId) && (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton 
                                                    size="sm" 
                                                    variant="plain" 
                                                    color="neutral"
                                                    onClick={() => handleOpenEditModal(comment)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="sm" 
                                                    variant="plain" 
                                                    color="danger"
                                                    onClick={() => handleOpenDeleteModal(comment)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                    <Rating readOnly value={comment.score}/>
                                    <Typography level="body-md" sx={{mt: 1}}>
                                        {comment.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                    {commentsData?.total > pageSize && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                            <Button
                                variant="outlined"
                                onClick={() => setPage(page + 1)}
                                disabled={page * pageSize >= (commentsData?.total || 0)}
                            >
                                {t('加载更多')}
                            </Button>
                        </Box>
                    )}
                </Box>
            </CardContent>

            {/* 编辑评论模态框 */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <ModalDialog>
                    <ModalClose />
                    <Typography level="h4">{t('编辑评论')}</Typography>
                    <Box sx={{my: 2}}>
                        <Typography level="body-md" sx={{mb: 1}}>
                            {t('评分')}
                        </Typography>
                        <Rating
                            value={editRating}
                            onChange={(_, value) => value && setEditRating(value)}
                        />
                    </Box>
                    <Box sx={{mb: 2}}>
                        <Typography level="body-md" sx={{mb: 1}}>
                            {t('评论内容')}
                        </Typography>
                        <Textarea
                            minRows={3}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                    </Box>
                    <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                        <Button 
                            variant="plain" 
                            color="neutral" 
                            onClick={() => setEditModalOpen(false)}
                        >
                            {t('取消')}
                        </Button>
                        <Button 
                            onClick={handleUpdateComment}
                            loading={updateCommentMutation.isPending}
                        >
                            {t('保存')}
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>

            {/* 删除评论确认模态框 */}
            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <ModalDialog>
                    <ModalClose />
                    <Typography level="h4">{t('删除评论')}</Typography>
                    <Typography level="body-md" sx={{my: 2}}>
                        {t('确定要删除这条评论吗？此操作无法撤销。')}
                    </Typography>
                    <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                        <Button 
                            variant="plain" 
                            color="neutral" 
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            {t('取消')}
                        </Button>
                        <Button 
                            color="danger"
                            onClick={handleDeleteComment}
                            loading={deleteCommentMutation.isPending}
                        >
                            {t('删除')}
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Card>
    );
};

export default CommentSection;
