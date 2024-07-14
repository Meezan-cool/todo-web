import './styles/container.scss'
import { Routes , Route } from 'react-router-dom'
import Dash from './pages/dash'
import OnGoing from './pages/ongoing'
import AddTask from './pages/addTask'
function App() {

  return (
    <div className="app">
      <Routes>
        <Route  path='/' element={<Dash/>}/>
        <Route  path='/ongoing' element={<OnGoing/>}/>
        <Route  path='/addtask' element={<AddTask/>}/>
      </Routes>
    </div>
  )
}

export default App
