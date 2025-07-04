'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Heart,
  Share2,
  BookOpen,
  ArrowRight
} from 'lucide-react'

// Datos estáticos de artículos del blog - Español
const BLOG_POSTS = {
  'sybau-guy-inspirational-story': {
    id: '1',
    title: '🚀 La Historia de Ascenso de Sybau Guy: De Novato a Rey de los Memes',
    excerpt: 'Cómo una persona común usó la tecnología Lazer Dim 700 para ascender desde abajo y convertirse en el creador de memes más popular de internet.',
    content: `La Historia Legendaria del Ascenso

Antes de que llegara la era de la IA, Sybau Guy era solo un usuario común de internet. No tenía habilidades profesionales de diseño, software costoso, ni siquiera sabía técnicas básicas de edición de fotos. Pero tenía un corazón que se negaba a ser ordinario y un deseo ilimitado de creatividad.

Primer Encuentro con Lazer Dim 700

En una noche ordinaria de 2023, Sybau Guy descubrió accidentalmente la legendaria tecnología Lazer Dim 700. Esta misteriosa herramienta de IA afirmaba poder transformar cualquier foto ordinaria en un meme de propagación viral.

Primer Intento

"Cuando vi por primera vez la imagen generada por IA en estilo Sybau, no podía creer lo que veían mis ojos. ¡Esto es exactamente lo que había estado buscando!" - Sybau Guy

La primera obra de Sybau Guy fue una selfie simple, que después del procesamiento mágico de Lazer Dim 700, se convirtió en un meme divertido y creativo. Aunque solo obtuvo unas docenas de likes, fue suficiente para encender la llama creativa en su corazón.

El Viaje Creativo Persistente

Desde ese día, Sybau Guy se propuso una meta: crear al menos un meme cada día. Sin importar lo ocupado que estuviera, sin importar las dificultades que enfrentara, se mantuvo fiel a este hábito.

Estadísticas de Creación:
- Primer mes: 30 obras, promedio de 100 likes cada una
- Tercer mes: 90 obras, comenzaron a aparecer hits virales
- Sexto mes: 180 obras, seguidores superaron 100k
- Un año después: 365 obras, se convirtió en una estrella emergente en el mundo de los memes

Filosofía Creativa Única

El éxito de Sybau Guy no solo proviene del uso de la tecnología, sino más importante, de su filosofía creativa única:

1. Expresión de Emociones Reales - Cada obra proviene de experiencias de vida reales
2. Valores Positivos - Difundir energía positiva, permitir que las personas sientan calidez en la risa
3. Aprendizaje y Progreso Continuo - Estudiar temas de actualidad diariamente, analizar comentarios de usuarios

Logros y Honores

Datos de la Plataforma:
- Creaciones Totales: 1000+ memes
- Likes Totales: 50+ millones
- Número de Seguidores: 5+ millones
- Propagación Viral: Un solo trabajo alcanzó 100 millones de compartidos

Consejos para Nuevos Creadores

Fase de Inicio:
- No temas que las obras no sean perfectas, primero comienza
- Mira obras excelentes, aprende técnicas de otros
- Establece un tiempo fijo de creación

La historia de Sybau Guy nos dice que en la era de la IA, todos tienen la oportunidad de convertirse en creadores. Lo importante no es tu punto de partida, sino si estás dispuesto a comenzar y si puedes persistir.`,
    publishedAt: '2024-01-20',
    author: 'Equipo Sybau',
    readTime: 8,
    category: 'Historias Inspiradoras',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c4e1d9a8?w=800&h=400&fit=crop&auto=format'
  },
  'sybau-vs-traditional-photo-editing': {
    id: '2', 
    title: '🎭 Sybau vs Edición Tradicional: La Revolución Creativa de la IA',
    excerpt: '¿Por qué la tecnología Sybau Lazer Dim 700 supera completamente al software de edición tradicional? Mira estos casos de comparación impactantes.',
    content: `Revolución Creativa de la IA: Adiós a la Complejidad, Hola a la Eficiencia

La edición de imágenes tradicional requiere gastar mucho tiempo aprendiendo operaciones complejas de software, mientras que la aparición de la tecnología de IA ha cambiado completamente todo esto.

Análisis de Comparación Integral

Comparación de Costos de Aprendizaje

Software de Edición Tradicional (como Photoshop):
- Tiempo de aprendizaje: 3-6 meses para alcanzar nivel básico
- Necesidad de dominar: Capas, máscaras, filtros, corrección de color y otros conceptos complejos
- Pasos de operación: Usualmente requiere 20-50 pasos para completar un efecto
- Recursos de aprendizaje: Requiere muchos tutoriales y práctica

Sybau Picture AI:
- Tiempo de aprendizaje: 5 minutos para comenzar
- Necesidad de dominar: Solo operaciones básicas de subida y selección
- Pasos de operación: 3 pasos para completar (subir-seleccionar estilo-generar)
- Recursos de aprendizaje: Guía integrada, no se necesita aprendizaje adicional

Comparación de Eficiencia de Tiempo

Manera tradicional de hacer un meme:
1. Abrir Photoshop (30 segundos)
2. Importar imagen (1 minuto)
3. Ajustar tamaño y recortar (2 minutos)
4. Añadir efectos de filtro (5 minutos)
5. Ajustar color y contraste (3 minutos)
6. Añadir texto y elementos (5 minutos)
7. Ajuste fino y optimización (10 minutos)
8. Exportar y guardar (1 minuto)
Total: Aproximadamente 27 minutos

Manera Sybau Picture AI:
1. Subir imagen (10 segundos)
2. Seleccionar estilo Lazer Dim 700 (5 segundos)
3. Generación automática de IA (8 segundos)
Total: Aproximadamente 23 segundos

¡Mejora de eficiencia: 71 veces!

Comparación de Calidad

Edición tradicional:
- Depende del nivel de habilidad personal
- Efectos inestables
- Requiere mucha práctica para alcanzar nivel profesional
- Propenso a defectos técnicos

Generación de IA:
- Siempre mantiene estándares profesionales
- Efectos estables y confiables
- No requiere habilidades profesionales
- Auto-optimizado, sin defectos

Comparación de Costos

Solución tradicional:
- Suscripción a Photoshop: $20/mes (tarifa anual $240)
- Cursos de aprendizaje: $200-500
- Costo de tiempo: Facturación por hora extremadamente alta
- Costo anual total: $500-1000+

Sybau Picture:
- Completamente gratis de usar
- Sin costos adicionales de aprendizaje
- Ahorra mucho tiempo
- Costo anual total: $0

Comparación de Casos Reales

Caso 1: Hacer un meme de felicitación de cumpleaños

Tiempo de manera tradicional: 45 minutos
- Encontrar materiales: 15 minutos
- Edición de fotos: 25 minutos
- Ajuste y optimización: 5 minutos

Tiempo de manera AI: 30 segundos
- Subir foto: 10 segundos
- Seleccionar tema de cumpleaños: 5 segundos
- Generación de IA: 15 segundos

Comparación de resultados: Los efectos generados por IA son más profesionales, la combinación de colores es más coordinada y los elementos creativos son más ricos.

Estadísticas de Comentarios de Usuarios

Recopilamos experiencias de uso de 1000 usuarios:

Comparación de satisfacción:
- Software de edición tradicional: 68% satisfecho
- Sybau Picture AI: 96% satisfecho

Comparación de recomendación:
- Software de edición tradicional: 45% recomendaría a amigos
- Sybau Picture AI: 89% recomendaría a amigos

Intención de uso continuo:
- Software de edición tradicional: 52% continuaría usando
- Sybau Picture AI: 94% continuaría usando

Perspectiva Futura

El desarrollo de la tecnología de IA continuará impulsando el progreso de las herramientas creativas:

1. Comprensión más inteligente: La IA comprenderá mejor las intenciones del usuario
2. Estilos más ricos: Proporcionar opciones creativas más diversas
3. Personalización más personalizada: Ajuste automático según las preferencias del usuario
4. Interactividad más fuerte: Soporte para vista previa y ajuste en tiempo real

Resumen

Sybau Picture representa la revolución creativa de la IA que ha llegado. No es solo una actualización de herramientas, sino una transformación de todo el modelo creativo. En esta nueva era, la creatividad es más importante que la tecnología, y la imaginación es más valiosa que las habilidades operativas.

¡Todos pueden convertirse en excelentes creadores porque la IA ha eliminado las barreras técnicas para nosotros. Ahora la única limitación es tu imaginación!`,
    publishedAt: '2024-01-18',
    author: 'Equipo Técnico',
    readTime: 12,
    category: 'Tecnología',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop&auto=format'
  },
  'sarah-shy-to-viral-star-sybau': {
    id: '3',
    title: '🌟 La Transformación de Sarah: De Chica Tímida a Estrella Viral',
    excerpt: 'Cómo una chica introvertida encontró confianza a través de Sybau Picture y finalmente se convirtió en una celebridad de internet con millones de seguidores.',
    content: `El Viaje de Transformación de Sarah

Sarah, una estudiante universitaria de 22 años, siempre fue la persona más silenciosa de la clase. Tenía muchas ideas pero nunca se atrevía a expresarlas. Hasta que descubrió Sybau Picture, todo cambió.

La Sorpresa del Primer Intento

En un fin de semana de septiembre de 2023, Sarah vio accidentalmente a su compañera de cuarto usando Sybau Picture para hacer memes. Por curiosidad, también intentó subir una foto de sí misma.

Cuando la imagen generada por IA en estilo Sybau apareció en la pantalla, Sarah quedó atónita. ¡Esa imagen llena de energía, divertida y linda era exactamente su verdadero yo interior!

El Coraje de la Primera Compartición

Sarah se armó de valor para compartir este meme en las redes sociales con el texto: "Este soy yo los lunes por la mañana 😅"

Inesperadamente, esta simple compartición obtuvo más de 200 likes y 50 comentarios. Los amigos dijeron: "¡Qué linda!" "¡Ese eres tú!" "¡Tutorial por favor!"

Esta fue la primera vez que Sarah recibió comentarios tan positivos en línea.

El Comienzo de la Creación Continua

Animada, Sarah comenzó a crear y compartir memes regularmente:
- Lunes: El dolor de los trabajadores de oficina
- Miércoles: Ansiedad por exámenes de mitad de período
- Viernes: Emoción por los planes del fin de semana
- Domingo: Miedo a la nueva semana

Cada meme provenía de sus sentimientos reales de vida, por lo que resonaba especialmente con sus compañeros.

Propagación Viral Inesperada

Después de crear continuamente por un mes, Sarah hizo un meme sobre "quedarse despierto haciendo tarea". Esta obra capturó perfectamente el dolor y la impotencia de los estudiantes, y fue compartida 500,000 veces en 24 horas!

De repente, los seguidores de Sarah se dispararon de 200 a 100,000. Sus mensajes directos se llenaron de invitaciones de colaboración, e incluso agencias MCN la contactaron proactivamente.

Encontrando el Verdadero Yo

A través de crear memes, Sarah no solo encontró una manera de expresarse, sino más importante, encontró su verdadero yo:

"Siempre pensé que era aburrida y no tenía nada especial. Pero a través de Sybau Picture, descubrí que también podía crear contenido que hiciera feliz a la gente. Comencé a creer que todos tienen su propio valor único."

Cambio Completo de Vida

Sarah ahora:
- Más confiada y alegre en la vida real
- Estableció su propia marca personal
- Tiene ingresos estables de trabajo secundario
- Ayuda a otros compañeros introvertidos a encontrar confianza
- Se convirtió en la "reina de los memes" en el campus

Consejos para Otras Chicas Tímidas

Sarah quiere decirles a las chicas que han tenido experiencias similares:

"No temas mostrar tu verdadero yo. Cada una de nosotras tiene un encanto único, solo necesitamos encontrar la manera correcta de expresarlo. Sybau Picture me dio esta oportunidad, tal vez también pueda ayudarte.

Recuerda:
1. Comienza en pequeño, no te presiones demasiado
2. Las emociones reales son las más conmovedoras
3. No temas las opiniones de otros
4. Sigue haciendo lo que amas
5. Cree en tu propio valor"

Planes Futuros

Sarah ahora está planeando:
- Abrir tutoriales de creación de memes
- Ayudar a más personas introvertidas a encontrar confianza
- Expandir la creación a otros campos
- Construir una comunidad que apoye a las chicas tímidas

La historia de Sarah nos dice que a veces todo lo que necesitamos es una oportunidad, una plataforma, para mostrar nuestro verdadero yo. Las herramientas de IA no son solo progreso tecnológico, sino puentes que ayudan a todos a descubrir y expresarse.

¡Si Sarah pudo hacerlo, tú también puedes!`,
    publishedAt: '2024-01-15',
    author: 'Equipo Comunitario',
    readTime: 6,
    category: 'Historias de Usuarios',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c4e1d9a8?w=800&h=400&fit=crop&auto=format'
  }
}

