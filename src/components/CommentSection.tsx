import React, {useState} from 'react';
import {Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, Stack, Textarea, Typography} from '@mui/joy';
import {Rating} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {userStore} from '@/store/user';
import {showMessage} from '@/utils/showMessage';
import {useSnapshot} from 'valtio';
import {formatDistanceToNow} from 'date-fns';
import {zhCN} from 'date-fns/locale';

interface Comment {
    id: number;
    productId: string;
    merchantId: string;
    userId: string;
    score: number;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface CommentSectionProps {
    productId: string;
    merchantId: string;
    canComment?: boolean;
    isCheckingOrders?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({productId, merchantId, canComment = false, isCheckingOrders = false}) => {
    const {t} = useTranslation();
    const [rating, setRating] = useState<number | null>(5);
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();
    const userState = useSnapshot(userStore);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // 获取评论列表
    const {data: commentsData, isLoading} = useQuery({
        queryKey: ['comments', productId, page],
        queryFn: async () => {
            const response = await fetch(`https://gw.localhost/v1/comments?productId=${productId}&merchantId=${merchantId}&page=${page}&pageSize=${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch comments');
            return response.json();
        },
    });

    // 提交评论
    const createCommentMutation = useMutation({
        mutationFn: async () => {
            if (!userState.account.id) {
                throw new Error('请先登录');
            }
            if (!rating) {
                throw new Error('请选择评分');
            }
            if (!comment.trim()) {
                throw new Error('请输入评论内容');
            }

            const response = await fetch('https://gw.localhost/v1/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId,
                    merchantId,
                    userId: userState.account.id,
                    score: rating,
                    content: comment.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create comment');
            }

            return response.json();
        },
        onSuccess: () => {
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

    const handleSubmit = () => {
        createCommentMutation.mutate();
    };

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
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
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
        </Card>
    );
};

export default CommentSection;
