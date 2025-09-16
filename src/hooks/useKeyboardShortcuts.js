import { useEffect } from 'react'

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event
      
      for (const shortcut of shortcuts) {
        const {
          key: shortcutKey,
          ctrl = false,
          meta = false,
          shift = false,
          alt = false,
          callback,
          preventDefault = true
        } = shortcut

        if (
          key.toLowerCase() === shortcutKey.toLowerCase() &&
          ctrlKey === ctrl &&
          metaKey === meta &&
          shiftKey === shift &&
          altKey === alt
        ) {
          if (preventDefault) {
            event.preventDefault()
          }
          callback(event)
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}

// Common shortcuts
export const commonShortcuts = {
  save: { key: 's', ctrl: true },
  escape: { key: 'Escape' },
  enter: { key: 'Enter' },
  refresh: { key: 'r', ctrl: true },
  search: { key: 'k', ctrl: true },
  newItem: { key: 'n', ctrl: true },
  delete: { key: 'Delete' },
  help: { key: '?', shift: true }
}