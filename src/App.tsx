import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Grid from "./components/Grid"
import Vare from "./components/Vare"
import "./App.css"

// interface Product {
//   id: number
//   name: string
//   price: number
// }

// interface ApiResponse {
//   products: Product[]
//   total: number
//   // Add other properties if needed
// }

function App() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)

  const pageDown = () => {
    page > 1 && setPage((page) => page - 1)
    console.log(page)
  }

  const pageUp = () => {
    setPage((page) => page + 1)
    console.log(page)
  }

  const KEY = "LmOFSdN8MdRSiZOVBqFg4uP6uKdvBKpuoHTdnkiW"

  useEffect(() => {
    const headers = { Authorization: "Bearer " + KEY }

    fetch(`https://kassal.app/api/v1/products?size=100&page=${page}`, {
      headers,
    })
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
  }, [page])

  const [valgtVare, setValgtVare] = useState("")

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Grid
                  data={data}
                  setData={setData}
                  valgtVare={valgtVare}
                  setValgtVare={setValgtVare}
                  page={page}
                  pageDown={pageDown}
                  pageUp={pageUp}
                />
              }
            />
            <Route
              path="/vare"
              element={<Vare data={data} valgtVare={valgtVare} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
