require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json')

// 利用函数,生成图片路径
function genImageURL(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i]

    singleImageData.imageURL = require('../images/' + singleImageData.fileName)

    imageDatasArr[i] = singleImageData
  }
  return imageDatasArr
}

imageDatas = genImageURL(imageDatas)

// console.log(imageDatas)
class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;