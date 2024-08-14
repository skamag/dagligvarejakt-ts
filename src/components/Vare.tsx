import React from "react"
import "./vare.css"

interface VareProps {
  data: {
    data: {
      id: string
      name: string
      current_price: number
      image: string
      store: {
        logo: string
        name: string
      }
      url: string
      description?: string
      ingredients?: string
      labels?: {
        icon: {
          png: string
        }
        names: string
      }[]
      place?: string
    }[]
  } | null
  valgtVare: string
}

export default function Vare({ data, valgtVare }: VareProps) {
  const filteredItems =
    data && valgtVare !== ""
      ? data.data.filter((item) =>
          item.name.toLowerCase().includes(valgtVare.toLowerCase())
        )
      : []

  const sortedItems = filteredItems.sort(
    (a, b) => a.current_price - b.current_price
  )
  const lowestPrice =
    sortedItems.length > 0 ? sortedItems[0].current_price : null

  return (
    <article className="valgtVareContainer">
      {valgtVare &&
        data?.data
          .filter((item) =>
            item.name.toLowerCase().includes(valgtVare.toLowerCase())
          )
          .filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                (t) => t.place === value.place && t.name === value.name
              )
          )
          .map((filteredItem) => (
            <React.Fragment key={filteredItem.id}>
              <div>
                <div className="valgtVareHeader">
                  {/* <div className="vareLabels">
                    {filteredItem.labels &&
                      filteredItem.labels.map((label) => (
                        <img
                          className="vareLabelImg"
                          src={label.icon.png}
                        ></img>
                      ))}
                  </div> */}
                  <img
                    key={filteredItem.id}
                    className="vareImage"
                    src={filteredItem.image}
                    alt={filteredItem.name}
                  ></img>
                  <h5 className="valgtVareName">{valgtVare}</h5>
                </div>
                <div className={"priserContainer"}>
                  {data && valgtVare !== ""
                    ? sortedItems.map((filteredItem) => (
                        <div key={filteredItem.id} className={"storeContainer"}>
                          <a href={filteredItem.url}>
                            <div className="storeLogoContainer">
                              <img
                                className={"storeLogo"}
                                src={filteredItem.store.logo}
                                alt={filteredItem.store.name}
                              />
                            </div>
                            <span
                              className={
                                filteredItem.current_price === lowestPrice
                                  ? "bold"
                                  : ""
                              }
                            >
                              {filteredItem.current_price} kr
                            </span>
                          </a>
                        </div>
                      ))
                    : valgtVare === ""
                    ? "Ingen vare valgt..."
                    : "Loading..."}
                </div>
              </div>
              <div className="valgtVareFacts">
                <div>
                  <p>
                    <b>Beskrivelse</b>
                  </p>
                  <p>
                    {filteredItem.description
                      ? filteredItem.description
                      : "Ingen info"}
                  </p>
                </div>
                <div>
                  <p>
                    <b>Innhold</b>
                  </p>
                  <p>
                    {filteredItem.ingredients
                      ? filteredItem.ingredients
                      : "Ingen info"}
                  </p>
                </div>
                <div className="vareLabels">
                  {filteredItem.labels &&
                    filteredItem.labels.map((label) => (
                      <img
                        className="vareLabelImg"
                        src={label.icon.png}
                        alt={label.names}
                      ></img>
                    ))}
                </div>
              </div>
            </React.Fragment>
          ))}
    </article>
  )
}
