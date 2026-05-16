'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Plus, Music, Image as ImageIcon, X, Trash2, Instagram, Mail } from 'lucide-react'
import Butterfly from '@/components/Butterfly'
import Peony from '@/components/Peony'
import type { Post } from '@/pages/api/posts'

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.2, 0.8, 0.2, 1]
    }
  }
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const [posts, setPosts] = useState<Post[]>([])
  const [showComposer, setShowComposer] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'music'>('posts')
  
  const [newPost, setNewPost] = useState({
    content: '',
    images: [] as string[],
    type: 'text' as 'text' | 'image' | 'mixed'
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data)
    } catch (e) {
      console.error('Error loading posts:', e)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target?.result as string)
        reader.readAsDataURL(file)
      })
    })
    
    Promise.all(promises).then(images => {
      setNewPost(prev => ({
        ...prev,
        images: [...prev.images, ...images],
        type: images.length > 0 ? (prev.content ? 'mixed' : 'image') : prev.type
      }))
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      
      setShowComposer(false)
      setNewPost({ content: '', images: [], type: 'text' })
      loadPosts()
    } catch (e) {
      console.error('Error creating post:', e)
    }
  }

  const removeImage = (index: number) => {
    setNewPost(prev => {
      const newImages = [...prev.images]
      newImages.splice(index, 1)
      return {
        ...prev,
        images: newImages,
        type: newImages.length > 0 ? (prev.content ? 'mixed' : 'image') : 'text'
      }
    })
  }

  return (
    <div className="min-h-screen bg-lavender-50 relative overflow-hidden">
      <div className="fixed inset-0 paper-texture z-0" />
      
      <Butterfly size="lg" x={85} y={12} delay={0} />
      <Butterfly size="md" x={15} y={35} delay={1.5} />
      <Butterfly size="sm" x={75} y={65} delay={3} />
      <Peony size="xl" x={92} y={88} delay={0.5} />
      <Peony size="md" x={8} y={80} delay={2} />
      <Peony size="sm" x={60} y={10} delay={4} />

      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-4">
        <a 
          href="https://www.instagram.com/u_u4141?igsh=dG5lNzd5a205cnY%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-lavender-700 hover:bg-white/80 hover:scale-110 transition-all duration-300"
        >
          <Instagram size={20} />
        </a>
        <a 
          href="https://xhslink.com/m/7Dms5LL6Y5s"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-lavender-700 hover:bg-white/80 hover:scale-110 transition-all duration-300"
        >
          <div className="w-5 h-5 flex items-center justify-center text-xs font-bold">
            红
          </div>
        </a>
      </div>

      <div className="min-h-screen flex flex-col relative z-10">
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            className="max-w-3xl text-center"
          >
            <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-light italic text-lavender-800 mb-6 leading-tight">
              When the world is meaningless,
              <br />
              <span className="text-lavender-600">I will wear headphones</span>
              <br />
              with your voice.
            </h1>
            <p className="font-playfair text-lg md:text-xl text-lavender-500 tracking-widest mt-12">
              personal visual diary
            </p>
          </motion.div>
        </section>

        <nav className="flex justify-center gap-8 py-8 border-t border-lavender-200/30">
          <button
            onClick={() => setActiveTab('posts')}
            className={`font-playfair text-lg tracking-widest transition-all duration-300 ${
              activeTab === 'posts' 
                ? 'text-lavender-700 border-b-2 border-lavender-400 pb-2' 
                : 'text-lavender-500 hover:text-lavender-600'
            }`}
          >
            Entries
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`font-playfair text-lg tracking-widest transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'music' 
                ? 'text-lavender-700 border-b-2 border-lavender-400 pb-2' 
                : 'text-lavender-500 hover:text-lavender-600'
            }`}
          >
            <Music size={18} />
            Music
          </button>
          <button
            onClick={() => setShowComposer(true)}
            className="font-playfair text-lg tracking-widest text-lavender-500 hover:text-lavender-700 transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={18} />
            New
          </button>
        </nav>

        <main className="flex-1 max-w-5xl mx-auto px-6 pb-32">
          {activeTab === 'posts' && (
            <div className="space-y-16">
              {posts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-cormorant text-2xl text-lavender-500 italic">
                    No entries yet... start your diary
                  </p>
                </div>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={animationVariants}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <PostCard post={post} onDelete={() => loadPosts()} />
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'music' && (
            <div className="text-center py-20">
              <p className="font-cormorant text-2xl text-lavender-500 italic">
                Music player coming soon...
              </p>
            </div>
          )}
        </main>
      </div>

      {showComposer && (
        <Composer
          newPost={newPost}
          setNewPost={setNewPost}
          onSubmit={handleSubmit}
          onClose={() => setShowComposer(false)}
          onRemoveImage={removeImage}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
        />
      )}
    </div>
  )
}

