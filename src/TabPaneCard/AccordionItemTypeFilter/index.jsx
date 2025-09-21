// SPDX-License-Identifier: MIT

import { useCallback, useDeferredValue, useState } from 'react'

import enumComparator from '../enumComparator'
import AccordionItemTypeFilter from './AccordionItemTypeFilter'

function useAccordionItemTypeFilter() {
  const [type, setType] = useState(0)
  const [ap, setAp] = useState(100)
  const [hp, setHp] = useState(100)
  const [comparatorAp, setComparatorAp] = useState(enumComparator.GE)
  const [comparatorHp, setComparatorHp] = useState(enumComparator.GE)
  // See AccordionItemGenericFilter
  const defferedType = useDeferredValue(type)
  const defferedAp = useDeferredValue(ap)
  const defferedHp = useDeferredValue(hp)
  const defferedComparatorAp = useDeferredValue(comparatorAp)
  const defferedComparatorHp = useDeferredValue(comparatorHp)
  const handleChangeType = useCallback(
    (e) => setType(Number(e.currentTarget.value)),
    [setType]
  )
  const handleChangeAp = useCallback(
    (e) => setAp(Number(e.currentTarget.value)),
    [setAp]
  )
  const handleChangeHp = useCallback(
    (e) => setHp(Number(e.currentTarget.value)),
    [setHp]
  )
  const handleChangeComparatorAp = useCallback(
    (e) => setComparatorAp(e.currentTarget.value),
    [setComparatorAp]
  )
  const handleChangeComparatorHp = useCallback(
    (e) => setComparatorHp(e.currentTarget.value),
    [setComparatorHp]
  )

  const reset = () => {
    setType(0)
    setAp(0)
    setComparatorAp(enumComparator.GE)
  }
  const render = (eventKey) => (
    <AccordionItemTypeFilter
      eventKey={eventKey}
      type={type}
      ap={ap}
      comparatorAp={comparatorAp}
      hp={hp}
      comparatorHp={comparatorHp}
      handleChangeType={handleChangeType}
      handleChangeAp={handleChangeAp}
      handleChangeHp={handleChangeHp}
      handleChangeComparatorAp={handleChangeComparatorAp}
      handleChangeComparatorHp={handleChangeComparatorHp}
    />
  )
  return [
    defferedType,
    defferedAp,
    defferedHp,
    defferedComparatorAp,
    defferedComparatorHp,
    reset,
    render,
  ]
}

export default useAccordionItemTypeFilter
