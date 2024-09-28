const { ccclass, property } = cc._decorator;

@ccclass
export default class Scene extends cc.Component {

    @property(cc.Node)
    uiNode: cc.Node = null;

    @property(cc.Node)
    uiBg: cc.Node = null;

    @property(cc.Node)
    button: cc.Node = null;

    buttonAnimation: cc.Animation = null;

    buttonOriginalScale: number = 1;
    buttonOriginalColor: cc.Color = null;

    touchStartTime: number = 0.1;
    touchEndTime: number = 0.1;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.buttonAnimation = this.button.getComponent(cc.Animation);
        this.buttonOriginalColor = this.button.color;
        this.button.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.button.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.button.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.button.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    
    protected onDestroy(): void {
        this.button.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.button.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.button.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.button.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
        this.startGame();
    }

    startGame() {
        this.button.scale = 0;
        this.uiNode.active = true;
        this.uiNode.getComponent(cc.Animation).play();
        this.uiNode.getComponent(cc.Animation).on('finished', () => {
            this.uiNode.getComponent(cc.Animation).off('finished');
            this.buttonAnimation.play("btnShowAni");
            this.buttonAnimation.on('finished', () => {
                this.buttonAnimation.play("btnIdleAni");
                this.buttonAnimation.off('finished');
            });
        })
    }

    btnSelectClick(event, customEventData) {
        this.startGame();
    }

    /**
     * 触摸开始事件
     * @param event 
     */
    onTouchStart(event: cc.Event.EventTouch) {
        this.buttonAnimation.stop();
        this.button.angle = 0;
        this.button.scale = this.buttonOriginalScale;
        event.target.color = cc.Color.GRAY;
        cc.Tween.stopAllByTarget(event.target);
        cc.tween(event.target)
            .to(this.touchStartTime, { scale: 0.8 * this.buttonOriginalScale })
            .to(this.touchStartTime, { scale: 0.9 * this.buttonOriginalScale })
            .to(this.touchStartTime, { scale: 0.8 * this.buttonOriginalScale })
            .to(this.touchStartTime, { scale: 0.85 * this.buttonOriginalScale })
            .to(this.touchStartTime, { scale: 0.8 * this.buttonOriginalScale })
            .start();
    }

    /**
     * 触摸移动事件
     * @param event 
     */
    onTouchMove(event: cc.Event.EventTouch) {

    }

    /**
     * 触摸结束事件
     * @param event 
     */
    onTouchEnd(event: cc.Event.EventTouch) {
        this.aniRestore(event.target);
        cc.tween(this.uiBg)
            .to(0.5, { position: cc.v3(0, 2000) })
            .call(() => {
                this.uiNode.active = false;
                this.buttonAnimation.stop();
                this.button.scale = 0;
            })
            .start();
    }

    /**
     * 触摸取消事件
     * @param event 
     */
    onTouchCancel(event: cc.Event.EventTouch) {
        this.aniRestore(event.target,()=>{
            this.buttonAnimation.play("btnIdleAni");
        })
    }

    aniRestore(node: cc.Node,call?:Function) {
        node.color = this.buttonOriginalColor;
        cc.Tween.stopAllByTarget(node);
        cc.tween(node)
            .to(this.touchEndTime, { scale: 1.2 * this.buttonOriginalScale })
            .to(this.touchEndTime, { scale: this.buttonOriginalScale })
            .to(this.touchEndTime, { scale: 1.1 * this.buttonOriginalScale })
            .to(this.touchEndTime, { scale: this.buttonOriginalScale })
            .call(()=>{
                call&&call();
            })
            .start();
    }

    // update (dt) {}
}
