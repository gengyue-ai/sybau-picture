import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Upload, Download, Share2, Heart, Star, Zap, Clock, Target, TrendingUp, Award, Users, CheckCircle, Sparkles, Rocket, Play, Shield, Award as AwardIcon, Camera, Paintbrush, Wand2 } from 'lucide-react'
import { Metadata } from 'next'
import ImageGeneratorFixed from '@/components/ImageGeneratorFixed'

export const metadata: Metadata = {
  title: 'Bildgenerator - Erstelle Erstaunliche KI-Generierte Memes | Sybau Picture',
  description: 'Verwenden Sie unseren fortschrittlichen Bildgenerator, um jedes Foto in Sekunden in virale Sybau-Memes zu verwandeln. Kostenlos, schnell, keine Registrierung erforderlich. Erleben Sie die Kraft unseres KI-gesteuerten Bildgenerators.',
  keywords: ['Bildgenerator', 'KI-Bildgenerator', 'Sybau-Bildgenerator', 'Meme-Generator', 'Kostenloser Bildgenerator', 'KI-Tools', 'Bildbearbeitung'],
}

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Fortschrittliche KI-Technologie",
    description: "Hochmoderne KI-Algorithmen für perfekte Ergebnisse",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Blitzschnelle Generierung",
    description: "Erstellen Sie Memes in nur 8 Sekunden mit unserem optimierten System",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Sicher und Privat",
    description: "Ihre Bilder werden sicher verarbeitet und niemals gespeichert",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Professionelle Qualität",
    description: "Studioqualität-Ergebnisse bei jeder Nutzung",
    color: "from-blue-500 to-indigo-500"
  }
]

const steps = [
  {
    number: "1",
    title: "Laden Sie Ihr Foto Hoch",
    description: "Wählen Sie ein beliebiges Bild von Ihrem Gerät. JPG-, PNG- und WebP-Formate werden unterstützt.",
    icon: <Upload className="w-8 h-8" />
  },
  {
    number: "2",
    title: "Wählen Sie Sybau-Stil",
    description: "Wählen Sie aus unseren Sybau Lazer Dim 700 Stilen und passen Sie die Intensität nach Ihren Wünschen an.",
    icon: <Wand2 className="w-8 h-8" />
  },
  {
    number: "3",
    title: "Magische KI-Generierung",
    description: "Unsere fortschrittliche KI verwandelt Ihr Foto in wenigen Sekunden in ein urkomisches Sybau-Meme.",
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    number: "4",
    title: "Herunterladen und Teilen",
    description: "Laden Sie Ihre Kreation herunter und teilen Sie sie auf Ihren bevorzugten Plattformen, um viral zu werden!",
    icon: <Download className="w-8 h-8" />
  }
]

const testimonials = [
  {
    name: "Anna Schmidt",
    role: "Content-Erstellerin",
    content: "Sybau Picture hat meine Content-Erstellung revolutioniert. Die Memes, die ich erstelle, werden viral!",
    rating: 5,
    avatar: "👩‍🎨"
  },
  {
    name: "Max Müller",
    role: "Social Media Manager",
    content: "Unglaublich! Ich kann dutzende Memes in wenigen Minuten erstellen. Meine Kunden lieben es!",
    rating: 5,
    avatar: "👨‍💼"
  },
  {
    name: "Lisa Weber",
    role: "Influencerin",
    content: "Die Qualität ist außergewöhnlich und es ist so einfach zu benutzen. Perfekt für meine sozialen Medien!",
    rating: 5,
    avatar: "🎭"
  }
]

const faqData = [
  {
    question: "Ist der Sybau-Bildgenerator wirklich kostenlos?",
    answer: "Ja! Unser Sybau-Bildgenerator ist völlig kostenlos. Keine versteckten Kosten, keine Registrierung erforderlich."
  },
  {
    question: "Welche Bildformate werden unterstützt?",
    answer: "Unser Bildgenerator unterstützt JPG-, PNG- und WebP-Formate. Laden Sie einfach Ihr Bild hoch und lassen Sie die KI ihre Magie wirken!"
  },
  {
    question: "Wie lange dauert die Generierung?",
    answer: "Der Sybau-Generierungsprozess dauert nur 8 Sekunden! Unsere optimierte KI gewährleistet schnelle Ergebnisse ohne Qualitätsverlust."
  },
  {
    question: "Kann ich die generierten Bilder kommerziell nutzen?",
    answer: "Ja! Alle mit unserem Sybau-Bildgenerator erstellten Bilder können für persönliche und kommerzielle Zwecke verwendet werden."
  }
]

const stats = [
  { number: '1,250,000+', label: 'Bilder pro Monat generiert' },
  { number: '250,000+', label: 'Aktive Benutzer pro Monat' },
  { number: '4.9/5', label: 'Benutzerbewertung' },
  { number: '150+', label: 'Unterstützte Länder' }
]

export default function DEGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/de" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Zur Startseite</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Sybau Bildgenerator</span>
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
              KI-Bildgenerator
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              Leistungsstarker KI-Bildgenerator
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Verwenden Sie unseren revolutionären Bildgenerator, um jedes Foto in Sekunden in virale Sybau-Memes zu verwandeln. Dieser Bildgenerator nutzt modernste KI-Technologie für die beste Bildgenerierungserfahrung.
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
              Jetzt Starten
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-200 text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Mehr Erfahren
            </Button>
          </div>
        </div>

        {/* Bildgenerator Funktionsbereich */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Bildgenerator Verwenden</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Laden Sie Ihr Foto hoch oder geben Sie einen Prompt ein, damit die KI einzigartige Sybau-Stil-Memes erstellt
            </p>
          </div>

          <ImageGeneratorFixed
            texts={{
              uploadTitle: "Bild Hochladen",
              uploadDescription: "Laden Sie Ihr Foto in unseren KI-Bildgenerator hoch",
              uploadPlaceholder: "Bilddatei auswählen",
              settingsTitle: "Bildgenerator Einstellungen",
              settingsDescription: "Passen Sie Ihre Bildgenerator-Parameter an",
              styleLabel: "Stil Auswahl",
              styleOption: "Klassisch Sybau",
              styleDescription: "Authentischer Sybau-Stil Bildgenerator",
              promptLabel: "Prompt (optional)",
              promptPlaceholder: "Beschreiben Sie den gewünschten Bildeffekt...",
              generateButton: "KI-Bild Generieren",
              downloadButton: "Bild Herunterladen",
              generating: "Generiere...",
              success: "Generierung erfolgreich!",
              error: "Generierung fehlgeschlagen",
              maxFileSize: "Max 5MB",
              supportedFormats: "JPG, PNG, WEBP unterstützt",
              dragAndDrop: "Bild hierher ziehen",
              clickToBrowse: "oder klicken Sie, um Datei auszuwählen"
            }}
          />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Bereit, den Bildgenerator zu verwenden?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Treten Sie Millionen von Benutzern bei und erleben Sie den fortschrittlichsten KI-Bildgenerator. Beginnen Sie jetzt mit der Erstellung Ihrer viralen Memes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Jetzt Starten
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Mehr Erfahren
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
