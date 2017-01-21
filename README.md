# hello webpack

## 起步
在开始学习`Webpack`之前，请先确保安装了[Node.js](https://nodejs.org/en/download/),建议安装最新版的Node.js。然后就可以使用npm安装Webpack了。你可以将Webpack安装到全局，不过我们通常会把它安装到项目依赖中。

现在进入项目目录，并使用`npm init -y`初始化一个默认的package.json。打开终端，键入命令:
```shell
//全局安装
npm install webpack --g
//安装到项目依赖中
npm install webpack --save-dev
```
安装好Webpack依赖后，新建一个webpack.config.js文件，用来配置webpack。不过在配置webpack之前，先安装`webpack-dev-server`:
```shell
//全局安装
npm install webpack-dev-server --g
//安装到项目依赖中
npm install webpack-dev-server --save-dev
```
### webpack-dev-server
它将在localhost:8080启动一个express静态资源web服务器，并且会以监听模式自动运行webpack，在浏览器打开[http://localhost:8080/](http://localhost:8080/)或[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)可以浏览项目中的页面和编译后的资源输出，并且通过一个socket.io服务实时监听它们的变化并自动刷新页面。
在终端中执行
```shell
webpack-dev-server --inline --hot
```
当我们修改了模块的内容后，`webpack-dev-server`会自动执行打包(打包后的结果会缓存到内存中，所以不能在本地文件中看到打包后的文件)。`inline`选项为整个页面添加了"Live Reloading"功能，而`hot`选项开启了"Hot Module Reloading"功能，这样就会尝试着重载发生变化的组件，而不是整个页面。这样就实现了修改文件，界面就会自动更新了。
我们可以在`package.json`中输入以下内容：
```json
"scripts": {
   "dev": "webpack-dev-server --colors --hot --inline",
   "build": "webpack --colors --watch"
},
```
这样我们只需要键入`npm run dev`命令就能执行上面的命令了。
在这之前，先看看项目的结构以及一个简单的`webpack config`:
```
|——hello-webpack
   |——src  # 项目源码
      |——assets # 资源文件
         |——img # 图片
         |——css # 样式
      |——component  # 页面组件
      main.js  # 入口文件
   |——static # 静态资源文件
   index.html
   package.json
   webpack.config.js
```
`webpack config.js`：
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
    publicPath: '',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      'src': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components'),
      'img': path.resolve(__dirname, './static/img')
    }
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
### entry
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
### output
`output`是输出配置。
```js
output: {
  path: path.resolve(__dirname, './dist'),
  publicPath: '/',
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
入口文件打包后的名称,`[name]`对应着入口文件的key值，例如：`app.js`,这对多入口文件是很有用的，应为入口文件可以有多个，但是filename只能有一个，所以对于上面的多入口，最后就是:`home.js`,'profile.js'，当然为了体现文件层级关系可以这么写:
```
filename: 'js/[name].js'
```
最后的结果就是：
```
|——hello-webpack
   |——dist
   |——js
       home.js
       profile.js
    webpack.config.js
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
文件的引用路径，可用来被一些Webpack插件用来处理CSS，HTML文件中的URL，在开发模式下建议使用相对路径，在生产模式中，如果你的资源文件放在别的服务器上，可以使用服务器的地址。当然你也可以不用配置`publicPath`，。
在项目中我使用了`url-loader`加载图片，
```js
{
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url',
    query: {
      limit: 10000,
      name: path.join('static', 'img/[name].[hash:7].[ext]') # 图片最终的输出路径
    }
}
```
在`main.js`中使用了图片
```
import Girl from 'assets/img/girl.jpg'
```
那么最终浏览器访问的图片路径就是：
```
static/img/girl.7672e53.jpg 
```
所以可以根据开发环境和生产环境配置不同的`publicPath`。
在生产环境中，由于我的资源文件放在项目目录下，所以可以这样配置`output`:
```js
output: {
  path: path.resolve(__dirname, './dist'),
  publicPath: './',
  filename: 'js/[name].[chunkhash].js'
}
```
那么最终打包后的输出目录结构就是这样的:
  |——dist
     |——static
        |——img
           girl.7672e53.jpg
        |——js
           app.js
      index.html
所以通过`static/img/girl.7672e53.jpg `可以访问到图片。在开发环境下，经过测试，将`publicPath`设置为'./'界面是无法加载出来的，所以在开发环境下可以不用设置。
### loader
```js
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
  }
  ```
由于Webpack本身只能处理JavaScript 模块，如果要处理其他类型的文件，就需要使用loader 进行转换。Loader可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件作为参数，返回转换的结果。不同的loader可以将各种类型的文件转换为浏览器能够接受的格式如JS，Stylesheets等等。
#### loader链
多个loader可以链式调用，作用于同一种文件类型。工作链的调用顺序是*从右向左*，各个loader之间使用"!"分开。
以处理css文件为例，我们需要[css-loader](https://github.com/webpack/css-loader)来处理css文件，然后使用[style-loader](https://github.com/webpack/style-loader)将css样式插入到html的`style`标签中。
