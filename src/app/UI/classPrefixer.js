const getClassPrefixer = rawPrefix => {
  const prefix = rawPrefix.replace(/\W+/g, '')
  return new Proxy({}, {
    get: (target, prop) => {
      target[prop] ??= `${prefix}-${prop}`
      return target[prop]
    }
  })
}

export default getClassPrefixer