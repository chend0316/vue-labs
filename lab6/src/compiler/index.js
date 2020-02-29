/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { extend } from 'shared/util'
import { detectErrors } from './error-detector'

function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  optimize(ast, options)
  const code = generate(ast, options)

  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}

/**
 * 编译器创建时指定baseOptions选项会伴随编译器一生，编译器调用时也会指定options选项
 * 若有冲突，后者会覆盖前者
 */
export function createCompiler (baseOptions: CompilerOptions) {
  function compileToFunctions (
    template: string,
    options?: CompilerOptions
  ): CompiledResult {
    const errors = []
    const tips = []

    const warn = (msg, range, tip) => {
      (tip ? tips : errors).push(msg)
    }

    // 将两个options合并成一个
    const finalOptions = mergeOptions(baseOptions, options)
    finalOptions.warn = warn

    // 编译成AST和render字符串
    const compiled = baseCompile(template.trim(), finalOptions)
    if (process.env.NODE_ENV !== 'production') {
      detectErrors(compiled.ast, warn)
    }
    compiled.errors = errors
    compiled.tips = tips

    // 将render字符串转成render函数
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    return res
  }

  return {
    compileToFunctions
  }
}

function mergeOptions(baseOptions, options) {
  const finalOptions = Object.create(baseOptions)
  if (options) {
    if (options.modules) {
      finalOptions.modules =
        (baseOptions.modules || []).concat(options.modules)
    }
    if (options.directives) {
      finalOptions.directives = extend(
        Object.create(baseOptions.directives || null),
        options.directives
      )
    }
    for (const key in options) {
      if (key !== 'modules' && key !== 'directives') {
        finalOptions[key] = options[key]
      }
    }
  }
  return finalOptions
}

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
