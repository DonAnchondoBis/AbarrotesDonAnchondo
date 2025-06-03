const payloadFormatter = arr => arr.reduce((acc, ob) => ({ ...acc, [ob.id]: { ...ob } }), {})

export default payloadFormatter