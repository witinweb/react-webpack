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