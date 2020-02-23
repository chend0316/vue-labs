import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'

const modules = []

export const patch = createPatchFunction({ nodeOps, modules })
