const { ccclass, property } = cc._decorator;

@ccclass
export default class Q1 extends cc.Component {

    @property(cc.Node)
    colorNode: cc.Node = null;

    @property(cc.EditBox)
    editBoxX: cc.EditBox = null;

    @property(cc.EditBox)
    editBoxY: cc.EditBox = null;

    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.Node)
    cellItem: cc.Node = null;

    @property(cc.Node)
    cellParentNode: cc.Node = null;

    colors: cc.Color[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        for (let index = 0; index < this.colorNode.childrenCount; index++) {
            this.colors[index] = this.colorNode.children[index].color;
        }
    }

    /**
     * 点击按钮生成矩阵
     */
    btnGenerateClick() {
        let X = Number(this.editBoxX.string);
        let Y = Number(this.editBoxY.string);
        if (Number.isNaN(X) || Number.isNaN(Y)) {
            this.text.string = "请输入正确的数字";
            return;
        }
        this.text.string = "";
        this.cellParentNode.removeAllChildren();
        let matrix = this.generateMatrix(X, Y);
        this.displayMatrix(matrix);
    }

    /**
     * 生成 10×10 的随机矩阵
     * @param X 
     * @param Y 
     * @returns 
     */
    generateMatrix(X: number, Y: number): cc.Color[][] {
        let matrix: cc.Color[][] = [];
        for (let i = 0; i < 10; i++) {
            matrix[i] = [];
            for (let j = 0; j < 10; j++) {
                let color = this.getColorForPosition(matrix, i, j, X, Y);
                matrix[i][j] = color;
            }
        }
        return matrix;
    }

    /**
     * 根据规则获取点 (m, n) 的颜色
     * @param matrix 
     * @param m 
     * @param n 
     * @param X 
     * @param Y 
     * @returns 
     */
    getColorForPosition(matrix: cc.Color[][], m: number, n: number, X: number, Y: number): cc.Color {
        let baseProbabilities = [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5];
        let colorProbabilities = [...baseProbabilities];
        if (m === 0 && n === 0) {
            return this.colors[Math.floor(Math.random() * 5)];
        }

        if (n > 0) {
            let leftColor = matrix[m][n - 1];
            let leftColorIndex = this.colors.indexOf(leftColor);
            colorProbabilities[leftColorIndex] += X / 100;
        }

        if (m > 0) {
            let topColor = matrix[m - 1][n];
            let topColorIndex = this.colors.indexOf(topColor);
            colorProbabilities[topColorIndex] += X / 100;

            // 如果左边和上面的颜色相同，则只增加 Y%
            if (n > 0 && topColor === matrix[m][n - 1]) {
                colorProbabilities[this.colors.indexOf(topColor)] += Y / 100;
            }
        }
        let sum = colorProbabilities.reduce((a, b) => a + b, 0);
        colorProbabilities = colorProbabilities.map(p => p / sum);
        let rand = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < this.colors.length; i++) {
            cumulativeProbability += colorProbabilities[i];
            if (rand < cumulativeProbability) {
                return this.colors[i];
            }
        }
        return this.colors[0];
    }

    /**
     * 显示矩阵
     * @param matrix 
     */
    displayMatrix(matrix: cc.Color[][]) {
        let cellSize = this.cellItem.width;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                let cell = cc.instantiate(this.cellItem);
                cell.active = true;
                cell.color = matrix[i][j];
                cell.width = cellSize;
                cell.height = cellSize;
                cell.setPosition(j * cellSize, -i * cellSize);
                this.cellParentNode.addChild(cell);
            }
        }
    }

    // update (dt) {}
}
