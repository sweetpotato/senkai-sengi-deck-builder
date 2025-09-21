// SPDX-License-Identifier: MIT

import { useDeferredValue, useState } from 'react'

import ContainerTextSearch from './ContainerTextSearch'

function useContainerTextSearch() {
  const [keywords, setKeywords] = useState([])
  const [includesAttribute, setIncludesAttribute] = useState(true)
  const deferredKeywords = useDeferredValue(keywords)

  function handleChangeKeywords(e) {
    setKeywords(
      e.currentTarget.value
        .trim()
        .split(/\s+/)
        .filter((e) => e.length > 0)
    )
  }

  function handleChangeIncludesAttribute(e) {
    setIncludesAttribute(e.currentTarget.checked)
  }

  const render = () => {
    return (
      <ContainerTextSearch
        handleChangeKeywords={handleChangeKeywords}
        handleChangeIncludesAttribute={handleChangeIncludesAttribute}
      />
    )
  }
  return [deferredKeywords, includesAttribute, render]
}

export default useContainerTextSearch
