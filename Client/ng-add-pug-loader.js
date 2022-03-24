const fs = require('fs')
const commonCliConfig =
  'node_modules/@angular-devkit/build-angular/src/webpack/configs/common.js'
const pugRules =
  '{test:/\\.(pug|jade)$/,exclude:/\\.(include|partial)\\.(pug|jade)$/,use:[{loader:"apply-loader" },{loader:"pug-loader"}]},{test:/\\.(include|partial)\\.(pug|jade)$/,loader:"pug-loader"},'

fs.readFile(commonCliConfig, (err, data) => {
  if (err) throw err

  const configText = data.toString()
  if (configText.indexOf(pugRules) > -1) {
    return
  }

  const position = configText.indexOf('rules: [') + 8
  const output = [
    configText.slice(0, position),
    pugRules,
    configText.slice(position),
  ].join('')
  const file = fs.openSync(commonCliConfig, 'r+')
  fs.writeFile(file, output, (error) => {
    if (error)
      console.error(
        "An error occurred while overwriting Angular CLI's Webpack config"
      )

    fs.close(file, () => {})
  })
})

const typescriptCliConfig =
  'node_modules/@angular-devkit/build-angular/src/webpack/configs/typescript.js'

fs.readFile(typescriptCliConfig, (err, data) => {
  if (err) {
    throw err
  }

  const typescriptText = data.toString()

  if (
    typescriptText.indexOf('directTemplateLoading') === -1 ||
    typescriptText.indexOf('directTemplateLoading: false,') > -1
  ) {
    return
  }

  const output = typescriptText.replace(
    'directTemplateLoading: true,',
    'directTemplateLoading: false,'
  )

  const file2 = fs.openSync(typescriptCliConfig, 'r+')
  fs.writeFile(file2, output, (error) => {
    if (error)
      console.error(
        "An error occurred while overwriting Angular CLI's Webpack config"
      )

    fs.close(file2, () => {})
  })
})
