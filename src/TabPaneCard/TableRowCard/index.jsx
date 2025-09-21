// SPDX-License-Identifier: MIT

import classNames from 'classnames'
import { memo, useId } from 'react'
import { Button } from 'react-bootstrap'

import enumColor from '../enumColor'
import enumType from '../enumType'
import InputGroupCounter from './InputGroupCounter'

import './index.css'

const dataColorsToCss = [
  { color: enumColor.RED, css: 'bg-ijinden-red' },
  { color: enumColor.BLUE, css: 'bg-ijinden-blue' },
  { color: enumColor.GREEN, css: 'bg-ijinden-green' },
  { color: enumColor.RED_BLUE, css: 'bg-ijinden-red-blue' },
  { color: enumColor.BLUE_GREEN, css: 'bg-ijinden-blue-green' },
  { color: enumColor.GREEN_RED, css: 'bg-ijinden-green-red' },
]

const TableRowCard = memo(function TableRowCard({
  id,
  displayName,
  color,
  type,
  counterMain,
  counterSide,
  dispatchDeck,
  zoomIn,
  interruptSimulator,
}) {
  const rowId = useId()
  const classesColor = classNames(
    dataColorsToCss.map((e) => e.color === color && e.css)
  )
  const isMaryoku = type === enumType.MARYOKU
  const classesMaryoku = classNames({
    'bg-ijinden-non-maryoku': isMaryoku,
    'bg-ijinden-maryoku': isMaryoku,
  })

  return (
    /*
     * プラスボタンやマイナスボタンをセレクタで特定できるように
     * 各行にカードIDを含む data-testid を設定する。
     * 実際のユーザはID列を見て一意に識別できるため、
     * アクセシビリティとしては問題ないはずである。
     */
    <tr aria-labelledby={rowId}>
      <td className={classesColor} id={rowId}>
        {id}
      </td>
      <td className={classesMaryoku}>
        <Button
          variant="secondary-outline"
          size="sm"
          className="m-0 p-0 border-0"
          onClick={() => zoomIn(id)}
        >
          🔎
        </Button>
        {displayName}
      </td>
      <td className={classesMaryoku}>
        {!isMaryoku ? (
          <InputGroupCounter
            id={id}
            counter={counterMain}
            dispatchDecrement={dispatchDeck.decrementMain}
            dispatchIncrement={dispatchDeck.incrementMain}
            interruptSimulator={interruptSimulator}
          />
        ) : (
          <InputGroupCounter
            id={id}
            counter={counterSide}
            dispatchDecrement={dispatchDeck.decrementSide}
            dispatchIncrement={dispatchDeck.incrementSide}
            interruptSimulator={interruptSimulator}
            isSide
          />
        )}
      </td>
    </tr>
  )
})

export default TableRowCard
