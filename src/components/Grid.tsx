import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./grid.css"
// import './alternateStyling.css'

interface Label {
  name: string
  icon: {
    png: string
  }
}

interface Category {
  name: string
}

interface Store {
  name: string
  logo: string
}

interface Product {
  id: number
  name: string
  current_price: number
  image: string
  brand: string | null
  labels: Label[]
  category: Category[]
  store: Store
  place: string
}

interface ApiResponse {
  data: Product[]
}

interface MainProps {
  data: ApiResponse | null
  setValgtVare: (name: string) => void
  page: number
  pageDown: () => void
  pageUp: () => void
}

const Grid: React.FC<MainProps> = ({
  data,
  setValgtVare,
  page,
  pageDown,
  pageUp,
}) => {
  const [searchText, setSearchText] = useState("")
  const [sorting, setSorting] = useState("")
  const [burgerToggle, setBurgerToggle] = useState(false)
  const [kategori, setKategori] = useState("")
  const [merkevare, setMerkevare] = useState("")
  const [prisLav, setPrisLav] = useState(0)
  const [prisHoy, setPrisHoy] = useState(0)

  const uniqueCategoryNames = new Set()
  const uniqueBrandNames = new Set()

  useEffect(() => {
    console.log(data)

    if (data && data.data) {
      const highest = data.data.reduce((max, item) => {
        return item.current_price > max ? item.current_price : max
      }, 0)
      setPrisHoy(highest)
    }
  }, [data])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    let text = event.target.value
    setSearchText(text)
  }

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let valgtSort = event.target.value
    setSorting(valgtSort)
  }

  const handleClick = (product: Product) => {
    setValgtVare(product.name)
  }

  const toggleBurger = () => {
    burgerToggle ? setBurgerToggle(false) : setBurgerToggle(true)
  }

  const handleSelectCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let category = event.target.value
    setKategori(category)
  }

  const handleSelectBrand = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let brand = event.target.value
    setMerkevare(brand)
  }

  const handleChangePrisLav = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pris = event.target.valueAsNumber
    setPrisLav(pris >= 0 ? pris : 0)
  }

  const handleChangePrisHoy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pris = event.target.valueAsNumber
    setPrisHoy(pris >= 0 ? pris : 0)
  }

  return (
    <main className="gridContainer">
      <div className="searchContainer">
        <div className="searchLeft">
          <div className="searchBarContainer">
            <i className="fa fa-search"></i>
            <input
              className="searchName"
              type="text"
              value={searchText}
              placeholder="Søk..."
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="searchRight">
          <select name="sortering" id="sortering" onChange={handleSort}>
            <option value={""}>Sorter</option>
            {/* <option value={''} disabled selected>Matvarekjede</option> */}
            <option value={"lavestePris"}>Laveste pris</option>
            <option value={"hoyestePris"}>Høyeste pris</option>
            <option value={"merkevare"}>Merkevare</option>
            <option value={"matvarekjede"}>Matvarekjede</option>
          </select>
          <div id="burger" onClick={toggleBurger}>
            <div className={burgerToggle ? "line1-toggle" : ""}></div>
            <div className={burgerToggle ? "line2-toggle" : ""}></div>
            <div className={burgerToggle ? "line3-toggle" : ""}></div>
          </div>
        </div>
      </div>
      {burgerToggle && (
        <div className="filtersContainer">
          <div className="filterSelectContainer">
            <select className="filterSelect" onChange={handleSelectCategory}>
              <option>Velg kategori</option>
              {data &&
                data.data &&
                data.data.map(
                  (dataItem) =>
                    dataItem.category &&
                    dataItem.category.map((item) => {
                      if (uniqueCategoryNames.has(item.name)) {
                        return null
                      }
                      uniqueCategoryNames.add(item.name)
                      return <option key={item.name}>{item.name}</option>
                    })
                )}
            </select>
            <select className="filterSelect" onChange={handleSelectBrand}>
              <option>Velg merkevare</option>
              {data &&
                data.data &&
                data.data.map((item) => {
                  if (uniqueBrandNames.has(item.brand)) {
                    return null
                  } else if (item.brand === null) return null
                  uniqueBrandNames.add(item.brand)
                  return <option key={item.brand}>{item.brand}</option>
                })}
            </select>
          </div>
          <div className="rangeContainer">
            <div>
              <span>Laveste pris</span>
              <input
                className="numberInput"
                type="number"
                value={prisLav && prisLav}
                onChange={handleChangePrisLav}
              />
            </div>
            <div>
              <span>Høyeste pris</span>
              <input
                className="numberInput"
                type="number"
                value={prisHoy && prisHoy}
                onChange={handleChangePrisHoy}
              />
            </div>
          </div>
        </div>
      )}
      <div className="matvareContainer">
        {data
          ? data.data
              .filter(
                (data) =>
                  data.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  data.store.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  data.store.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
              )
              .filter(
                (value, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => t.place === value.place && t.name === value.name
                  )
              )
              .sort((a, b) => {
                if (sorting === "lavestePris") {
                  return a.current_price - b.current_price
                } else if (sorting === "hoyestePris") {
                  return b.current_price - a.current_price
                } else if (sorting === "merkevare") {
                  return (a.brand || "").localeCompare(b.brand || "")
                } else if (sorting === "matvarekjede") {
                  return (a.store.name || "").localeCompare(b.store.name || "")
                } else {
                  return 0
                }
              })
              .filter(
                kategori !== ("" || "Velg kategori")
                  ? (item) =>
                      item.category &&
                      item.category.some((cat) =>
                        cat.name.toLowerCase().includes(kategori.toLowerCase())
                      )
                  : () => true
              )
              .filter(
                merkevare !== ("" || "Velg merkevare")
                  ? (item) =>
                      item.brand &&
                      item.brand.toLowerCase().includes(merkevare.toLowerCase())
                  : () => true
              )
              .filter(
                prisLav !== null
                  ? (item) => item.current_price >= prisLav
                  : () => true
              )
              .filter(
                prisHoy !== null
                  ? (item) => item.current_price <= prisHoy
                  : () => true
              )
              .map((filteredData) => (
                <Link to="/vare" className="card" key={filteredData.id}>
                  <article
                    className="article"
                    onClick={() => handleClick(filteredData)}
                  >
                    <div className="labelsContainer">
                      {filteredData.labels.map((label) => (
                        <div key={label.name}>
                          {label.icon.png && (
                            <img
                              className="labelImg"
                              src={label.icon.png}
                              alt={label.name}
                            ></img>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="imgContainer">
                      <img
                        src={filteredData.image}
                        alt={filteredData.name}
                      ></img>
                    </div>
                    <div className="descriptionContainer">
                      <span>
                        <h5>{filteredData.name}</h5>
                      </span>
                      <div className="cardStores">
                        {data.data &&
                          data.data
                            .filter(
                              (item) =>
                                item.name &&
                                item.name
                                  .toLowerCase()
                                  .includes(filteredData.name.toLowerCase())
                            )
                            .map((currentItem) => (
                              <React.Fragment key={currentItem.id}>
                                <img
                                  className="cardStoreImg"
                                  src={currentItem.store.logo}
                                  alt={currentItem.store.name}
                                ></img>
                                <span className="cardStorePrice">
                                  {currentItem.current_price}
                                </span>
                              </React.Fragment>
                            ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))
          : "Loading..."}
      </div>
      <div className="buttonsContainer">
        <button onClick={pageDown}>Page down</button>
        <span>Side {page}</span>
        <button onClick={pageUp}>Page up</button>
      </div>
    </main>
  )
}

export default Grid
