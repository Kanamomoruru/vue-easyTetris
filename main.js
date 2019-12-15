var app = new Vue({
    el: "#app",
    computed: {
    //ゲームの開始状態に応じたメッセージを返す
    reversedStartMessage() {
        if(this.isStarted) 
        　return 'スペースキー押下でゲームをリセットします'
        else
            return 'スペースキー押下でゲームを開始します'
    　　}
    },
    data: {
      // ゲームが始まっているかを判定するフラグ
      isStarted: false,
      // 画面サイズY
      displaySizeY: 24,
      // 画面サイズX
      displaySizeX: 13,
      // 操作中のブロックの位置情報
      currentYX: [],
      // 操作中のブロックの傾き
      currentAngle: 0,
      // 操作中のブロックの色
      currentColor: 0,
      // 緑ブロックの配置情報
      greenBlock: [
        [[0,1],[0,2],[1,1],[1,2]],
        [[0,1],[0,2],[1,1],[1,2]],
        [[0,1],[0,2],[1,1],[1,2]],
        [[0,1],[0,2],[1,1],[1,2]],
      ],
      // 赤ブロックの配置情報
      redBlock: [
        [[0,2],[1,2],[2,2],[3,2]],
        [[2,0],[2,1],[2,2],[2,3]],
        [[1,2],[2,2],[3,2],[4,2]],
        [[2,1],[2,2],[2,3],[2,4]],
      ],
      // 青ブロックの配置情報
      blueBlock: [
        [[2,1],[1,2],[2,2],[2,3]],
        [[2,1],[1,2],[2,2],[3,2]],
        [[2,1],[2,2],[3,2],[2,3]],
        [[1,2],[2,2],[3,2],[2,3]],
      ],
      // ゲーム上で使用するブロックの配置情報
      usableBlocks: [],
      // 位置が確定したブロックの位置情報格納テーブル
      // -1 ブロック非存在, 0 緑ブロック, 1 赤ブロック, 3 青ブロック
      cellsTable: [],
      // 描画用のブロック情報格納テーブル
      displayTable: [],
    },
    methods: {
      // ブロックの種類に応じた色を返す
      getColor(cell) {
        if(cell === -1)  return
        if(cell === 0)   return 'green'
        if(cell === 1)   return 'red'
        if(cell === 2)   return 'blue'
      },
      // 引数の情報からブロックの存在している座標を返す
      getBlock(y, x, color, angle) {
        return this.usableBlocks[color][angle].map(function(cell){ return [y + cell[0], x + cell[1]] })
      },
      // 位置が画面内であればtrueを返す
      isInside(y, x) {
        if ( y < 0 || y >= this.displaySizeY || x < 0 || x >= this.displaySizeX ) return false
        else return true
      },
      // ブロックが画面内にあればtrueを返す
      isBlockInside(block) {
        for(var i = 0; i < block.length; i++ ) {
          if ( !this.isInside(block[i][0], block[i][1]) ) return false
        }
        return true
      },
      // 操作対象のブロックの位置を変更する
      moveBlock(moveY, moveX, moveAngle) {
        // 操作後の座標位置
        var nextYX = [this.currentYX[0] + moveY, this.currentYX[1] + moveX]
        // 操作後の傾き
        var nextAngle = (this.currentAngle + 4 + moveAngle) % 4
        // 操作後のブロック情報
        var nextBlock = this.getBlock(nextYX[0], nextYX[1], this.currentColor, nextAngle)
        // 操作後のブロックの位置が正常であるかのフラグ
        var result = true
        // 操作後のブロックが画面外にあればフラグを折る
        if (!this.isBlockInside(nextBlock)) result = false
        // フラグがtrueの場合のみ操作を確定させる
        if (result) {
          this.currentYX = nextYX
          this.currentAngle = nextAngle
        }
        // 描画用テーブルを更新
        this.updateDisplay()
      },
      // 描画用テーブルの情報を更新する
      updateDisplay() {
        // 位置が確定したブロック情報を転写
        this.displayTable = JSON.parse(JSON.stringify(this.cellsTable))
        // 操作中のブロック情報を転写
        var block = this.getBlock(this.currentYX[0], this.currentYX[1], this.currentColor, this.currentAngle)
        block.forEach(cell => { this.displayTable[cell[0]][cell[1]] = this.currentColor })
      },
      // ゲーム画面を初期化する
      initTable() {
        // 操作中のブロック位置を初期化
        this.currentYX = [0, 3]
        // cellsTableのブロック情報を初期化
        this.cellsTable = [] 
        for(var i = 0; i < this.displaySizeY; i++) { this.cellsTable.push( Array(this.displaySizeX).fill(-1) ) }
        // 描画用テーブルを更新
        this.updateDisplay()
      },
      // ゲームの開始状態を切り替える
      changeGameMode() {
        // フラグを反転させる
        this.isStarted ^= true

        // ゲーム画面を初期化する
        this.initTable()
      }
    },
    mounted() {
      // usableBocks配列に使用するブロックの種類を羅列する
      this.usableBlocks = [this.greenBlock, this.redBlock, this.blueBlock]
      // ゲーム画面の初期化
      this.initTable()
      // 指定したキーにイベントを割り当て
      document.onkeydown = function (e) {
        if      (e.keyCode === 37)  this.moveBlock(0, -1, 0) // 矢印キー上
        else if (e.keyCode === 38)  this.moveBlock(-1, 0, 0) // 矢印キー左
        else if (e.keyCode === 39)  this.moveBlock(0, 1, 0)  // 矢印キー右
        else if (e.keyCode === 40)  this.moveBlock(1, 0, 0)  // 矢印キー下
        else if (e.keycode === 32)  this.changeGameMode()    // spaceキー
      }.bind(this)
    },
  });