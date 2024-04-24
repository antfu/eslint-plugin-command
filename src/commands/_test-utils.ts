export function d(str: TemplateStringsArray) {
  const lines = str[0].split('\n')
  const commonIndent = lines.slice(1).reduce((min, line) => {
    if (/^\s*$/.test(line))
      return min
    const indent = line.match(/^\s*/)?.[0].length
    return indent === undefined ? min : Math.min(min, indent)
  }, Number.POSITIVE_INFINITY)
  return lines.map(line => line.slice(commonIndent)).join('\n')
}
