require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

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

// 获取区间内的随机值
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low)
}

// 获取0~30之间的角度
function get30DegRandom () {
  return (Math.random() > 0.5?'': '-') + Math.ceil(Math.random() * 30)
}

var ImgFigure = React.createClass({
  handleClick (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center()
    }
    e.stopPropagation();
    e.preventDefault()
  },

  render: function () {
    var styleObj = {}
      // 如果props属性中指定了这张图的位置则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos // 图片的位置信息
    }
    // 如果图片有旋转角度
    if (this.props.arrange.rotate) {
      (['Moz', 'ms', 'Webkit', '']).forEach(item => {
        styleObj[item + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
      })
    }
    if (this.props.isCenter) {
      styleObj.zIndex = 11
    }
    var imgFigureClassName = 'img-figure'
        imgFigureClassName += this.props.arrange.isInverse? ' is-inverse': ''

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
           <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
           </div>
        </figcaption>
      </figure>
    )
  }
})

// console.log(imageDatas)
var AppComponent = React.createClass ({
  getInitialState: function () {
    return {
      imgsArrangeArr: [  // 通过数组记录图片的位置信息
        //pos: {left: , top: }  位置
        //rotate: 0  旋转
        //isInverse: false 图片正反面
        // isCenter: false 不剧中
      ]
    }
  },
  Constant: {  // 可取位置信息
    centerPos: {  // 中心位置点
      left: 0,
      right: 0
    },
    hPosRange: {    // 两侧水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {  // 上侧垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  },
  // 图片居住
  center: function (index) {
    return function () {
      this.rearrange(index)
    }.bind(this)
  },
  // 翻转图片
  // 这是一个闭包函数
  inverse: function (index) {
    return function() {
      console.log(this.state)
      var imgsArrangeArr = this.state.imgsArrangeArr

        console.log(imgsArrangeArr)
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse

      this.setState({
        imgsArrangArr: imgsArrangeArr
      })
    }.bind(this)
  },

  //   重新布局图片
  rearrange(centerIndex) {
    var imgsArrangArr = this.state.imgsArrangeArr, //提取位置信息,方便引用
        Constant = this.Constant,  // 位置
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange, 
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),  // 取一个或者不取0, 1
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangArr.splice(centerIndex, 1)

        // 居中
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        }

        
        // 取出上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangArr.length - topImgNum))
        imgsArrangeTopArr = imgsArrangArr.splice(topImgSpliceIndex, topImgNum)  // 返回值为删除的数组,splice,这里删除0, 1个
   

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
          imgsArrangeTopArr[index] = {
              pos: {
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
              rotate: get30DegRandom(),
              isCenter: false
          }
        })

        // 布局两侧图片
        for (var i = 0 , j = imgsArrangArr.length, k = j/2;i < j;i++) {  //数组一半左分区,一半右分区
          var hPosRangeLORX = null

          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX
          } else {
            hPosRangeLORX = hPosRangeRightSecX
          }

          imgsArrangArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
        }
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
        }
        imgsArrangArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]) 

  
        this.setState({
          imgsArrangeArr: imgsArrangArr
        })
  },

  // 组件添加后，为每个图片初始化位置
  componentDidMount: function () {   // 获取界面的信息(长宽)
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),  //舞台位置
        stageW = stageDOM.scrollWidth,  // 舞台宽度
        stageH = stageDOM.scrollHeight,  // 舞台高度
        halfStageW = Math.ceil(stageW/2),  // 一半的舞台宽
        halfStageH = Math.ceil(stageH/2)   // 一半的舞台高


    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),   //只需要取图片信息,这里取第一张图片
        imgW = imgFigureDOM.scrollWidth,  // 图片宽
        imgH = imgFigureDOM.scrollHeight,  // 图片高
        halfImgW = Math.ceil(imgW / 2),  // 图片一半宽
        halfImgH = Math.ceil(imgH / 2)   // 图片一半高

    this.Constant.centerPos = {  // 中心图片的左上角位置信息
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧右侧图片的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
    this.Constant.hPosRange.y[0] = -halfImgH
    this.Constant.hPosRange.y[1] = stageH - halfImgH

    // 计算上侧图片取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
    this.Constant.vPosRange.x[0] = halfStageW - imgW
    this.Constant.vPosRange.x[1] = halfImgW

    this.rearrange(0)  //初始化为,序号为0的图片剧种排布位置

  },

  render() {
    var controllerUnits = [],
        imgFigures = []
    imageDatas.forEach(function(item, index){
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={item}
        inverse={this.inverse(index)} center={this.center(index)}
        ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>)

    }.bind(this))
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
})

AppComponent.defaultProps = {
};

export default AppComponent;
