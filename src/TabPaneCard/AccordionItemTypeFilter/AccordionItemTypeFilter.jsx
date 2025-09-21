// SPDX-License-Identifier: MIT

import { memo, useContext, useId } from 'react'
import {
  AccordionBody,
  AccordionContext,
  AccordionHeader,
  AccordionItem,
  ToggleButton,
} from 'react-bootstrap'
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext'
import FormRange from 'react-bootstrap/esm/FormRange'

import enumComparator from '../enumComparator'
import enumType from '../enumType'

function makeLabel(type, ap, comparatorAp, hp, comparatorHp) {
  switch (type) {
    case enumType.KAIMA: {
      let partAp
      switch (comparatorAp) {
        case enumComparator.GE: {
          partAp = `AP≧${ap}`
          break
        }
        case enumComparator.LE: {
          partAp = `AP≦${ap}`
          break
        }
        default: {
          partAp = `AP=${ap}`
        }
      }
      let partHp
      switch (comparatorHp) {
        case enumComparator.GE: {
          partHp = `HP≧${hp}`
          break
        }
        case enumComparator.LE: {
          partHp = `HP≦${hp}`
          break
        }
        default: {
          partHp = `HP=${hp}`
        }
      }
      return `${partAp}かつ${partHp}の怪魔`
    }
    case enumType.JUMON: {
      return '呪文'
    }
    case enumType.FUYO: {
      return '付与'
    }
    case enumType.MARYOKU: {
      return '魔力'
    }
  }
  return 'すべて'
}

const AccordionItemTypeFilter = memo(function AccordionItemTypeFilter({
  eventKey,
  type,
  ap,
  hp,
  comparatorAp,
  comparatorHp,
  handleChangeType,
  handleChangeAp,
  handleChangeHp,
  handleChangeComparatorAp,
  handleChangeComparatorHp,
}) {
  const idTitle = useId()
  const nameType = useId()
  const nameComparatorAp = useId()
  const nameComparatorHp = useId()
  const { activeEventKey } = useContext(AccordionContext)
  const expanded = isAccordionItemSelected(activeEventKey, eventKey)
  const label = makeLabel(type, ap, comparatorAp, hp, comparatorHp)
  const powerEnabled = type === enumType.KAIMA

  return (
    <AccordionItem
      role="listitem"
      aria-labelledby={idTitle}
      eventKey={eventKey}
    >
      <AccordionHeader as="h3">
        {expanded ? (
          <span>
            <span id={idTitle}>種類とAP/HP</span>
          </span>
        ) : type === 0 ? (
          <span>
            <span id={idTitle}>種類とAP/HP</span>
            &nbsp;―&nbsp;
            {label}
          </span>
        ) : (
          <span>
            <span id={idTitle}>種類とAP/HP</span>
            &nbsp;―&nbsp;
            <b>{label}</b>
          </span>
        )}
      </AccordionHeader>
      <AccordionBody>
        <div className="container-button">
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${nameType}-0`}
            name={nameType}
            value={0}
            onChange={handleChangeType}
            checked={type === 0}
          >
            すべて
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${nameType}-${enumType.KAIMA}`}
            name={nameType}
            value={enumType.KAIMA}
            onChange={handleChangeType}
            checked={type === enumType.KAIMA}
          >
            怪魔
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${nameType}-${enumType.JUMON}`}
            name={nameType}
            value={enumType.JUMON}
            onChange={handleChangeType}
            checked={type === enumType.JUMON}
          >
            呪文
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${nameType}-${enumType.FUYO}`}
            name={nameType}
            value={enumType.FUYO}
            onChange={handleChangeType}
            checked={type === enumType.FUYO}
          >
            付与
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            id={`${nameType}-${enumType.MARYOKU}`}
            name={nameType}
            value={enumType.MARYOKU}
            onChange={handleChangeType}
            checked={type === enumType.MARYOKU}
          >
            魔力
          </ToggleButton>
        </div>
        {/* AP */}
        <div>
          <div
            className="mt-3"
            {...(powerEnabled ? {} : { style: { color: '#adb5bd' } })}
          >
            AP{ap}
          </div>
          <FormRange
            min={0}
            max={1000}
            step={100}
            value={ap}
            onChange={handleChangeAp}
            disabled={!powerEnabled}
          />
        </div>
        <div className="container-button">
          <ToggleButton
            type="radio"
            variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
            id={`${nameComparatorAp}-${enumComparator.GE}`}
            name={nameComparatorAp}
            value={enumComparator.GE}
            onChange={handleChangeComparatorAp}
            disabled={!powerEnabled}
            checked={comparatorAp === enumComparator.GE}
          >
            以上
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
            id={`${nameComparatorAp}-${enumComparator.LE}`}
            name={nameComparatorAp}
            value={enumComparator.LE}
            onChange={handleChangeComparatorAp}
            disabled={!powerEnabled}
            checked={comparatorAp === enumComparator.LE}
          >
            以下
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
            id={`${nameComparatorAp}-${enumComparator.EQ}`}
            name={nameComparatorAp}
            value={enumComparator.EQ}
            onChange={handleChangeComparatorAp}
            disabled={!powerEnabled}
            checked={comparatorAp === enumComparator.EQ}
          >
            等しい
          </ToggleButton>
        </div>
        {/* HP */}
        <div>
          <div
            className="mt-3"
            {...(powerEnabled ? {} : { style: { color: '#adb5bd' } })}
          >
            HP{hp}
          </div>
          <FormRange
            min={0}
            max={1000}
            step={100}
            value={hp}
            onChange={handleChangeHp}
            disabled={!powerEnabled}
          />
        </div>
        <div className="container-button">
          <ToggleButton
            type="radio"
            variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
            id={`${nameComparatorHp}-${enumComparator.GE}`}
            name={nameComparatorHp}
            value={enumComparator.GE}
            onChange={handleChangeComparatorHp}
            disabled={!powerEnabled}
            checked={comparatorHp === enumComparator.GE}
          >
            以上
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
            id={`${nameComparatorHp}-${enumComparator.LE}`}
            name={nameComparatorHp}
            value={enumComparator.LE}
            onChange={handleChangeComparatorHp}
            disabled={!powerEnabled}
            checked={comparatorHp === enumComparator.LE}
          >
            以下
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant={powerEnabled ? 'outline-primary' : 'outline-secondary'}
            id={`${nameComparatorHp}-${enumComparator.EQ}`}
            name={nameComparatorHp}
            value={enumComparator.EQ}
            onChange={handleChangeComparatorHp}
            disabled={!powerEnabled}
            checked={comparatorHp === enumComparator.EQ}
          >
            等しい
          </ToggleButton>
        </div>
      </AccordionBody>
    </AccordionItem>
  )
})

export default AccordionItemTypeFilter
