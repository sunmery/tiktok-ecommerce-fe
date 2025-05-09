import { createLazyFileRoute } from '@tanstack/react-router';
import Page from "@/features/dashboard/admin/sensitiveWords";

export const Route = createLazyFileRoute('/admin/sensitiveWords/')({
  component: Page,
});

