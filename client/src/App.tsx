import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import Onboarding from "./pages/Onboarding";
import OnboardingQuiz from "./pages/OnboardingQuiz";
import AuthPage from "./pages/Auth";
import OnCourtMode from "./pages/OnCourtMode";
import { Loader2 } from "lucide-react";

function Router() {
  const { authEnabled, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-t1-text">
        <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-t1-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading Coaches App
        </div>
      </div>
    );
  }

  if (authEnabled && !user) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/pathway" component={Pathway} />
        <Route path="/stage/:id" component={StagePage} />
        <Route path="/drills" component={DrillLibrary} />
        <Route path="/drills/:id" component={DrillDetail} />
        <Route path="/coach-standards" component={CoachStandards} />
        <Route path="/on-court" component={OnCourtMode} />
        <Route path="/session-builder" component={SessionBuilder} />
        <Route path="/assessments" component={Assessments} />
        <Route path="/advancement" component={Advancement} />
        <Route path="/session-plans" component={SessionPlans} />
        <Route path="/session-history" component={SessionHistory} />
        <Route path="/compare-plans" component={PlanComparison} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/onboarding/quiz" component={OnboardingQuiz} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
