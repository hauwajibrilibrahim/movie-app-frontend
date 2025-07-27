import { useEffect, useState } from 'react'

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log('User response to install:', outcome)
      setDeferredPrompt(null)
      setShowInstall(false)
    }
  }

  return (
    showInstall && (
      <button onClick={handleInstall} className="p-2 bg-blue-600 text-white rounded">
        Install App
      </button>
    )
  )
}

export default InstallPWA
