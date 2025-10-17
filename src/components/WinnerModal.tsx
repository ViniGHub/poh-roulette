import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import type { RouletteItem } from '../App'

interface WinnerModalProps {
  winner: RouletteItem | null
  isOpen: boolean
  onClose: () => void
}

export default function WinnerModal({ winner, isOpen, onClose }: WinnerModalProps) {
  if (!winner) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Vencedor!</h2>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-3 mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: winner.color }}
                />
                <span className="text-xl font-semibold text-white">{winner.name}</span>
              </motion.div>
              
              <button
                onClick={onClose}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}