function PostCard({ post, onDelete }: { post: Post; onDelete: () => void }) {
  const isTextOnly = post.type === 'text' || (post.content && post.images.length === 0)
  const imgCount = post.images.length
  
  let gridLayout = ''
  if (imgCount === 1) gridLayout = 'single'
  else if (imgCount === 2) gridLayout = 'two'
  else if (imgCount === 3) gridLayout = 'three'
  else if (imgCount === 4) gridLayout = 'four'
  else if (imgCount >= 5) gridLayout = 'masonry'

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 editorial-shadow border border-lavender-100/50 relative group">
      {isTextOnly ? (
        <blockquote className="text-center py-12">
          <p className="font-cormorant text-3xl md:text-4xl lg:text-5xl text-lavender-800 italic leading-relaxed">
            {post.content}
          </p>
        </blockquote>
      ) : (
        <>
          {post.content && (
            <p className="font-cormorant text-xl md:text-2xl text-lavender-700 mb-8 leading-relaxed">
              {post.content}
            </p>
          )}
          
          {imgCount > 0 && (
            <div className={`grid ${
              imgCount === 1 ? 'grid-cols-1' :
              imgCount === 2 ? 'grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4' :
              imgCount === 3 ? 'grid-cols-2 gap-4 md:gap-6' :
              imgCount === 4 ? 'grid-cols-2 gap-4 md:gap-6' :
              'columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6'
            }`}>
              {post.images.map((img, i) => (
                <div 
                  key={i}
                  className={`overflow-hidden rounded-xl ${
                    imgCount === 3 && i === 0 ? 'md:col-span-2' : ''
                  } ${
                    imgCount >= 5 ? 'break-inside-avoid mb-4 md:mb-6' : ''
                  }`}
                  style={{
                    transform: imgCount >= 2 && imgCount <= 4 ? `rotate(${Math.random() * 6 - 3}deg)` : 'none'
                  }}
                >
                  <img 
                    src={img} 
                    alt="" 
                    className="w-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ aspectRatio: i % 2 === 0 ? '4/3' : '3/4' }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-lavender-200/50">
        <span className="font-playfair text-sm text-lavender-500 tracking-wide">
          {new Date(post.created_at).toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
        <button
          onClick={onDelete}
          className="text-lavender-400 hover:text-lavender-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

function Composer({
  newPost,
  setNewPost,
  onSubmit,
  onClose,
  onRemoveImage,
  fileInputRef,
  onFileSelect
}: any) {
  return (
    <div className="fixed inset-0 bg-lavender-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white/85 backdrop-blur-xl rounded-3xl w-full max-w-2xl p-8 md:p-12 editorial-shadow border border-lavender-100/60"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-cormorant text-3xl text-lavender-800 italic">
            Create Entry
          </h2>
          <button
            onClick={onClose}
            className="text-lavender-500 hover:text-lavender-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex gap-3 border-b border-lavender-200/60 pb-4">
            {(['text', 'image', 'mixed'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setNewPost(prev => ({ ...prev, type }))}
                className={`px-4 py-2 rounded-full text-sm font-playfair transition-all duration-300 ${
                  newPost.type === type
                    ? 'bg-lavender-100 text-lavender-700'
                    : 'text-lavender-500 hover:bg-lavender-50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ 
              ...prev, 
              content: e.target.value,
              type: prev.images.length > 0 ? (e.target.value ? 'mixed' : 'image') : 'text'
            }))}
            placeholder="Write something beautiful..."
            className="w-full h-40 bg-white/50 border border-lavender-200 rounded-2xl p-6 text-lavender-800 font-cormorant text-xl focus:outline-none focus:border-lavender-400 transition-colors"
          />

          {newPost.type !== 'text' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-lavender-300 rounded-2xl p-10 text-center cursor-pointer hover:border-lavender-400 hover:bg-lavender-50/50 transition-all duration-300"
              >
                <ImageIcon className="mx-auto text-lavender-400 mb-2" size={32} />
                <p className="font-playfair text-lavender-600">Click or drag images</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={onFileSelect}
                />
              </div>

              {newPost.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {newPost.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(i)}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} className="text-lavender-800" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!newPost.content && newPost.images.length === 0}
            className="w-full py-4 bg-gradient-to-r from-lavender-300 to-lavender-200 text-lavender-800 font-playfair text-lg tracking-widest rounded-2xl hover:from-lavender-400 hover:to-lavender-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish
          </button>
        </form>
      </motion.div>
    </div>
  )
}
