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
      <footer className="row footer">
        <div className="col-8">
          &copy; Senthil Chandramohan
        </div>
        <div className="col-2">
          <a className="github" target="_blank" href="https://github.com/senthilkumar-chandramohan">Github</a>
        </div>
        <div className="col-2">
          <a className="linkedin" target="_blank" href="https://www.linkedin.com/in/senthilkumar-chandramohan/">LinkedIn</a>
        </div>
      </footer>
    </div>
  )
}

export default App