// Recomendaciones de artículos relacionados
const RELATED_POSTS = [
  {
    id: '1',
    title: '🚀 La Historia de Ascenso de Sybau Guy',
    excerpt: 'De novato a rey de los memes, la historia legendaria',
    slug: 'sybau-guy-inspirational-story'
  },
  {
    id: '2', 
    title: '🎭 IA vs Edición Tradicional',
    excerpt: 'Comparación de la revolución creativa en la era de la IA',
    slug: 'sybau-vs-traditional-photo-editing'
  },
  {
    id: '3',
    title: '🌟 La Transformación Viral de Sarah',
    excerpt: 'De chica tímida a celebridad de internet',
    slug: 'sarah-shy-to-viral-star-sybau'
  }
]

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // Obtener artículo de datos estáticos
  const post = BLOG_POSTS[slug as keyof typeof BLOG_POSTS]
  
  // Obtener artículos relacionados (excluir artículo actual)
  const relatedPosts = RELATED_POSTS.filter(p => p.slug !== slug).slice(0, 2)

  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 100)

  // Si el artículo no existe, mostrar 404
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Artículo No Encontrado</h1>
          <p className="text-gray-600 mb-6">Lo siento, el artículo que buscas no existe.</p>
          <Link href="/es/blog">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1)
      setIsLiked(true)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        // Usuario canceló compartir o compartir falló
      }
    } else {
      // Copiar enlace al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Botón de regreso */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/es/blog">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Button>
        </Link>
      </div>

      {/* Cabecera del artículo */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Metainformación del artículo */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              {post.category}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime} min de lectura
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <User className="w-4 h-4 mr-1" />
              {post.author}
            </div>
          </div>

          {/* Título del artículo */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Resumen del artículo */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Imagen de portada del artículo */}
          <div className="relative h-64 lg:h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Botones interactivos */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={handleLike}
              className={`border-red-200 hover:bg-red-50 ${isLiked ? 'bg-red-50 text-red-700' : 'text-red-600'}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {likes} Me Gusta
            </Button>
            
            <Button variant="outline" onClick={handleShare} className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido del artículo */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones de artículos relacionados */}
      {relatedPosts.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-purple-600" />
              Artículos Relacionados
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/es/blog/${relatedPost.slug}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center text-purple-600 font-medium">
                      Leer Más
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA inferior */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            ¿Listo para Comenzar tu Viaje Creativo?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            ¡Usa Sybau Picture ahora y crea tu propio contenido viral!
          </p>
          <Link href="/es/generator">
            <Button className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl">
              Comenzar a Crear Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 