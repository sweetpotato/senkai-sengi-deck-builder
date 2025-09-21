// SPDX-License-Identifier: MIT

import { useId } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Table,
} from 'react-bootstrap'

import { dataCardsArrayForTable as dataCards } from '../commons/dataCards'
import enumColor from './enumColor'
import enumComparator from './enumComparator'
import enumType from './enumType'
import useAccordionItemGenericFilter from './AccordionItemGenericFilter'
import useAccordionItemLevelFilter from './AccordionItemLevelFilter'
import useAccordionItemTypeFilter from './AccordionItemTypeFilter'
import useContainerTextSearch from './ContainerTextSearch'
import TableRowCard from './TableRowCard'

import './index.css'

const dataExpansions = [
  { value: 0, label: 'すべて' },
  { value: 10, label: '伝承の幻獣' },
  { value: 11, label: '信仰の鬼神' },
  { value: 12, label: '太古の猛獣' },
  { value: 15, label: 'ブースター第1弾' },
]

const dataRarities = [
  { value: 0, label: 'すべて' },
  { value: 1, label: 'Nのみ' },
  { value: 2, label: 'Rのみ' },
  { value: 4, label: 'SRのみ' },
  { value: 8, label: 'LRのみ' },
]

const dataColors = [
  { value: 0, label: 'すべて' },
  { value: enumColor.RED, label: '赤' },
  { value: enumColor.BLUE, label: '青' },
  { value: enumColor.GREEN, label: '緑' },
  { value: enumColor.MULTICOLOR, label: '多色' },
]

function TabPaneCard({
  deckMain,
  deckSide,
  dispatchDeck,
  zoomIn,
  interruptSimulator,
}) {
  const idTitle = useId()
  const [expansion, resetExpansion, renderExpansion] =
    useAccordionItemGenericFilter('エキスパンション', dataExpansions)
  const [rarity, resetRarity, renderRarity] = useAccordionItemGenericFilter(
    'レアリティ',
    dataRarities
  )
  const [color, resetColor, renderColor] = useAccordionItemGenericFilter(
    '色',
    dataColors
  )
  const [type, ap, hp, comparatorAp, comparatorHp, resetType, renderType] =
    useAccordionItemTypeFilter()
  const [level, levelComparator, resetLevel, renderLevel] =
    useAccordionItemLevelFilter()
  const [deferredKeywords, includesAttribute, renderTextSearch] =
    useContainerTextSearch()

  function handleClickResetConditions() {
    resetExpansion()
    resetRarity()
    resetColor()
    resetType()
    resetLevel()
  }

  function filterCard(card) {
    const apMatched =
      comparatorAp === enumComparator.GE
        ? card.ap >= ap
        : comparatorAp === enumComparator.LE
        ? card.ap <= ap
        : card.ap === ap
    const hpMatched =
      comparatorHp === enumComparator.GE
        ? card.hp >= hp
        : comparatorHp === enumComparator.LE
        ? card.hp <= hp
        : card.hp === hp
    const levelMatched =
      levelComparator === enumComparator.GE
        ? card.level >= level
        : levelComparator === enumComparator.LE
        ? card.level <= level
        : card.level === level
    // Should use name, not displayName
    let allText = card.name + '§' + card.kana + '§' + card.ruleText
    allText +=
      includesAttribute && card.attributeText ? '§' + card.attributeText : ''
    return (
      (expansion === 0 || card.expansion === expansion) &&
      (rarity === 0 || (card.rarity & rarity) === card.rarity) &&
      (color === 0 || (card.color & color) === color) &&
      (type === 0 || card.type === type) &&
      (card.type !== enumType.KAIMA || (apMatched && hpMatched)) &&
      levelMatched &&
      deferredKeywords.every((e) => allText.includes(e))
    )
  }

  return (
    <>
      {renderTextSearch()}
      <Accordion>
        <AccordionItem eventKey="0">
          <AccordionHeader id={idTitle} as="h2" className="header-filter">
            条件で絞り込む
          </AccordionHeader>
          <AccordionBody>
            <div className="my-2 container-button">
              <Button
                variant="outline-danger"
                onClick={handleClickResetConditions}
              >
                条件すべてをリセットする
              </Button>
            </div>
            <Accordion
              role="list"
              aria-labelledby={idTitle}
              className="list-filter"
              alwaysOpen
              defaultActiveKey={['2', '3']}
            >
              {renderExpansion('0')}
              {renderRarity('1')}
              {renderColor('2')}
              {renderType('3')}
              {renderLevel('4')}
            </Accordion>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
      <Table hover variant="light">
        <thead className="sticky-top">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">カード名</th>
            <th scope="col">メイン</th>
            <th scope="col">魔力</th>
          </tr>
        </thead>
        <tbody>
          {dataCards.map((element) => {
            return (
              filterCard(element) && (
                <TableRowCard
                  key={element.id}
                  id={element.id}
                  displayName={element.displayName}
                  color={element.color}
                  type={element.type}
                  counterMain={
                    deckMain.has(element.id) ? deckMain.get(element.id) : 0
                  }
                  counterSide={
                    deckSide.has(element.id) ? deckSide.get(element.id) : 0
                  }
                  dispatchDeck={dispatchDeck}
                  zoomIn={zoomIn}
                  interruptSimulator={interruptSimulator}
                />
              )
            )
          })}
        </tbody>
      </Table>
    </>
  )
}

export default TabPaneCard
