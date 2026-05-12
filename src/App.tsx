import { TooltipProvider } from "./components/ui/tooltip"
import { BuilderPage } from "./features/visual-builder/components/BuilderPage/BuilderPage"
import { ThemeProvider } from "./components/theme-provider"

export function App() {
  return (
    <ThemeProvider>
   <TooltipProvider>
    <BuilderPage/>
   </TooltipProvider>
   </ThemeProvider>
  )
}

export default App
