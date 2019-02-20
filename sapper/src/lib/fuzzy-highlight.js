
export default function highlight (result, defaultValue) {
  if (result) {
    const { indexes, target } = result

    return indexes.reduce(
      (value, index, idx, arr) => {
        if (idx > 0) {
          let result = value
          const previous = arr[idx - 1]

          if (previous + 1 === index) {
            // Keep open
            result += target[index]
          } else {
            // Close and open a new one.
            // Unless its the last one.
            result += `</b>${target.slice(previous + 1, index)}<b>${target[index]}`
          }

          if ((idx + 1) === arr.length) {
            // Last value, close up
            result += `</b>${target.slice(index + 1)}`
          }

          return result
        }
        // Open it.
        return `${target.slice(0, index)}<b>${target[index]}`
      }, ''
    )
  } else {
    return defaultValue
  }
}
