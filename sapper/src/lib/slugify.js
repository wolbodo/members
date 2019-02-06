import slugify from 'slugify'

export default (s, opts) => s && slugify(s, { lower: true, ...opts })