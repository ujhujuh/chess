function getPosition(array) {
    // 随机取一个位置
    let nullKey = [];
    for (let i = 0; i <= 12; i ++) {
        for (let j = 0; j <= 16; j ++) {
            if (array[i][j] == null) {
                nullKey.push(i + "," + j);
            }
        }
    }

    let scores = [];
    
    // i控制行，j控制列
    for (let i = 0; i <= 12; i ++) {
        for (let j = 0; j <= 16; j ++) {
            if (array[i][j] == null) {
                // 自己角度得分(人机持白，为0)
                let score = getDirectionScores(array, j, i, 0);
                scores.push({
                    score: score,
                    position: i + "," + j
                });
                
                // 对手角度得分(对手持黑，为1)
                let ownScore = getDirectionScores(array, j, i, 1);
                scores.push({
                    score: ownScore,
                    position: i + "," + j
                });
            }
        }
    }

    
    // 对scores['score']二维数组进行排序，按层级比较，取得分最高的（难度层级为n则比较到第n层，共4个方向4层）
    let level = 4;
    let m = k = scores;
    let p = {};
    for (let i = 0; i < level; i++) {
        let score = 0;
        m = k;
        m.forEach(s => {
            if (s['score'][i] > score) {
                k = [];
                k.push(s);
                score = s['score'][i];
            } else if (s['score'][i] == score) {
                k.push(s);
            }
        })
    };

    console.info("==============");
    console.info(scores);
    console.info(k);
    return k[0]['position'];
}

// 获取分值
function getDirectionScores(array, idxX, idxY, val) {
    // 模拟赋值
    array[idxY][idxX] = val;

    console.info(idxX, idxY, val);
    let directionScores = [], score = 0;

    // 例如 null, 1, 1, 1, null, 则num = 3, nullNum = 2
    let num = 0, nullNum = 0;
    // 判断左右
    let a = idxX, b = idxY;
    while (a >= 0) {
        if (array[b][a] == val) {
            num ++;
            a --;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    a = idxX;
    while (a <= 16) {
        if (array[b][a] == val) {
            num ++;
            a ++;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    num --;
    score = getScoreByType(num, nullNum);
    directionScores.push(score);

    // 判断上下
    a = idxX, b = idxY, num = 0, nullNum = 0;
    while (b >= 0) {
        if (array[b][a] == val) {
            num ++;
            b --;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    b = idxY;
    while (b <= 12) {
        if (array[b][a] == val) {
            num ++;
            b ++;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    num --;
    score = getScoreByType(num, nullNum);
    directionScores.push(score);

    // 判断左上右下
    a = idxX, b = idxY, num = 0, nullNum = 0;
    while (a >= 0 && b >= 0) {
        if (array[b][a] == val) {
            num ++;
            a --;
            b --;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    a = idxX, b = idxY;
    while (a <= 16 && b <= 12) {
        if (array[b][a] == val) {
            num ++;
            a ++;
            b ++;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    num --;
    score = getScoreByType(num, nullNum);
    directionScores.push(score);

    // 判断右上左下
    a = idxX, b = idxY, num = 0, nullNum = 0;
    while (a >= 0 && b <= 12) {
        if (array[b][a] == val) {
            num ++;
            a --;
            b ++;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    a = idxX, b = idxY;
    while (a <= 16 && b >= 0) {
        if (array[b][a] == val) {
            num ++;
            a ++;
            b --;
        } else {
            if (array[b][a] == null) {
                nullNum ++;
            }
            break;
        }
    }
    num --;
    score = getScoreByType(num, nullNum);
    directionScores.push(score);

    // 去值
    array[idxY][idxX] = null;

    // 对4个方向的分值排序，从大到小
    directionScores.sort(function(a, b) {return b - a;});
    return directionScores;
}

// 总共10种类型, X表示要下棋的位置
/** 
    0, 0, 0, 0, X               -> 5

    无, 0, 0, 0, X, 无          -> 4 
    有, 0, 0, 0, X, 无          -> 3
    无, 0, 0, 0, X, 有          -> 0

    无, 0, 0, X, 无             -> 3
    有, 0, 0, X, 无             -> 2
    有, 0, 0, X, 有             -> 0

    无, 0, X, 无                -> 2
    有, 0, X, 无                -> 1
    有, 0, X, 有                -> 0

    无, X, 无                   -> 1
    有, X, 无                   -> 0.5
    有, X, 有                   -> 0
*/


function getScoreByType(num, nullNum) {
    if (num == 5) {
        return 5;
    } else if (num == 4) {
        if (nullNum == 2) {
            return 4;
        } else if (nullNum == 1) {
            return 3;
        } else {
            // numNum == 0
            return 0;
        }
    } else if (num == 3) {
        if (nullNum == 2) {
            return 3;
        } else if (nullNum == 1) {
            return 2;
        } else {
            // numNum == 0
            return 0;
        }
    } else if (num == 2) {
        if (nullNum == 2) {
            return 2;
        } else if (nullNum == 1) {
            return 1;
        } else {
            // numNum == 0
            return 0;
        }
    } else {
        // num == 1
        if (nullNum == 2) {
            return 1;
        } else if (nullNum == 1) {
            return 0.5;
        } else {
            // numNum == 0
            return 0;
        }
    }
}