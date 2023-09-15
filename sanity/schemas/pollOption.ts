import {defineType} from 'sanity'

export default defineType({
  name: 'pollOption',
  title: 'Poll Option',
  type: 'object',
  initialValue: {
    votes: 0,
  },
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
