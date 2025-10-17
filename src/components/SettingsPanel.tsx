import { Settings } from 'lucide-react'
import type { RouletteSettings } from '../App'

interface SettingsPanelProps {
  settings: RouletteSettings
  onSettingsChange: (settings: RouletteSettings) => void
  onLoadLunchPreset?: () => void
}

export default function SettingsPanel({ settings, onSettingsChange, onLoadLunchPreset }: SettingsPanelProps) {
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      speed: parseInt(e.target.value)
    })
  }

  const handleSoundToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      soundEnabled: e.target.checked
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Configurações
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Velocidade da Roleta
          </label>
          <input
            type="range"
            min="2000"
            max="8000"
            step="250"
            value={settings.speed}
            onChange={handleSpeedChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Rápida</span>
            <span>{(settings.speed / 1000).toFixed(1)}s</span>
            <span>Lenta</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">
            Som habilitado
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={handleSoundToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {onLoadLunchPreset && (
          <div className="pt-2 border-t border-slate-700">
            <button
              onClick={onLoadLunchPreset}
              className="w-full text-xs text-slate-400 hover:text-slate-300 transition-colors duration-200 py-2 px-3 rounded bg-gray-700 hover:bg-gray-600"
            >
              🍽️ Hora do Almoço
            </button>
          </div>
        )}
      </div>
    </div>
  )
}