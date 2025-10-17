import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Trash2 } from 'lucide-react'

interface LoadPresetModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (name: string) => void
  onDelete: (name: string) => void
}

export default function LoadPresetModal({ isOpen, onClose, onLoad, onDelete }: LoadPresetModalProps) {
  const [presets, setPresets] = useState<string[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      // Busca os presets salvos
      const keys = Object.keys(localStorage).filter(key => key.startsWith('poh_preset_'))
      const presetNames = keys.map(key => key.replace('poh_preset_', ''))
      setPresets(presetNames)
      setSelectedPreset('')
    }
  }, [isOpen])

  const handleLoad = () => {
    if (selectedPreset) {
      onLoad(selectedPreset)
      onClose()
    }
  }

  const handleDelete = (presetName: string) => {
    if (confirm(`Tem certeza que deseja excluir o preset "${presetName}"?`)) {
      onDelete(presetName)
      // Atualiza a lista
      const keys = Object.keys(localStorage).filter(key => key.startsWith('poh_preset_'))
      const presetNames = keys.map(key => key.replace('poh_preset_', ''))
      setPresets(presetNames)
      if (selectedPreset === presetName) {
        setSelectedPreset('')
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-slate-800 rounded-lg border border-slate-700 p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Download className="w-5 h-5" />
                Carregar Preset
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {presets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-2">Nenhum preset encontrado</p>
                <p className="text-sm text-slate-500">Salve um preset primeiro para poder carregá-lo</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Presets disponíveis
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {presets.map((preset) => (
                      <div
                        key={preset}
                        className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedPreset === preset
                            ? 'bg-purple-600/20 border-purple-500'
                            : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                        }`}
                        onClick={() => setSelectedPreset(preset)}
                      >
                        <span className="text-white">{preset}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(preset)
                          }}
                          className="text-slate-400 hover:text-red-400 transition-colors p-1"
                          title="Excluir preset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLoad}
                    disabled={!selectedPreset}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                  >
                    Carregar
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}