import icon from 'react-icons/lib/fa/file-o'

export default {
  name: 'filesTest',
  type: 'document',
  title: 'Files test',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'someFile',
      title: 'A simple file',
      type: 'file'
    },
    {
      name: 'arrayOfFiles',
      title: 'An array of files',
      type: 'array',
      of: [{type: 'file'}]
    },
    {
      name: 'fileWithFields',
      title: 'File with additional fields',
      type: 'file',
      fields: [
        {
          title: 'Description',
          name: 'description',
          type: 'string',
          options: {isHighlighted: true}
        },
        {
          title: 'Not so important',
          name: 'notsoimportant',
          type: 'string'
        }
      ]
    }
  ]
}
