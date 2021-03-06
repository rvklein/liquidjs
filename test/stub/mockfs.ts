import { isString, forOwn } from 'src/util/underscore'
import fs from 'src/fs'

type fileDescriptor = { mode: string, content: string }

let files: { [path: string]: fileDescriptor } = {}
const readFile = fs.readFile
const exists = fs.exists

export function mock (options: { [path: string]: (string | fileDescriptor) }) {
  forOwn(options, (val, key) => {
    files[key] = isString(val)
      ? { mode: '33188', content: val as string }
      : val as fileDescriptor
  })
  fs.readFile = async function (path) {
    console.log('mock fs read called', path)
    const file = files[path]
    if (file === undefined) throw new Error('ENOENT')
    if (file.mode === '0000') throw new Error('EACCES')
    return file.content
  }

  fs.exists = async function (path) {
    console.log('mock fs exists called', path)
    return !!files[path]
  }
}

export function restore () {
  files = {}
  fs.readFile = readFile
  fs.exists = exists
}
