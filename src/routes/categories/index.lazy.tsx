import {createLazyFileRoute} from '@tanstack/react-router';
import {Categories} from '@/features/categories';

export const Route = createLazyFileRoute('/categories/')({
    component: Categories,
});
