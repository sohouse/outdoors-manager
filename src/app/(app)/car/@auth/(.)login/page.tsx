'use client'
import AModal from "../../login/page.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/components/ui/dialog.tsx"
import { useRouter } from "next/navigation"

const BModal = () => {

  const router = useRouter()
  const onOpenChange = (open: boolean) => {
    if (!open) router.back()
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>modal content</DialogTitle>
        </DialogHeader>
          <AModal />
      </DialogContent>
    </Dialog>
  )
}

export default BModal