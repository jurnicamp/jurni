'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, MoreHorizontal, Reply } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface Comment {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  content: string
  timestamp: Date
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (content: string, parentId?: string) => void
  onLikeComment: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
  currentUserId?: string
}

interface CommentItemProps {
  comment: Comment
  onLike: (commentId: string) => void
  onReply: (content: string, parentId: string) => void
  onDelete?: (commentId: string) => void
  currentUserId?: string
  isReply?: boolean
}

function CommentItem({ comment, onLike, onReply, onDelete, currentUserId, isReply = false }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showReplies, setShowReplies] = useState(false)

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    onReply(replyText, comment.id)
    setReplyText('')
    setShowReplyForm(false)
    setShowReplies(true)
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  return (
    <motion.div
      className={`${isReply ? 'ml-8' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={comment.user.avatar}
            alt={comment.user.name}
            width={isReply ? 28 : 32}
            height={isReply ? 28 : 32}
            className={`${isReply ? 'w-7 h-7' : 'w-8 h-8'} rounded-full border border-gray-200 dark:border-gray-700`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {comment.user.name}
              </h4>
              {currentUserId === comment.user.id && (
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimeAgo(comment.timestamp)}
            </span>
            
            <motion.button
              onClick={() => onLike(comment.id)}
              className={`flex items-center space-x-1 text-xs font-medium transition-colors ${
                comment.isLiked
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
            </motion.button>

            {!isReply && (
              <motion.button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Reply className="w-3 h-3" />
                <span>Reply</span>
              </motion.button>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                {showReplies ? 'Hide' : 'View'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {showReplyForm && (
              <motion.form
                onSubmit={handleReplySubmit}
                className="mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    Y
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.user.name}...`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      autoFocus
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-3 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Replies */}
          <AnimatePresence>
            {showReplies && comment.replies && comment.replies.length > 0 && (
              <motion.div
                className="mt-4 space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onLike={onLike}
                    onReply={onReply}
                    onDelete={onDelete}
                    currentUserId={currentUserId}
                    isReply={true}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export function CommentSection({ 
  comments, 
  onAddComment, 
  onLikeComment, 
  onDeleteComment,
  currentUserId 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    onAddComment(newComment)
    setNewComment('')
  }

  const handleReply = (content: string, parentId: string) => {
    onAddComment(content, parentId)
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
          Y
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <motion.button
          type="submit"
          disabled={!newComment.trim()}
          className="px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={onLikeComment}
              onReply={handleReply}
              onDelete={onDeleteComment}
              currentUserId={currentUserId}
            />
          ))}
        </AnimatePresence>
      </div>

      {comments.length === 0 && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to comment on this adventure!
          </p>
        </motion.div>
      )}
    </div>
  )
}
