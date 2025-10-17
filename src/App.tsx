import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Save, Download, Trash2 } from 'lucide-react'
import RouletteWheel, { RouletteWheelRef } from './components/RouletteWheel'
import ItemManager from './components/ItemManager'
import SettingsPanel from './components/SettingsPanel'
import SavePresetModal from './components/SavePresetModal'
import LoadPresetModal from './components/LoadPresetModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { playStartSound, playTickSound } from './utils/audio'

export interface RouletteItem {
  id: string
  name: string
  color: string
}

export interface RouletteSettings {
  speed: number
  soundEnabled: boolean
}

function App() {
  const [items, setItems] = useLocalStorage<RouletteItem[]>('poh_items', [])
  const [settings, setSettings] = useLocalStorage<RouletteSettings>('poh_settings', {
    speed: 4500,
    soundEnabled: true
  })
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWinners, setLastWinners] = useState<number[]>([])
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)

  const wheelRef = useRef<RouletteWheelRef>(null)

  // Função melhorada de aleatoriedade que evita repetições
  const getRandomWinnerIndex = (): number => {
    if (items.length <= 1) return 0
    
    // Para 2 itens, força alternância
    if (items.length === 2) {
      const lastWinner = lastWinners[lastWinners.length - 1]
      return lastWinner === 0 ? 1 : 0
    }
    
    // Para 3+ itens, evita repetir os últimos 2 resultados
    let attempts = 0
    let randomIndex: number
    
    do {
      // Usa crypto.getRandomValues() para melhor aleatoriedade
      const cryptoArray = new Uint32Array(1)
      crypto.getRandomValues(cryptoArray)
      const cryptoRandom = cryptoArray[0] / 0xFFFFFFFF
      
      // Combina crypto com Math.random() para maior entropia
      const combinedRandom = (Math.random() + cryptoRandom) / 2
      randomIndex = Math.floor(combinedRandom * items.length)
      
      attempts++
      if (attempts > 50) break // Evita loop infinito
      
    } while (
      lastWinners.includes(randomIndex) && 
      lastWinners.length >= Math.min(2, items.length - 1)
    )
    
    // Atualiza histórico (mantém apenas os últimos 2)
    const newHistory = [...lastWinners, randomIndex].slice(-2)
    setLastWinners(newHistory)
    
    return randomIndex
  }

  const addItem = (name: string) => {
    if (!name.trim()) return

    const newItem: RouletteItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color: `hsl(${Math.random() * 360} 75% 55%)`
    }

    setItems([...items, newItem])
    
    // Limpa histórico quando itens mudam
    if (items.length < 3) {
      setLastWinners([])
    }
  }

  const removeItem = (id: string) => {
    const removedIndex = items.findIndex(item => item.id === id)
    setItems(items.filter(item => item.id !== id))
    
    // Ajusta histórico quando item é removido
    if (removedIndex !== -1) {
      setLastWinners(prev => 
        prev
          .filter(index => index !== removedIndex)
          .map(index => index > removedIndex ? index - 1 : index)
      )
    }
  }

  const clearItems = () => {
    setItems([])
    setLastWinners([])
  }

  const savePreset = () => {
    setIsSaveModalOpen(true)
  }

  const handleSavePreset = (name: string) => {
    localStorage.setItem(`poh_preset_${name}`, JSON.stringify(items))
  }

  const loadPreset = () => {
    setIsLoadModalOpen(true)
  }

  const handleLoadPreset = (name: string) => {
    const presetData = localStorage.getItem(`poh_preset_${name}`)
    if (presetData) {
      try {
        const loadedItems = JSON.parse(presetData)
        setItems(loadedItems)
        setLastWinners([]) // Limpa histórico para novo conjunto
      } catch {
        alert('Erro ao carregar preset!')
      }
    }
  }

  const handleDeletePreset = (name: string) => {
    localStorage.removeItem(`poh_preset_${name}`)
  }

  const loadLunchPreset = () => {
    const lunchItems = [
      { id: crypto.randomUUID(), name: 'Casimiro', color: 'hsl(25 75% 55%)' },
      { id: crypto.randomUUID(), name: 'Xracing', color: 'hsl(200 75% 55%)' },
      { id: crypto.randomUUID(), name: 'Paulo Vita', color: 'hsl(120 75% 55%)' },
      { id: crypto.randomUUID(), name: 'Balela', color: 'hsl(300 75% 55%)' }
    ]
    
    setItems(lunchItems)
    setLastWinners([]) // Limpa histórico para novo conjunto
  }

  const spin = () => {
    if (isSpinning || items.length === 0) return

    // 1. Usa aleatoriedade melhorada que evita repetições
    const winnerIndex = getRandomWinnerIndex()

    setIsSpinning(true)

    if (settings.soundEnabled) {
      playStartSound()
    }

    // 2. Giramos a roleta para parar no ganhador sorteado
    wheelRef.current?.spin(winnerIndex)

    // 3. Após a animação, apenas paramos de girar (sem modal)
    setTimeout(() => {
      setIsSpinning(false)
      // Não mostramos mais o modal - a roleta fica parada onde parou
    }, settings.speed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      
      <div className="relative z-10 flex h-screen">
        {/* Sidebar com controles */}
        <motion.div 
          className="w-96 bg-slate-800/50 backdrop-blur-xl border-r border-white/10 p-6 overflow-y-auto"
          initial={{ x: -384 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">POH Roulette</h1>
              <p className="text-slate-400 text-sm">
                Adicione itens e gire a roleta para escolher aleatoriamente
              </p>
            </div>

            <ItemManager
              items={items}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onClearItems={clearItems}
            />

            <div className="space-y-3">
              <button
                onClick={spin}
                disabled={isSpinning || items.length === 0}
                className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                {isSpinning ? 'Girando...' : 'Girar Roleta'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={savePreset}
                  className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
                <button
                  onClick={loadPreset}
                  className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Carregar
                </button>
              </div>

              <button
                onClick={clearItems}
                className="w-full btn btn-danger flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Tudo
              </button>
            </div>

            <SettingsPanel 
              settings={settings} 
              onSettingsChange={setSettings}
              onLoadLunchPreset={loadLunchPreset}
            />
          </div>
        </motion.div>

        {/* Área central da roleta */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <RouletteWheel
              ref={wheelRef}
              items={items}
              settings={settings}
              onTick={() => settings.soundEnabled && playTickSound()}
            />
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <SavePresetModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSavePreset}
      />
      
      <LoadPresetModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        onLoad={handleLoadPreset}
        onDelete={handleDeletePreset}
      />
    </div>
  )
}

export default App