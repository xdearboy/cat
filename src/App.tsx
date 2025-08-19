import { useEffect, useState } from 'react'
import './index.css'
import './App.css'
import Silk from './components/silk';
import TargetCursor from './components/target-cursor';
import FlyingCat from './components/flying-cat';

function App() {
  const [gif, setGif] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchGif = async () => {
    setLoading(true)
    setError('')
    
    try {
      const timestamp = Date.now()
      const response = await fetch(`https://cataas.com/cat/gif?timestamp=${timestamp}`)
      if (!response.ok) {
        throw new Error('Failed to fetch cat gif')
      }
      
      const url = response.url
      setGif(url)
    } catch (err) {
      setError('Failed to load cat. Please try again!')
      console.error('Error fetching cat:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGif()
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Silk 
        speed={3}
        scale={1.2}
        color="#6366f1"
        noiseIntensity={1}
        rotation={0}

      />
        <TargetCursor 
        spinDuration={5}
        hideDefaultCursor={true}
        />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-8 max-w-md w-full border border-white/20">
          <h1 className="text-3xl justify-center font-bold text-gray-800 mb-4 text-center">котеке!</h1>
          <div className="flex justify-center mb-6">
            <div className="relative">
              {loading ? (
                <div className="w-100 h-100 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="w-128 h-128 bg-red-100 rounded-lg flex items-center justify-center p-4">
                  <p className="text-red-600 text-center text-sm">{error}</p>
                </div>
              ) : gif ? (
                <img 
                  src={gif} 
                  alt="cat" 
                  className="w-128 h-128 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placekitten.com/300/300'
                  }}
                />
              ) : (
                <div className="w-128 h-128 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">🐱</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={fetchGif}
              disabled={loading}
              className={`
                relative overflow-hidden bg-gray-500 text-white font-semibold 
                py-3 px-8 rounded-full transition-all duration-300 transform 
                hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                before:absolute before:inset-0 before:bg-white before:opacity-0 
                before:transition-opacity before:hover:opacity-20 cursor-target
              `}
            >
              <span className="flex items-center gap-2 relative z-10">
                {loading ? (
                  <div className="rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : null}
                {loading ? 'Loading...' : 'фетчнуть'}
              </span>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              powered by cataas.com
            </p>
            <p className="text-md text-gray-500 mt-2">
              сделано с ❤️ <a href="https://github.com/xdearboy" target="_blank" rel="noopener noreferrer">xdearboy</a>
            </p>
          </div>
        </div>
      </div>
      <FlyingCat imageUrl="https://cataas.com/cat" size={100} speed={0.5} delay={2000} />
    </div>
  )
}

export default App

