'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Message, MessageBubble, ChatInput } from './components/ChatComponents'
import { AuthPage } from './components/AuthPage'
import { useAuth } from './lib/contextAPI'
import Spinner from './components/ui/Spinner'
import axiosInstance from './lib/apiInstanse'
import { rejects } from 'assert'

export default function ChatContent () {
  const { isAuthenticated, isReady } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome back! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isAuthenticated) {
      scrollToBottom()
    }
  }, [messages, isAuthenticated])

  const handleSendMessage = async (text: string) => {
    const chatroomId = '6cf9be10-af73-4620-a22a-f9c013354fa4'

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await axiosInstance.post(
        `/chatroom/${chatroomId}/message`,
        { message: text },
        { withCredentials: true }
      )
      await messagePooingHandler(response.data.jobId)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const messagePooingHandler = async (jobId: string): Promise<string> => {
    let lastLength = 0

    setMessages(prev => [
      ...prev,
      {
        id: jobId,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        isTyping: false
      }
    ])

    while (true) {
      const status = await axiosInstance.get(`/job/${jobId}/status`, {
        withCredentials: true
      })

      const { state, progress, result } = status.data

      if (progress?.full && progress.full.length > lastLength) {
        lastLength = progress.full.length

        setMessages(prev =>
          prev.map(msg =>
            msg.id === jobId ? { ...msg, text: progress.full } : msg
          )
        )
      }

      if (state === 'completed') {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === jobId ? { ...msg, text: result.response } : msg
          )
        )
        return result.response
      }

      if (state === 'failed') {
        throw new Error(status.data.reason ?? 'Job failed')
      }

      await new Promise(res => setTimeout(res, 500))
    }
  }

  if (!isReady) {
    return <Spinner />
  }
  if (!isAuthenticated) {
    return (
      <main className='min-h-screen relative overflow-hidden'>
        <div className='mesh-gradient' />
        <AuthPage />
      </main>
    )
  }

  return (
    <main className='flex flex-col min-h-screen relative bg-slate-950'>
      <div className='' />

      {/* Header - Centered Logo, Dropped Color */}
      <header className='fixed top-0 left-0 right-0 h-20 bg-slate-950 flex items-center justify-center px-6 z-50 transition-all duration-500'>
        {/* Spacer */}
        <div className='flex items-center gap-2 group cursor-pointer hover:rotate-2 transition-transform duration-500 '>
          <div className='w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-2xl rotate-3'>
            <span className='text-white dark:text-zinc-900 text-lg font-black italic'>
              P
            </span>
          </div>
          <span className='text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Promptly<span className='text-zinc-500'>.ai</span>
          </span>
        </div>
      </header>

      {/* Message Area */}
      <div className='flex-1 overflow-y-auto px-4 pt-24 pb-32 md:px-6'>
        <div className='max-w-3xl mx-auto space-y-5'>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className='flex justify-start animate-fade-in pl-1'>
              <div className='glass-card rounded-[1.5rem] px-6 py-4 shadow-sm border-white/20'>
                <div className='flex gap-1.5 items-center'>
                  <div className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]' />
                  <div className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]' />
                  <div className='w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce' />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </main>
  )
}
