import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, LogIn, UserPlus } from "lucide-react";

export function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de login/registro
    console.log(isLogin ? "Login" : "Registro", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              EdgeAIEngine
            </h1>
          </div>
          <p className="text-muted-foreground">
            Plataforma de trading automatizado com IA
          </p>
        </div>

        {/* Formulário de Login/Registro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "Fazer Login" : "Criar Conta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {isLogin ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin 
                  ? "Não tem conta? Registre-se" 
                  : "Já tem conta? Faça login"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recursos */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ✨ Trading automatizado com IA
          </p>
          <p className="text-sm text-muted-foreground">
            📊 Análise avançada de mercado
          </p>
          <p className="text-sm text-muted-foreground">
            🚀 Backtest de estratégias
          </p>
        </div>
      </div>
    </div>
  );
}