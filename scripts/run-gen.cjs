// Runner generator tsc→node dengan resolver alias '@/'.
// tsc TIDAK menulis ulang `paths` saat emit — modul dgn import runtime `@/x`
// (mis. ComposableRenderer → @/lib/design-tokens/packs) gagal di-require.
// Runner ini memetakan '@/x' → <outDir>/src/x sebelum entry dimuat.
//
// Pakai: node scripts/run-gen.cjs <outDir> <entryJs>
//   mis. node scripts/run-gen.cjs .tmp-gen-lux .tmp-gen-lux/scripts/gen-lux-entry.js
const path = require('path')
const Module = require('module')

const [, , outDir, entry] = process.argv
if (!outDir || !entry) {
  console.error('usage: node scripts/run-gen.cjs <outDir> <entryJs>')
  process.exit(1)
}
const root = path.resolve(outDir)
const orig = Module._resolveFilename
Module._resolveFilename = function (request, ...args) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(root, 'src', request.slice(2))
  }
  return orig.call(this, request, ...args)
}
require(path.resolve(entry))
