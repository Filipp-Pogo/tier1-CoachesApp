import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pathway from "./pages/Pathway";
import StagePage from "./pages/StagePage";
import DrillLibrary from "./pages/DrillLibrary";
import DrillDetail from "./pages/DrillDetail";
import CoachStandards from "./pages/CoachStandards";
import SessionBuilder from "./pages/SessionBuilder";
import Assessments from "./pages/Assessments";
import Advancement from "./pages/Advancement";
import SessionPlans from "./pages/SessionPlans";
import SessionHistory from "./pages/SessionHistory";
import PlanComparison from "./pages/PlanComparison";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/pathway" component={Pathway} />
        <Route path="/stage/:id" component={StagePage} />
        <Route path="/drills" component={DrillLibrary} />
        <Route path="/drills/:id" component={DrillDetail} />
        <Route path="/coach-standards" component={CoachStandards} />
        <Route path="/session-builder" component={SessionBuilder} />
        <Route path="/assessments" component={Assessments} />
        <Route path="/advancement" component={Advancement} />
        <Route path="/session-plans" component={SessionPlans} />
        <Route path="/session-history" component={SessionHistory} />
        <Route path="/compare-plans" component={PlanComparison} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
