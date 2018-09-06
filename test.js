var a = {
  port : 8000,
  devtools: 'vue',
  name: 'jike'
}

var b = {
  port: 9000,
  config: 'dev',
  devtools: 'pro'
}

var out = Object.assign({}, a, b)

console.log(out)