// index.js
// 获取应用实例
/* const app = getApp(); */
const board = require("./board");
const gameManager = require("../../utils/game-manager");
//设置一个常量MIN_OFFSET为40
const MIN_OFFSET = 40;

Page({
  data: {
    currentScore: 0,
    heighestScore: 0,
    //用于判断滑动方向的属性值
    touchStartX: 0, //触摸开始横坐标
    touchStartY: 0, //触摸开始纵坐标
    touchEndX: 0, //触摸结束横坐标
    touchEndY: 0, //触摸结束纵坐标
    //棋盘数据
    matrix: [[]],
  },
  board: new board.Board(),
  onLoad() {
    this.startGame(); //开始游戏
  },
  startGame() {
    //初始化棋盘对象
    this.board = new board.Board();
    this.board.startGame(); //开始游戏
    this.setData({
      //更新棋盘为board.matrix
      matrix: this.board.matrix,
      currentScore: 0,
      heighestScore: gameManager.getHighestScore(),
    });
  },
  onStartNewGame() {
    this.startGame();
  },
  onTouchStart(e) {
    //触摸开始回调函数，记录触摸起点坐标
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  },
  onTouchMove(e) {
    //手指移动回调函数，更新结束点坐标
    const touch = e.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  onTouchEnd(e) {
    //触摸结束回调函数，计算滑动偏移量，进行对应逻辑处理
    const offsetX = this.touchEndX - this.touchStartX;
    const offsetY = this.touchEndY - this.touchStartY;
    //判断移动方向
    const moveVertical = Math.abs(offsetY) > Math.abs(offsetX);
    if (moveVertical) {
      if (offsetY < -MIN_OFFSET) {
        //判断是否达到偏移量的最小值
        console.log("move top");
        this.board.move(board.MOVE_DIRECTION.TOP);
        this.setData({
          //更新移动后的棋盘数据和当前游戏得分
          currentScore: this.board.currentScore,
          matrix: this.board.matrix,
        });
      } else if (offsetY > MIN_OFFSET) {
        console.log("move bottom");
        this.board.move(board.MOVE_DIRECTION.BOTTOM);
        this.setData({
          //更新移动后的棋盘数据和当前游戏得分
          currentScore: this.board.currentScore,
          matrix: this.board.matrix,
        });
      }
    } else {
      if (offsetX < -MIN_OFFSET) {
        //判断是否达到偏移量的最小值
        console.log("move left");
        this.board.move(board.MOVE_DIRECTION.LEFT);
        this.setData({
          //更新移动后的棋盘数据和当前游戏得分
          currentScore: this.board.currentScore,
          matrix: this.board.matrix,
        });
      } else if (offsetX > MIN_OFFSET) {
        console.log("move right");
        this.board.move(board.MOVE_DIRECTION.RIGHT);
        this.setData({
          //更新移动后的棋盘数据和当前游戏得分
          currentScore: this.board.currentScore,
          matrix: this.board.matrix,
        });
      }
    }
    //在每次用户滑动操作结束时，判断游戏是否结束
    if (this.board.isGameOver()) {
      //获取历史最高分
      const highestScore = gameManager.getHighestScore();
      if (this.data.currentScore > highestScore) {
        //如当前分数超过历史最高分，则更新最高分
        gameManager.setHighestScore(this.data.currentScore);
      }
      wx.showModal({
        title: "游戏结束",
        content: "再玩一次",
        showCanel: false,
        success: () => {
          //用户点击“确定”按钮的回调函数
          this.startGame(); //重新开始游戏
        },
      });
    }
    if (this.board.isWinning()) {
      //判断游戏是否已经胜利
      //显示祝福语，可以继续玩
      wx.showToast({
        title: "达成2048成绩",
        icon: "success",
      });
    }
  },
});
