import "@deslop/web-ui/styles.css"
import "@deslop/primitives/material-symbols.css"

import { MaterialSymbol } from "@deslop/primitives/material-symbols-react"
import { Button } from "@deslop/web-ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@deslop/web-ui/components/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@deslop/web-ui/components/dialog"
import { Toaster } from "@deslop/web-ui/components/sonner"
import { toast } from "@deslop/web-ui/toast"

export function App() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <MaterialSymbol name="search" aria-hidden />
            Открыть поиск
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Поиск</DialogTitle>
          <DialogDescription>Публичные типы работают с React 18.</DialogDescription>
          <Button onClick={() => toast("Готово")}>Проверить toast</Button>
        </DialogContent>
      </Dialog>
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button variant="outline">Дополнительные параметры</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>Публичные props доступны потребителю.</CollapsibleContent>
      </Collapsible>
      <Toaster />
    </>
  )
}
