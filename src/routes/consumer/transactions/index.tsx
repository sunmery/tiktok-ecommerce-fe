import { createFileRoute } from '@tanstack/react-router'
import Transactions from "@/features/dashboard/consumer/transactions";

export const Route = createFileRoute('/consumer/transactions/')({
  component: Transactions,
})
