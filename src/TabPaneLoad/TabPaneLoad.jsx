// SPDX-License-Identifier: MIT

import { useLiveQuery } from 'dexie-react-hooks'
import { memo, useId, useState } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Spinner,
} from 'react-bootstrap'

import { dataCardsArrayForDeck } from '../commons/dataCards'
import { dbClearDecks, dbDeleteDeck, dbQueryDecks } from '../commons/db'
import { sum } from '../commons/utils'
import ImageCard from '../components/ImageCard'

// YYYY/mm/dd HH:MM:SS
const DTF = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function TabPaneLoad({
  activeDeckSaved,
  setActiveDeckSaved,
  setDeckTitle,
  dispatchSetFromEntries,
  moveToDeck,
  interruptSimulator,
}) {
  const idTitle = useId()
  const [showModalClear, setShowModalClear] = useState(false)
  const decks = useLiveQuery(async () => await dbQueryDecks())

  function handleClickClear() {
    setShowModalClear(true)
  }

  function handleClickCancelClear() {
    setShowModalClear(false)
  }

  async function handleClickConfirmClear() {
    await dbClearDecks()
    setShowModalClear(false)
  }

  return (
    <>
      <h2 id={idTitle} className="m-2">
        ロード
      </h2>
      {decks ? (
        <Accordion
          role="list"
          className="list-deck-saved"
          aria-labelledby={idTitle}
          activeKey={activeDeckSaved}
          onSelect={setActiveDeckSaved}
        >
          {decks.map((deck) => {
            return (
              <AccordionItemDeckSaved
                key={deck.id}
                deck={deck}
                setDeckTitle={setDeckTitle}
                dispatchSetFromEntries={dispatchSetFromEntries}
                moveToDeck={moveToDeck}
                interruptSimulator={interruptSimulator}
              />
            )
          })}
        </Accordion>
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </Spinner>
      )}
      <h2 className="m-2">クリア</h2>
      <div className="m-2">
        <Button variant="outline-danger" onClick={handleClickClear}>
          保存済みレシピをすべて削除
        </Button>
      </div>
      <Modal show={showModalClear}>
        <ModalHeader>
          <ModalTitle>マイデッキ</ModalTitle>
        </ModalHeader>
        <ModalBody>
          保存済みレシピをすべて削除します。よろしいですか？
        </ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" onClick={handleClickCancelClear}>
            キャンセル
          </Button>
          <Button variant="outline-danger" onClick={handleClickConfirmClear}>
            削除する
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

const AccordionItemDeckSaved = memo(function AccordionItemDeckSaved({
  deck,
  setDeckTitle,
  dispatchSetFromEntries,
  moveToDeck,
  interruptSimulator,
}) {
  const idTitle = useId()
  const timestamp = DTF.format(new Date(deck.timestamp))
  const numCardsMain = sum(deck.main.map(([, n]) => n))
  const numCardsSide = sum(deck.side.map(([, n]) => n))
  const deckTitle = deck.title || '' // There may not be a title
  const subNumCardsMain =
    numCardsSide !== 0 ? `メイン${numCardsMain}枚` : `${numCardsMain}枚`
  const subNumCardsSide = numCardsSide !== 0 ? `/魔力${numCardsSide}枚` : ''
  const label =
    `${deckTitle} [${subNumCardsMain}${subNumCardsSide}] (${timestamp})`.trimStart()

  function handleClickLoad() {
    setDeckTitle(deck.title || '') // There may not be a title
    dispatchSetFromEntries(deck.main, deck.side)
    interruptSimulator()
    moveToDeck()
  }

  async function handleClickDelete() {
    await dbDeleteDeck(deck.id)
  }

  return (
    <AccordionItem role="listitem" aria-labelledby={idTitle} eventKey={deck.id}>
      <AccordionHeader as="h3">
        <span>
          <span id={idTitle}>#{deck.id}</span>
          &nbsp;
          {label}
        </span>
      </AccordionHeader>
      <AccordionBody>
        <div className="container-button mb-2">
          <Button variant="outline-success" onClick={handleClickLoad}>
            読込み
          </Button>
          <Button variant="outline-danger" onClick={handleClickDelete}>
            削除
          </Button>
        </div>
        <SectionPart title="メインデッキ" deck={new Map(deck.main)} />
        <SectionPart title="魔力デッキ" deck={new Map(deck.side)} />
      </AccordionBody>
    </AccordionItem>
  )
})

function SectionPart({ title, deck }) {
  const idTitle = useId()
  const numCards = sum(deck.values())

  return (
    <section aria-labelledby={idTitle}>
      <h4 className="h3 mb-1">
        <span id={idTitle}>{title}</span> ({numCards}枚)
      </h4>
      <ul aria-labelledby={idTitle} className="list-card list-card-small mb-1">
        {dataCardsArrayForDeck.map(
          (card) =>
            deck.has(card.id) && (
              <li key={card.id} aria-label={card.id}>
                <ImageCard
                  imageUrl={card.imageUrl}
                  alt={card.displayName}
                  numCopies={deck.get(card.id)}
                  loading="lazy"
                  small
                />
              </li>
            )
        )}
      </ul>
    </section>
  )
}

export default TabPaneLoad
