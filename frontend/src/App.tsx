import './styles/container.scss'
import { Routes , Route } from 'react-router-dom'
import Dash from './pages/dash'
import OnGoing from './pages/ongoing'
function App() {

  return (
    <div className="app">
      <Routes>
        <Route  path='/' element={<Dash/>}/>
        <Route  path='/ongoing' element={<OnGoing/>}/>
      </Routes>
    </div>
  )
}

export default App
