import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Lightbulb, Rocket, Heart, Star, Users, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    "number": "1M+",
    "label": "Memes Criados"
  },
  {
    "number": "25K+",
    "label": "Usuários Ativos"
  },
  {
    "number": "50+",
    "label": "Países Atendidos"
  },
  {
    "number": "99.9%",
    "label": "Tempo de Atividade"
  }
]

export default function PTAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Sobre Nós</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Capacitando a Criatividade através da IA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Estamos em uma missão de democratizar a criação de memes, tornando a geração profissional de imagens com IA acessível a todos, em todos os lugares. Junte-se a milhões de criadores que já estão transformando suas ideias em conteúdo viral.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Breaking down barriers between imagination and creation. We believe everyone has the potential to create content that resonates, entertains, and connects people across cultures.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                A world where creativity knows no bounds. We envision a future where AI amplifies human creativity rather than replacing it.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Pronto para Começar a Criar?</h2>
              <p className="text-xl mb-8 text-purple-100">
                Junte-se a milhares de criadores que já estão fazendo conteúdo viral com Sybau Picture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pt/generator">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Rocket className="h-5 w-5 mr-2" />
                    Começar a Criar
                  </Button>
                </Link>
                <Link href="/pt/gallery">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white">
                    <Heart className="w-5 h-5 mr-2" />
                    Ver Exemplos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}