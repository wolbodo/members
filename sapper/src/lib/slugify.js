import slugify from 'slugify'

export default (s, opts) => slugify(s, { lower: true, ...opts })