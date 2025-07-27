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
      <button
        onClick={handleInstall}
        className="px-6 py-2 bg-black text-white rounded-2xl hover:bg-gray-900 transition duration-300 shadow-md"
        >
        Install App
      </button>
    )
  )
}

export default InstallPWA
