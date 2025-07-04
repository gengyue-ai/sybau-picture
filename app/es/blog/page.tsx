'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

// 西班牙语文本
const staticTexts = {
  'blog.title': 'Blog - Historias e Inspiración de Memes',
  'blog.description': 'Descubre las últimas tendencias, consejos y historias de éxito de la comunidad Sybau Picture.',
  'blog.search.placeholder': 'Buscar artículos...',
  'blog.filter.all': 'Todos',
  'blog.filter.success': 'Historias de Éxito',
  'blog.filter.trends': 'Tendencias',
  'blog.filter.tips': 'Consejos',
  'blog.filter.tech': 'Tecnología',
  'blog.readMore': 'Leer Más',
  'blog.readTime': 'min de lectura',
  'blog.noResults': 'No se encontraron artículos para tu búsqueda.',
  'blog.loading': 'Cargando artículos...',
  'blog.featured': 'Artículo Destacado',
  'blog.latest': 'Últimos Artículos',
  'blog.popular': 'Artículos Populares'
}

interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  imageUrl: string
  category: string
  tags: string[]
  author: string
  readTime: number
  publishedAt: string
  featured: boolean
  popular: boolean
}

export default function ESBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', name: staticTexts['blog.filter.all'] },
    { id: 'success-stories', name: staticTexts['blog.filter.success'] },
    { id: 'trends', name: staticTexts['blog.filter.trends'] },
    { id: 'tips', name: staticTexts['blog.filter.tips'] },
    { id: 'tech', name: staticTexts['blog.filter.tech'] }
  ]

  // 模拟博客数据（西班牙语版本）
  const mockPosts: BlogPost[] = [
    {
      id: 'historia-exito-maria',
      title: 'De Cero a Viral: La Historia de María',
      description: 'Descubre cómo María transformó una simple foto familiar en un meme que alcanzó 2 millones de visualizaciones.',
      content: 'La historia completa de cómo María se convirtió en una sensación viral...',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c4e1d9a8?w=400&h=300&fit=crop&auto=format',
      category: 'success-stories',
      tags: ['viral', 'éxito', 'familia'],
      author: 'Equipo Sybau',
      readTime: 5,
      publishedAt: '2024-01-15',
      featured: true,
      popular: true
    },
    {
      id: 'tendencias-memes-2024',
      title: 'Las Tendencias de Memes Más Populares de 2024',
      description: 'Explora los estilos de memes más trending este año y cómo crearlos con Sybau Picture.',
      content: 'Las tendencias de memes más populares incluyen...',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&auto=format',
      category: 'trends',
      tags: ['tendencias', '2024', 'viral'],
      author: 'Ana García',
      readTime: 8,
      publishedAt: '2024-01-10',
      featured: false,
      popular: true
    },
    {
      id: 'guia-memes-perfectos',
      title: 'Guía Completa: Cómo Crear Memes Perfectos',
      description: 'Tips y trucos profesionales para crear memes que realmente conecten con tu audiencia.',
      content: 'Crear el meme perfecto requiere estos elementos clave...',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&auto=format',
      category: 'tips',
      tags: ['guía', 'consejos', 'creación'],
      author: 'Carlos Mendez',
      readTime: 12,
      publishedAt: '2024-01-05',
      featured: false,
      popular: false
    },
    {
      id: 'ia-memes-futuro',
      title: 'El Futuro de los Memes: IA y Creatividad',
      description: 'Cómo la inteligencia artificial está revolucionando la creación de contenido viral.',
      content: 'La IA está cambiando fundamentalmente cómo creamos contenido...',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format',
      category: 'tech',
      tags: ['IA', 'futuro', 'tecnología'],
      author: 'Dr. Laura Sánchez',
      readTime: 10,
      publishedAt: '2023-12-28',
      featured: false,
      popular: true
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPosts(mockPosts)
      setFilteredPosts(mockPosts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filterPosts = useCallback(() => {
    let filtered = posts

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search) ||
        post.description.toLowerCase().includes(search) ||
        post.tags.some(tag => tag.toLowerCase().includes(search))
      )
    }

    setFilteredPosts(filtered)
  }, [posts, selectedCategory, searchTerm])

  useEffect(() => {
    filterPosts()
  }, [filterPosts])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">{staticTexts['blog.loading']}</p>
          </div>
        </div>
      </div>
    )
  }

  const featuredPost = posts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-white">
            {staticTexts['blog.title']}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
            {staticTexts['blog.description']}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={staticTexts['blog.search.placeholder']}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-xl ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'all' && !searchTerm && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                {staticTexts['blog.featured']}
              </Badge>
            </div>
            
            <Card className="overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="border-purple-200 text-purple-700">
                      {categories.find(cat => cat.id === featuredPost.category)?.name}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(featuredPost.publishedAt)}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {featuredPost.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime} {staticTexts['blog.readTime']}
                      </div>
                    </div>
                    
                    <Link href={`/blog/${featuredPost.id}`}>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-xl">
                        {staticTexts['blog.readMore']}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {selectedCategory === 'all' ? staticTexts['blog.latest'] : categories.find(cat => cat.id === selectedCategory)?.name}
          </h2>
          
          {regularPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{staticTexts['blog.noResults']}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden bg-white shadow-lg transition-all duration-300">
                  <div className="relative h-48">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    {post.popular && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        {staticTexts['blog.popular']}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs">
                        {categories.find(cat => cat.id === post.category)?.name}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime} {staticTexts['blog.readTime']}
                        </div>
                      </div>
                      
                      <Link href={`/blog/${post.id}`}>
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg">
                          {staticTexts['blog.readMore']}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
