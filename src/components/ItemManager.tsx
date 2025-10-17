import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { RouletteItem } from '../App'

interface ItemManagerProps {
  items: RouletteItem[]
  onAddItem: (name: string) => void
  onRemoveItem: (id: string) => void
  onClearItems: () => void
}

export default function ItemManager({ items, onAddItem, onRemoveItem }: ItemManagerProps) {
  const [newItemName, setNewItemName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemName.trim()) {
      onAddItem(newItemName.trim())
      setNewItemName('')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Itens da Roleta</h2>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Adicionar item..."
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="btn btn-primary px-3 py-2 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            Nenhum item adicionado ainda
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white">{item.name}</span>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="text-sm text-slate-400 text-center">
          {items.length} {items.length === 1 ? 'item' : 'itens'}
        </div>
      )}
    </div>
  )
}