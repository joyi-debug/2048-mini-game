const MOVE_DIRECTION = {
  //定义移动方向的常量
  LEFT: 0,
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 3,
};

const MATRIX_SIZE = 4;

//用于保存棋盘中一个节点的坐标
class Point {
  //保存单个节点数据的类
  constructor(rowIndex, columnIndex) {
    this.rowIndex = rowIndex; //行数
    this.columnIndex = columnIndex; //列数
  }
}

//用于保存棋盘的数据以及用户操作
class Board {
  //记录游戏数据类
  constructor() {
    //构造函数
    this.matrix = [];
    this.currentScore = 0;
    this.fillEmptyMatrix();
  }
  fillEmptyMatrix() {
    //初始化空棋盘
    for (let i = 0; i < MATRIX_SIZE; i++) {
      const row = [];
      for (let j = 0; j < MATRIX_SIZE; j++) {
        row.push(0);
      }
      this.matrix.push(row);
    }
  }
  randomIndex() {
    //随机获取棋盘坐标
    return Math.floor(Math.random() * MATRIX_SIZE);
  }
  startGame() {
    //初始化两个cell
    for (let i = 0; i < 2; i++) {
      //4：1的概率将方块初始化为数字2或4
      this.matrix[this.randomIndex()][this.randomIndex()] =
        Math.random() < 0.8 ? 2 : 4;
    }
  }
  move(direction) {
    if (!this.canMove(direction)) {
      //判断是否可滑动，如不可滑动直接返回
      console.log("该方向不可用");
      return;
    }
    console.log(this.matrix);
    //将矩阵转至向左
    const rotatedMatrix = this.transformMatrixToDirectionLeft(
      this.matrix,
      direction
    );
    console.log(rotatedMatrix);
    //将矩阵向左滑动，非空方块向左移动
    const leftMovedMatrix = this.moveValidNumToLeft(rotatedMatrix);
    console.log(leftMovedMatrix);
    //相同数字合并
    for (let i = 0; i < MATRIX_SIZE; i++) {
      for (let j = 0; j < MATRIX_SIZE; j++) {
        //判断是否需要合并
        if (
          leftMovedMatrix[i][j] > 0 &&
          leftMovedMatrix[i][j] === leftMovedMatrix[i][j + 1]
        ) {
          leftMovedMatrix[i][j] *= 2;
          //分数增加
          this.currentScore += leftMovedMatrix[i][j];
          leftMovedMatrix[i][j + 1] = 0; //合并后，右侧方块清空
        }
      }
    }
    //再次将方块向左移动，去除新出现的空白方块
    const againMoveMatrix = this.moveValidNumToLeft(leftMovedMatrix);
    //将矩阵旋转至原来的方向
    this.matrix = this.reverseTransformMatrixFormDirectionLeft(
      againMoveMatrix,
      direction
    );
    //增加一个新数字
    const emptyPoints = this.getEmptyCells();
    if (emptyPoints.length !== 0) {
      const emptyPoint =
        emptyPoints[Math.floor(Math.random() * emptyPoints.length)];
      this.matrix[emptyPoint.rowIndex][emptyPoint.columnIndex] =
        Math.random() < 0.8 ? 2 : 4;
    }
  }
  canMove(direction) {
    //判断当前方向是否可滑动
    //获取旋转到向左的矩阵
    const rotatedMatrix = this.transformMatrixToDirectionLeft(
      this.matrix,
      direction
    );
    //根据direction,改为向左判断
    for (let i = 0; i < MATRIX_SIZE; i++) {
      for (let j = 0; j < MATRIX_SIZE; j++) {
        //如果有两个连着相等的数字方块，可以滑动
        if (
          rotatedMatrix[i][j] > 0 &&
          rotatedMatrix[i][j] === rotatedMatrix[i][j + 1]
        ) {
          console.log("可以滑动");
          return true;
        }
        //如果数字左边有0，可以滑动
        if (rotatedMatrix[i][j] === 0 && rotatedMatrix[i][j + 1] > 0) {
          console.log("可以滑动");
          return true;
        }
      }
    }
    console.log("不可以滑动");
    return false;
  }
  //将非空方块移至最左侧
  moveValidNumToLeft(matrix) {
    const movedMatrix = [];
    for (let i = 0; i < MATRIX_SIZE; i++) {
      const row = [];
      for (let j = 0; j < MATRIX_SIZE; j++) {
        //判断方块是否为空
        if (matrix[i][j] !== 0) {
          row.push(matrix[i][j]);
        }
      }
      while (row.length < MATRIX_SIZE) {
        row.push(0); //补齐空余部分
      }
      movedMatrix.push(row);
    }
    return movedMatrix; //返回移动后的矩阵
  }
  getEmptyCells() {
    const emptyCells = [];
    for (let i = 0; i < MATRIX_SIZE; i++) {
      for (let j = 0; j < MATRIX_SIZE; j++) {
        if (this.matrix[i][j] === 0) {
          emptyCells.push(new Point(i, j));
        }
      }
    }
    return emptyCells;
  }
  rotateMatrix(matrix) {
    //旋转棋盘矩阵
    const rotateMatrix = []; //旋转过后的矩阵
    for (let i = 0; i < MATRIX_SIZE; i++) {
      const row = [];
      for (let j = MATRIX_SIZE - 1; j >= 0; j--) {
        row.push(matrix[j][i]);
      }
      rotateMatrix.push(row);
    }
    return rotateMatrix;
  }
  rotateMultipleTimes(matrix, rotateNum) {
    let newMatrix = matrix;
    while (rotateNum > 0) {
      //根据rotateNum进行多次旋转
      newMatrix = this.rotateMatrix(newMatrix);
      rotateNum--;
    }
    return newMatrix;
  }
  transformMatrixToDirectionLeft(matrix, direction) {
    //将不同方向矩阵转至向左
    switch (direction) {
      case MOVE_DIRECTION.LEFT:
        return matrix;
      case MOVE_DIRECTION.TOP:
        return this.rotateMultipleTimes(matrix, 3);
      case MOVE_DIRECTION.RIGHT:
        return this.rotateMultipleTimes(matrix, 2);
      case MOVE_DIRECTION.BOTTOM:
        return this.rotateMatrix(matrix);
      default:
        return matrix;
    }
  }
  //将向左矩阵恢复原向
  reverseTransformMatrixFormDirectionLeft(matrix, direction) {
    switch (direction) {
      case MOVE_DIRECTION.LEFT:
        return matrix;
      case MOVE_DIRECTION.TOP:
        return this.rotateMultipleTimes(matrix, 1);
      case MOVE_DIRECTION.RIGHT:
        return this.rotateMultipleTimes(matrix, 2);
      case MOVE_DIRECTION.BOTTOM:
        return this.rotateMultipleTimes(matrix, 3);
      default:
        return matrix;
    }
  }
  //判断游戏是否结束
  isGameOver() {
    //通过判断是否4个方向都已无法滑动
    return (
      !this.canMove(MOVE_DIRECTION.LEFT) &&
      !this.canMove(MOVE_DIRECTION.TOP) &&
      !this.canMove(MOVE_DIRECTION.RIGHT) &&
      !this.canMove(MOVE_DIRECTION.BOTTOM)
    );
  }
  //判断游戏是否已经胜利
  isWinning() {
    let max = 0;
    const winNum = 2048;
    for (let row of this.matrix) {
      //遍历棋盘，判断是否有方块数字为2048
      for (let cell of row) {
        max = Math.max(cell, max);
      }
      if (max > winNum) {
        return false;
      }
    }
    return max === winNum;
  }
}

module.exports.MOVE_DIRECTION = MOVE_DIRECTION;
module.exports.Board = Board;
