import 'bootstrap/dist/css/bootstrap.min.css'
import "react-datepicker/dist/react-datepicker.css"
import './less/main.less'

import MainScreen from './components/MainScreen'

function App() {
  return (
    <div className="container">
      <header className="row">
        <div className="col-12">
          <h1>Goal Tracker</h1>
        </div>
      </header>
      <main className="row">
        <div className="col-12">
          <MainScreen />
        </div>
      </main>
      <footer className="row">
        <div className="col-12">Footer</div>
      </footer>
    </div>
  )
}

export default App
