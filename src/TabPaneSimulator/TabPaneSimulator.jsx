// SPDX-License-Identifier: MIT

import { useId, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'

import { dataCardsMap } from '../commons/dataCards'
import { sum } from '../commons/utils'
import {
  ImageCardWithToggleOpaque,
  ImageCardWithToggleTransparent,
} from './ImageCardWithToggle'

function makeIdArray(deck) {
  const result = []
  for (const [id, numCopies] of deck.entries()) {
    for (let i = 0; i < numCopies; ++i) {
      result.push(id)
    }
  }
  return result
}

function makeShuffledArray(array) {
  const result = array.slice()
  // シャッフルする
  for (let i = result.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function TabPaneSimulator({ deckMain, deckSide, state, dispatch }) {
  const [walls, setWalls] = useState(null)
  const [handAndMain, setHandAndMain] = useState(null)
  const [manaAndSide, setManaAndSide] = useState(null)

  function handleClickReset() {
    setWalls(null)
    setHandAndMain(null)
    setManaAndSide(null)
    dispatch.reset()
  }

  function handleClickStart() {
    if (sum(deckMain.values()) < 8) {
      dispatch.checkMainDeck()
      return
    }

    const library = makeShuffledArray(makeIdArray(deckMain))
    const fountain = makeShuffledArray(makeIdArray(deckSide))
    // メインデッキからウォールが4枚、残りは手札
    setWalls(library.slice(0, 4))
    setHandAndMain(library.slice(4, library.length))
    // 魔力デッキ
    setManaAndSide(fountain)
    dispatch.start()
  }

  const showBoard = state.isStarting() || state.isRunning() || state.isAborted()
  return (
    <>
      <h2 className="m-2">手札シミュレータ</h2>
      <div className="container-button mx-2 mt-2 mb-3">
        <Button
          variant="outline-danger"
          onClick={handleClickReset}
          disabled={state.isInitial()}
        >
          リセット
        </Button>
        <Button
          variant="outline-success"
          onClick={handleClickStart}
          disabled={!state.isInitial()}
        >
          スタート
        </Button>
      </div>
      {state.isLessThanEight() && (
        <Alert variant="warning">
          メインデッキの枚数が少なすぎます。8枚以上にしてください。
        </Alert>
      )}
      {state.isAborted() && (
        <Alert variant="warning">
          シミュレーション中にデッキが編集されました。新しいデッキでシミュレーションを再開するにはリセットしてください。
        </Alert>
      )}
      {showBoard && (
        <>
          <SectionPart
            title="ウォール"
            cards={walls}
            defaultNumTransparent={0}
            continueSimulator={dispatch.continue}
          />
          <SectionPart
            title="手札"
            cards={handAndMain}
            defaultNumTransparent={4}
            continueSimulator={dispatch.continue}
          />
          <SectionPart
            title="魔力ゾーン"
            cards={manaAndSide}
            defaultNumTransparent={0}
            continueSimulator={dispatch.continue}
          />
        </>
      )}
    </>
  )
}

function SectionPart({
  title,
  cards,
  defaultNumTransparent,
  continueSimulator,
}) {
  const idTitle = useId()

  return (
    <section aria-labelledby={idTitle}>
      <h3 id={idTitle} className="m-2">
        {title}
      </h3>
      <ul aria-labelledby={idTitle} className="list-card list-card-medium ms-2">
        {cards?.map((cardId, index) => {
          const key = `${cardId}-${index}`
          const card = dataCardsMap.get(cardId)
          return index < defaultNumTransparent ? (
            <li key={key}>
              <ImageCardWithToggleTransparent
                imageUrl={card.imageUrl}
                alt={card.displayName}
                continueSimulator={continueSimulator}
              />
            </li>
          ) : (
            <li key={key}>
              <ImageCardWithToggleOpaque
                imageUrl={card.imageUrl}
                alt={card.displayName}
                continueSimulator={continueSimulator}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default TabPaneSimulator
