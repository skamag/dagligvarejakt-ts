import React from "react"
import "./vare.css"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface VareProps {
  data: {
    data: {
      id: string
      name: string
      current_price: number
      price_history?: {
        price: number
        date: string
      }[]
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
          .map((filteredItem) => {
            const priceHistory = filteredItem.price_history || []
            const dates = priceHistory.map((point) => point.date.slice(0, 10))
            const prices = priceHistory.map((point) => point.price)

            const chartData = {
              labels: dates,
              datasets: [
                {
                  label: `Prisutvikling de siste 25 dagene`,
                  data: prices,
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            }

            return (
              <React.Fragment key={filteredItem.id}>
                <div className="flex">
                  <div>
                    <div className="valgtVareHeader">
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
                            <div
                              key={filteredItem.id}
                              className={"storeContainer"}
                            >
                              <a href={filteredItem.url} target="_blank">
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
                </div>

                <div className="priceHistoryContainer">
                  <Line data={chartData} />
                </div>
              </React.Fragment>
            )
          })}
    </article>
  )
}
