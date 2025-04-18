import { createLazyFileRoute } from '@tanstack/react-router'
import XlsxTable from "@/shared/components/ui/Table";

export const Route = createLazyFileRoute('/merchant/table/')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <XlsxTable />
}
