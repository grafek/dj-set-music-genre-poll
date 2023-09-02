import {defineType} from 'sanity'

export default defineType({
  name: 'pollOption',
  title: 'Poll Option',
  type: 'object',
  fields: [
    {
      name: 'option',
      title: 'Option',
      type: 'string',
    },
    {
      name: 'votes',
      title: 'Votes',
      type: 'number',
    },
  ],
})
