import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Rocket, Users } from 'lucide-react'
import { Metadata } from 'next'
import ImageGeneratorFixed from '@/components/ImageGeneratorFixed'

export const metadata: Metadata = {
  title: 'Générateur d\'Images - Créer des Mèmes IA Incroyables | Sybau Picture',
  description: 'Utilisez notre générateur d\'images avancé pour transformer n\'importe quelle photo en mèmes Sybau viraux en quelques secondes. Gratuit, rapide, aucune inscription requise. Découvrez la puissance de notre générateur d\'images alimenté par IA.',
  keywords: ['générateur d\'images', 'générateur d\'images IA', 'générateur d\'images Sybau', 'générateur de mèmes', 'générateur d\'images gratuit', 'outils IA', 'éditeur d\'images'],
}

const stats = [
  { number: '1,250,000+', label: 'Images Générées par Mois' },
  { number: '250,000+', label: 'Utilisateurs Actifs par Mois' },
  { number: '4.9/5', label: 'Note Utilisateur' },
  { number: '150+', label: 'Pays Supportés' }
]

export default function FRGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/fr"
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'Accueil
            </Link>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Sparkles className="w-3 h-3 mr-1" />
                Générateur IA
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Générateur d'Images IA
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              Générateur d'Images IA Puissant
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Utilisez notre générateur d'images alimenté par IA de pointe pour transformer n'importe quelle photo en mèmes Sybau viraux.
              Ce générateur d'images utilise une technologie IA avancée pour offrir des résultats professionnels
              sans nécessiter de compétences en design.
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
              Commencer Maintenant
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-200 text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              En Savoir Plus
            </Button>
          </div>
        </div>

        {/* Générateur d'Images Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Commencer avec le Générateur d'Images</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Téléchargez votre photo ou entrez un prompt pour que l'IA crée des mèmes Sybau uniques
            </p>
          </div>

          <ImageGeneratorFixed
            texts={{
              uploadTitle: "Télécharger une Image",
              uploadDescription: "Téléchargez votre photo vers notre générateur d'images IA",
              uploadPlaceholder: "Sélectionner un fichier image",
              settingsTitle: "Paramètres du Générateur",
              settingsDescription: "Personnalisez les paramètres de votre générateur d'images",
              styleLabel: "Sélection du Style",
              styleOption: "Sybau Classique",
              styleDescription: "Générateur d'images au style Sybau authentique",
              promptLabel: "Prompt (optionnel)",
              promptPlaceholder: "Décrivez l'effet d'image souhaité...",
              generateButton: "Générer avec l'IA",
              downloadButton: "Télécharger l'Image",
              generating: "Génération en cours...",
              success: "Génération réussie !",
              error: "Échec de la génération",
              maxFileSize: "Max 5MB",
              supportedFormats: "JPG, PNG, WEBP supportés",
              dragAndDrop: "Glissez l'image ici",
              clickToBrowse: "ou cliquez pour sélectionner un fichier"
            }}
          />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Prêt à utiliser le générateur d'images ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des millions d'utilisateurs et découvrez le générateur d'images IA de pointe. Commencez à créer vos mèmes viraux maintenant !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Commencer Maintenant
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              En Savoir Plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
