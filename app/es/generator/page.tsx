import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Upload, Download, Share2, Heart, Star, Zap, Clock, Target, TrendingUp, Award, Users, CheckCircle, Sparkles, Rocket, Play, Shield, Award as AwardIcon, Camera, Paintbrush, Wand2 } from 'lucide-react'
import { Metadata } from 'next'
import ImageGeneratorFixed from '@/components/ImageGeneratorFixed'

export const metadata: Metadata = {
  title: 'Generador de Imágenes - Crea Memes IA Increíbles | Sybau Picture',
  description: 'Usa nuestro generador de imágenes avanzado para transformar cualquier foto en memes Sybau virales en segundos. Gratis, rápido, sin registro requerido. Experimenta el poder de nuestro generador de imágenes impulsado por IA.',
  keywords: ['generador de imágenes', 'generador de imágenes IA', 'generador de imágenes Sybau', 'generador de memes', 'generador de imágenes gratis', 'herramientas IA', 'editor de imágenes'],
}

const features = [
  {
    icon: Zap,
    title: 'Generador de Imágenes Ultra Rápido',
    description: 'Nuestro generador de imágenes AI crea memes de calidad profesional en 8 segundos, 100x más rápido que los generadores tradicionales.'
  },
  {
    icon: Heart,
    title: 'Generador de Imágenes Amigable',
    description: '¡Sin experiencia en diseño! Nuestro generador de imágenes tiene una interfaz simple e intuitiva que cualquiera puede usar.'
  },
  {
    icon: Star,
    title: 'Resultados de Alta Calidad',
    description: 'Cada salida del generador de imágenes está optimizada por AI para asegurar la mejor calidad y potencial viral.'
  }
]

const workflow = [
  {
    step: '1',
    title: 'Subir al Generador',
    description: 'Arrastra y suelta tu foto a nuestro generador de imágenes, soporta JPG, PNG, WEBP.',
    icon: Upload,
    color: 'from-blue-400 to-blue-600'
  },
  {
    step: '2',
    title: 'Procesamiento AI del Generador',
    description: 'Nuestro generador de imágenes AI avanzado analiza tu imagen y aplica la transformación estilo Sybau.',
    icon: Wand2,
    color: 'from-purple-400 to-purple-600'
  },
  {
    step: '3',
    title: 'Descarga del Generador',
    description: 'Descarga tu meme viral desde el generador de imágenes, listo para compartir en redes sociales.',
    icon: Download,
    color: 'from-green-400 to-green-600'
  }
]

const tips = [
  {
    icon: Camera,
    title: 'Elige Imágenes Claras',
    description: 'El generador de imágenes funciona mejor con imágenes de alta calidad y bien iluminadas.'
  },
  {
    icon: Users,
    title: 'Mejores Resultados con Caras',
    description: 'El generador de imágenes está especialmente optimizado para expresiones faciales, produciendo resultados más divertidos.'
  },
  {
    icon: Target,
    title: 'Prueba Diferentes Ángulos',
    description: 'El generador de imágenes puede manejar varios ángulos, experimenta con diferentes poses para efectos únicos.'
  },
  {
    icon: Sparkles,
    title: 'Experimenta con Estilos',
    description: 'El generador de imágenes ofrece múltiples opciones de estilo, encuentra el que mejor se adapte a ti.'
  }
]

const stats = [
  { number: '1,250,000+', label: 'Imágenes Generadas por Mes' },
  { number: '250,000+', label: 'Usuarios Activos por Mes' },
  { number: '4.9/5', label: 'Calificación de Usuario' },
  { number: '150+', label: 'Países Soportados' }
]

const testimonials = [
  {
    name: 'María González',
    role: 'Creadora de Contenido',
    content: '¡Este generador de imágenes es increíble! Mis memes creados con el generador obtuvieron millones de visualizaciones.',
    rating: 5
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Gerente de Redes Sociales',
    content: '¡La mejor herramienta de generador de imágenes! Nuestro equipo usa este generador todos los días.',
    rating: 5
  },
  {
    name: 'Ana López',
    role: 'Especialista en Marketing',
    content: 'El generador de imágenes ayudó a nuestra marca a crear contenido viral. ¡Altamente recomendado!',
    rating: 5
  }
]

export default function ESGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/es" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al Inicio</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Sybau Generador de Imágenes</span>
          </div>

          <div></div>
        </div>
      </header>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Generador de Imágenes IA
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              Generador de Imágenes IA Poderoso
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Usa nuestro generador de imágenes revolucionario para transformar cualquier foto en memes Sybau virales en segundos. Este generador de imágenes utiliza tecnología IA de vanguardia para la mejor experiencia de generación de imágenes.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Empezar Ahora
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-200 text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Saber Más
            </Button>
          </div>
        </div>

        {/* Área de Funcionalidad del Generador de Imágenes */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Comenzar a Usar el Generador de Imágenes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sube tu foto o ingresa un prompt para que la IA cree memes únicos de estilo Sybau
            </p>
          </div>

          <ImageGeneratorFixed
            texts={{
              uploadTitle: "Subir Imagen",
              uploadDescription: "Sube tu foto a nuestro generador de imágenes IA",
              uploadPlaceholder: "Seleccionar archivo de imagen",
              settingsTitle: "Configuración del Generador",
              settingsDescription: "Personaliza los parámetros de tu generador de imágenes",
              styleLabel: "Selección de Estilo",
              styleOption: "Sybau Clásico",
              styleDescription: "Generador de imágenes de estilo Sybau auténtico",
              promptLabel: "Prompt (opcional)",
              promptPlaceholder: "Describe el efecto de imagen deseado...",
              generateButton: "Generar con IA",
              downloadButton: "Descargar Imagen",
              generating: "Generando...",
              success: "¡Generación exitosa!",
              error: "Error en la generación",
              maxFileSize: "Máx 5MB",
              supportedFormats: "JPG, PNG, WEBP soportados",
              dragAndDrop: "Arrastra la imagen aquí",
              clickToBrowse: "o haz clic para seleccionar archivo"
            }}
          />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">¿Listo para usar el generador de imágenes?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a millones de usuarios y experimenta el generador de imágenes IA más avanzado. ¡Comienza a crear tus memes virales ahora!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Empezar Ahora
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Saber Más
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
