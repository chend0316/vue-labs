/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compileToFunctions } = createCompiler(baseOptions)

export { compileToFunctions }
