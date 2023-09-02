import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'poll',
  title: 'Genre poll',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'djSetDate',
        maxLength: 100,
      },
    }),
    defineField({
      name: 'djSetDate',
      title: 'DJ Set Date',
      type: 'datetime',
    }),
    defineField({
      name: 'pollOptions',
      title: 'Poll Options',
      type: 'document',
      fields: [
        {
          name: 'options',
          title: 'Options',
          type: 'array',
          of: [{type: 'pollOption'}],
        },
      ],
    }),
  ],
})
