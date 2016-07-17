# React-Webpack

## 시작하기

 - 요구사항 : Node.js
 - 프로젝트 폴더 생성
 - `npm init` ( 프로젝트 생성, package.json )
 - `npm install --save-dev webpack` ( 웹팩 설치 )


## 기본구조
- app/ 
	- index.js
	- component.js
- build/ 
- package.json 
- webpack.config.js


## html-webpack-plugin 설치

- 웹팩 번들을 모두 포함하는 최종 HTML 파일을 생성해줌
- 컴파일시 해시를 파일명에 추가하여 캐시문제를 해결
- `npm install --save-dev html-webpack-plugin` 
 

## webpack.config.js 
실행환경을 일일이 입력하기 번거롭고 어렵기 때문에 설정파일을 만들어서 자동으로 컴파일 할 수 있습니다.
기본 설정 파일은 `webpack.config.js` 입니다. 임의의 파일명을 사용하고 싶다면. `webpack --config 파일명.js` 형태로 사용하면 됩니다.

    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    
    const PATHS = {
      app: path.join(__dirname, 'app'),
      build: path.join(__dirname, 'build')
    };
    
    module.exports = {
      // Entry accepts a path or an object of entries.
      // We'll be using the latter form given it's
      // convenient with more complex configurations.
      entry: {
        app: PATHS.app
      },
      output: {
        path: PATHS.build,
        filename: '[name].js'
      },
      plugins: [
        new HtmlWebpackPlugin({
          title: 'React-Webpack'
        })
      ]
    };

## 빌드 명령어 추가
package.json 에 간단하게 빌드를 할 수 있도록 명령어를 추가합니다.

    "scripts": {
      "build": "webpack"
    },

## webpack-merge 설치
웹팩 config 를 분리하여 merge 해주는 플러그인으로, 여러 빌드 환경에 따라 config를 관리하기 쉽게 도와줍니다.

    npm install --save-dev webpack-merge

`webpack.config.js` 변경

    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const merge = require('webpack-merge');
    
    const PATHS = {
        app: path.join(__dirname, 'app'),
        build: path.join(__dirname, 'build')
    };
    
    const common = {
        // Entry accepts a path or an object of entries.
        // We'll be using the latter form given it's
        // convenient with more complex configurations.
        entry: {
            app: PATHS.app
        },
        output: {
            path: PATHS.build,
            filename: '[name].js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'React-Webpack'
            })
        ]
    };
    
    var config;
    
    // Detect how npm is run and branch based on that
    switch(process.env.npm_lifecycle_event) {
        case 'build':
            config = merge(common, {});
            break;
        default:
            config = merge(common, {});
    }
    
    module.exports = config;

## webpack-validator 설치
웹팩 config의 벨리데이션을 도와줍니다. 

    npm install --save-dev webpack-validator

`webpack.config.js` 변경

    const validate = require('webpack-validator'); // 추가
    module.exports = validate(config);  // 마지막줄 변경


## Webpack 개발환경 세팅(webpack-dev-server)
Webpack Dev Server 를 통해서 개발을 할때, 코드수정 후 저장하면 자동으로 브라우저가 새로고침이 됩니다.(LiveReload, Browsersync 와 같은 기능)

    npm install --save-dev webpack-dev-server

`package.json` 에 명령어 추가

    "scripts": {
      "start": "webpack-dev-server", 
      "build": "webpack"
    },

## Hot Module Replacement (HMR) 설정
Webpack 의 강력한 기능중에 하나가 HMR 입니다. 코드가 변경되어 반영시에 상태를 유지할 수 있는 기능 입니다. 
`webpack.config.js` 파일이 너무 길어질 경우 유지보수가 힘들기 때문에 따로 분리하여 관리하도록 합니다. 

libs/parts.js

    const webpack = require('webpack');
    
    exports.devServer = function(options) {
      return {
        devServer: {
          // Enable history API fallback so HTML5 History API based
          // routing works. This is a good default that will come
          // in handy in more complicated setups.
          historyApiFallback: true,
    
          // Unlike the cli flag, this doesn't set
          // HotModuleReplacementPlugin!
          hot: true,
          inline: true,
    
          // Display only errors to reduce the amount of output.
          stats: 'errors-only',
    
          // Parse host and port from env to allow customization.
          //
          // If you use Vagrant or Cloud9, set
          // host: options.host || '0.0.0.0';
          //
          // 0.0.0.0 is available to all network devices
          // unlike default `localhost`.
          host: options.host, // Defaults to `localhost`
          port: options.port // Defaults to 8080
        },
        plugins: [
          // Enable multi-pass compilation for enhanced performance
          // in larger projects. Good default.
          new webpack.HotModuleReplacementPlugin({
            multiStep: true
          })
        ]
      };
    }

`webpack.config.js` 변경

    const parts = require('./libs/parts'); // 추가
    // build case의 config = merge(common, {}); 변경
    config = merge(
          common,
          parts.devServer({
            // Customize host/port here if needed
            host: process.env.HOST,
            port: process.env.PORT
          })
        );
