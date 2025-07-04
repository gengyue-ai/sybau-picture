'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestInputPage() {
  const [testValue, setTestValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>输入测试页面</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 基础Input测试 */}
            <div>
              <Label htmlFor="test-input">测试输入字段</Label>
              <Input
                id="test-input"
                type="text"
                value={testValue}
                onChange={(e) => {
                  console.log('Input change:', e.target.value)
                  setTestValue(e.target.value)
                }}
                onKeyDown={(e) => {
                  console.log('Key down:', e.key, e.code)
                }}
                placeholder="请在这里输入测试文字..."
                className="mt-2"
              />
              <p className="text-sm text-gray-600 mt-2">
                当前值: "{testValue}" (长度: {testValue.length})
              </p>
            </div>

            {/* 原生input测试 */}
            <div>
              <Label htmlFor="native-input">原生输入字段</Label>
              <input
                id="native-input"
                type="text"
                placeholder="原生HTML input测试..."
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={(e) => {
                  console.log('Native input key down:', e.key, e.code)
                }}
              />
            </div>

            {/* Textarea测试 */}
            <div>
              <Label htmlFor="test-textarea">测试文本区域</Label>
              <textarea
                id="test-textarea"
                value={textareaValue}
                onChange={(e) => {
                  console.log('Textarea change:', e.target.value)
                  setTextareaValue(e.target.value)
                }}
                onKeyDown={(e) => {
                  console.log('Textarea key down:', e.key, e.code)
                }}
                placeholder="请在这里输入多行文字..."
                rows={4}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-2">
                当前值: "{textareaValue}" (长度: {textareaValue.length})
              </p>
            </div>

            {/* 诊断信息 */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">诊断信息</h3>
              <ul className="text-sm space-y-1">
                <li>浏览器: {typeof window !== 'undefined' ? navigator.userAgent : 'Unknown'}</li>
                <li>语言: {typeof window !== 'undefined' ? navigator.language : 'Unknown'}</li>
                <li>平台: {typeof window !== 'undefined' ? navigator.platform : 'Unknown'}</li>
              </ul>
            </div>

            {/* 解决方案建议 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">可能的解决方案</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. 尝试切换到英文输入法</li>
                <li>2. 清除浏览器缓存和Cookie</li>
                <li>3. 尝试在无痕模式下访问</li>
                <li>4. 检查浏览器扩展是否有冲突</li>
                <li>5. 尝试使用不同的浏览器</li>
                <li>6. 检查是否有全局CSS样式冲突</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
