import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Card className="border-border/80 bg-card/90 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Sign in with your email to manage and track your food orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-1 bg-muted/40 p-3 rounded-xl">
          <p className="font-semibold text-foreground">Demo Credentials:</p>
          <p>👤 Customer: <span className="font-mono text-primary font-medium">user@fooddash.com</span> / <span className="font-mono">user123</span></p>
          <p>👨‍🍳 Kitchen Admin: <span className="font-mono text-primary font-medium">admin@fooddash.com</span> / <span className="font-mono">admin123</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
