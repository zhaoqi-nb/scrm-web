import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Select, Spin } from 'antd'

import debounce from 'lodash/debounce'

function SearchSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])
  const fetchRef = useRef(0)

  useEffect(() => {
    fetchOptions('').then((newOptions) => {
      setOptions(newOptions)
    })
  }, [])
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }

        setOptions(newOptions)
        setFetching(false)
      })
      if (props.onChangeSearch) {
        props.onChangeSearch(value)
      }
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])
  return (
    <Select
      allowClear
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
} // Usage of DebounceSelect

export default SearchSelect
