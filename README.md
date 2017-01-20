# hello webpack

## 起步
在开始学习`Webpack`之前，请先确保安装了[Node.js](https://nodejs.org/en/download/),建议安装最新版的Node.js。然后就可以使用npm安装Webpack了。你可以将Webpack安装到全局，不过我们通常会把它安装到项目依赖中。

现在进入项目目录，并使用`npm init -y`初始化一个默认的package.json。打开终端，键入命令:
```shell
npm install webpack --save-dev
```
安装好Webpack依赖后，新建一个webpack.config.js文件，用来配置webpack。
这里是个样例：
```js
var path = require('path');
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'http://localhost:8080',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: path.resolve(__dirname, '.dist/img/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
}
```
## Webpack配置
**webpack.config.js**为Webpack的默认配置，我们可以为开发环境和生产环境分别做不同的配置。下面一一介绍每个配置的作用。
#### entry
`entry`是入口配置项，可以是`string`,`Array`或者一个`Object`:
```js
entry: {
  app: './src/main.js'
},
```
```js
entry: './src/main.js'
```
如果页面有多个入口可以这样写:
```js
entry: ['./src/home.js', '.src/profile.js']
//或
entry: {
  home: './src/home.js',
  profile: './src/profile.js'
}
```
#### output
`output`是输出配置。
```js
output: {
  path: path.resolve(__dirname, './dist'),
  publicPath: 'http://localhost:8080',
  filename: '[name].js',
  chunkFilename: '[name].[hash].js'
}
```
*path*是文件输出到本地的路径，*publicPath*是文件的引用路径，可用来被一些Webpack插件用来处理CSS，HTML文件中的URL，一般用于生产模式，*filename*是打包后的入口文件名，*chunkFilename*是每个模块编译后的文件名，其中[hash]是用来唯一标识文件，主要用来防止缓存。
##### path
仅仅用来告诉Webpack在哪里存放结果文件,上面例子中，最终的打包文件会放到与当前脚本文件同级目录的dist目录下。即：
```
hello-webpack
  +dist
  -webpack.config.js
```
##### filename
入口文件打包后的名称,`[name]`对应着入口文件的key值，例如：`app.js`,这对多入口文件是很有用的，应为入口文件可以有多个，但是filename只能有一个，所以对于上面的多入口，最后就是:`home.js`,'profile.js'，当然为了提现文件层级关系可以这么写:
```
filename: 'js/[name].js'
```
最后的结果就是：
```
hello-webpack
  -dist
    -js
       home.js
       profile.js
  -webpack.config.js
```
#####  chunkFilename
即非入口文件打包后的名称，未被列在entry中，却又需要被打包出来的文件命名配置。一般情况下是不需要这个配置的。比如我们在做异步加载模块时就需要用到了：
```js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./my-async-component'], resolve)
})
```
##### publicPath
对于*publicPath*的理解，可以举个简单的例子：
在开发环境中,我使用webpack-dev-server作为服务器的，默认为8080端口，所以`publicPath`为`http://localhost:8080`，当然你也可以不要配置`publicPath`，webpack默认就是这个路径。
在项目中我使用了`url-loader`加载图片，
```js
{
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url',
    query: {
      limit: 10000,
      name: path.resolve(__dirname, './static/img/[name].[hash:7].[ext]')
    }
}
```
在`main.js`中使用了图片
```
import Girl from 'img/girl.jpg' /* //Users/mac/Desktop/hello-webpack/static/img/girl.7672e53.jpg */
```
那么最终浏览器在引用图片时会自动将配置的`publicPath`与上面生成的路径进行拼接，最终的访问路径就是：
```
http://localhost:8080/Users/mac/Desktop/hello-webpack/static/img/girl.7672e53.jpg
```
所以可以根据开发环境和生产环境配置不同的`publicPath`，如果在生产环境中你访问的资源文件在项目目录下，那么可以这样
```
publicPath: '/',
```
在生产环境中，可以这样配置`output`:
```js
output: {
  path: path.resolve(__dirname, './dist'),
  publicPath: '/',
  filename: 'js/[name].[chunkhash].js'
}
```
