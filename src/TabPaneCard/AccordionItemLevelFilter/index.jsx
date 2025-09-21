// SPDX-License-Identifier: MIT

import { useCallback, useDeferredValue, useState } from 'react'

import constLevel from '../constLevel'
import enumComparator from '../enumComparator'
import AccordionItemLevelFilter from './AccordionItemLevelFilter'

function useAccordionItemLevelFilter() {
  const [level, setLevel] = useState(constLevel.MIN)
  const [comparator, setComparator] = useState(enumComparator.GE)
  // See AccordionItemGenericFilter
  const defferedLevel = useDeferredValue(level)
  const defferedComparator = useDeferredValue(comparator)

  const handleChangeLevel = useCallback(
    (e) => setLevel(Number(e.currentTarget.value)),
    [setLevel]
  )

  const handleChangeComparator = useCallback(
    (e) => setComparator(e.currentTarget.value),
    [setComparator]
  )

  const reset = () => {
    setLevel(constLevel.MIN)
    setComparator(enumComparator.GE)
  }

  const render = (eventKey) => {
    return (
      <AccordionItemLevelFilter
        eventKey={eventKey}
        level={level}
        comparator={comparator}
        handleChangeLevel={handleChangeLevel}
        handleChangeComparator={handleChangeComparator}
      />
    )
  }
  return [defferedLevel, defferedComparator, reset, render]
}

export default useAccordionItemLevelFilter
