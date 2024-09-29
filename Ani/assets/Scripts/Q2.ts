const { ccclass, property } = cc._decorator;

@ccclass
export default class Q2 extends cc.Component {

    @property([cc.EditBox])
    editBoxs: cc.EditBox[] = [];

    @property(cc.Label)
    text: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    extractNumbers(str: string): number[] {
        return str.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
    }

    btnJudgeClick() {
        let a = this.editBoxs[0].string;
        let b = this.editBoxs[1].string;
        let v = Number(this.editBoxs[2].string);
        if (!a.includes(',') || !b.includes(',')) {
            this.updateText("分隔符请用“,”", cc.Color.WHITE);
            return;
        }

        if (Number.isNaN(v)) {
            this.updateText("请输入数字", cc.Color.WHITE);
            return;
        }
        let numbersA = this.extractNumbers(a);
        let numbersB = this.extractNumbers(b);
        if (this.judgeSame(numbersA, numbersB, v)) {
            this.updateText("true", cc.Color.GREEN);
        } else {
            this.updateText("false", cc.Color.RED);
        }
    }

    updateText(message: string, color: cc.Color) {
        this.text.string = message;
        this.text.node.color = color;
    }

    /**
     * 判断是否相同
     * @param a 
     * @param b 
     * @param v 
     * 
     * 
     * 时间复杂度为：
     * 构建 bSet: O(m)，其中 m 是数组 b 的长度。
     * 遍历 a 并在 bSet 中查找: O(n)，其中 n 是数组 a 的长度。
     * 最终的时间复杂度为 O(n + m)，其中 n 是数组 a 的长度，m 是数组 b 的长度。
     */
    judgeSame(a: number[], b: number[], v: number): boolean {
        let bSet = new Set(b);
        for (let index = 0; index < a.length; index++) {
            let value = v - a[index];
            if (bSet.has(value)) {
                return true;
            }
        }
        return false;
    }

    // update (dt) {}
}
