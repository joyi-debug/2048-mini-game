//game-manager.js用来存储历史最高分记录
//storage中存放最高分的key
const HIGHEST_SCORE_KEY = "highest_score";
const DEFAULT_HIGHEST_SCORE = 0; //默认初始时的最高分
function setHighestScore(score) {
  //更新最高分数据
  if (score < 0) {
    throw new Error("score is invalid");
  }
  wx.setStorageSync(HIGHEST_SCORE_KEY, score);
}

function getHighestScore() {
  //获取最高分数据
  return wx.getStorageSync(HIGHEST_SCORE_KEY) || DEFAULT_HIGHEST_SCORE;
}

module.exports = {
  setHighestScore,
  getHighestScore,
};
