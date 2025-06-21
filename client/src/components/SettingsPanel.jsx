import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'

// A reusable toggle component for a cleaner look
const SettingToggle = ({ label, value, onClick }) => (
    <div className="mt-4 flex justify-between items-center">
      <span className="config-label">{label}</span>
      <div onClick={onClick} className={`toggle ${value ? 'active' : ''}`}>
        <div className="toggle-dot"></div>
      </div>
    </div>
)

const SettingsPanel = () => {
    const snap = useSnapshot(state);
    
    return (
        <div className="config-panel">
            <h3 className="config-header">Settings</h3>
            
            {/* Environment Picker - NEW FEATURE */}
            <div className="mt-4">
                <h4 className="config-label">Environment</h4>
                <div className="grid grid-cols-3 gap-2">
                    {['city', 'dawn', 'lobby'].map(env => (
                        <button key={env} onClick={() => state.environment = env} className={`config-button ${snap.environment === env ? 'active' : ''}`}>
                            {env.charAt(0).toUpperCase() + env.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <SettingToggle label="Dark Mode" value={snap.isDarkMode} onClick={() => state.isDarkMode = !snap.isDarkMode} />
            <SettingToggle label="Free Rotation" value={snap.useOrbitControls} onClick={() => state.useOrbitControls = !snap.useOrbitControls} />
            <SettingToggle label="Show Grid" value={snap.showPatternOverlay} onClick={() => state.showPatternOverlay = !state.showPatternOverlay} />
        </div>
    )
}

export default SettingsPanel;