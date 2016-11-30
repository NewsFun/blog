/**
 * Created by Administrator on 2015/5/29.
 */
(function(){
    var canvas = setCanvas();
    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'lighter';

    var W = canvas.width, H = canvas.height, txt = ['祝','大','家','节','日','快','乐'];
    var ba = [], bs = [], page = 0, tl = txt.length, gap = 16, gw = ~~(W/gap)*gap, gh = ~~(H/gap)*gap;

    /*--------------------------------------*/
    var Color = {
        randomColor:function(){
            return 'rgb('+~~(Math.random()*255)+','+~~(Math.random()*255)+','+~~(Math.random()*255)+')';
        },
        setColor:function(r, g, b, a){
            return 'rgba('+r+','+g+','+b+','+a+')';
        }
    };
    var ball = function(args){
        this.x = args.x;
        this.y = args.y;
        this.z = args.z;
        this.c = args.c;
        this.vx= args.vx;
        this.vy= args.vy;
    };
    var dot = function(b){
        this.b = new ball({
            x : b.x,
            y : b.y,
            z : b.z,
            c : b.c || Color.randomColor(),
            vx: (Math.random()-0.5)*4,
            vy: (Math.random()-0.5)*4
        });
        this.e = 0.07;
        this.s = true;
    };
    dot.prototype = {
        distance:function (n, details) {
            var dx = this.b.x - n.x,
                dy = this.b.y - n.y,
                d = Math.sqrt(dx * dx + dy * dy);

            return details ? [dx, dy, d] : d;
        },
        bounce:function (self){
            self.x += self.vx;
            self.y += self.vy;

            if(self.x - self.z <= 0){
                self.vx = -self.vx;
                self.x = self.z;
            }
            if(self.x + self.z >= W){
                self.vx = -self.vx;
                self.x = W-self.z;
            }
            if(self.y - self.z <= 0){
                self.vy = -self.vy;
                self.y = self.z;
            }
            if(self.y + self.z >= H){
                self.vy = -self.vy;
                self.y = H-self.z;
            }
        },
        update:function(goal){
            var dis = this.distance(goal, true);
            var d = dis[2], dx = dis[0], dy = dis[1];
            if(this.s){
                if(d>1){
                    this.b.x -= dx*this.e;
                    this.b.y -= dy*this.e;
                }else{
                    this.b.x -= Math.sin(Math.random() * 3.142);
                    this.b.y -= Math.sin(Math.random() * 3.142);
                }
            }else{
                this.bounce(this.b);
            }
        },
        moveTo:function(goal){
            this.update(goal);
            drawBall(this.b);
        }
    };
    function drawBall(ball){
        ctx.fillStyle = ball.c;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.z, 0, Math.PI*2, true);
        ctx.fill();
    }
    var P = {
        setFont:function(l){
            var size = 500;
            var s = Math.min(size,
                (W / ctx.measureText(l).width) * 0.8 * size,
                (H / size) * (Fun.isNumber(l) ? 1 : 0.45) * size);
            ctx.font = 'bold '+~~(s/10)*10+'px Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';
        },
        fillTxt:function(txt){
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            this.setFont(txt);
            ctx.fillText(txt, W/2, H/2);
        },
        sampling:function(){
            var dots = [],
                x = 0,
                y = 0,
                fx = gw,
                fy = gh,
                w = 0,
                h = 0,
                pixels = ctx.getImageData(0, 0, gw, gh).data;
            for (var p = 0; p < pixels.length; p += (4 * gap)) {
                if (pixels[p + 3] > 0) {
                    dots.push({
                        x: x,
                        y: y
                    });
                    w = x > w ? x : w;
                    h = y > h ? y : h;
                    fx = x < fx ? x : fx;
                    fy = y < fy ? y : fy;
                }
                x += gap;
                if (x >= gw) {
                    x = 0;
                    y += gap;
                    p += gap * 4 * gw;
                }
            }

            return dots;
        },
        getTxt:function(n){
            ctx.clearRect(0, 0, W, H);
            this.fillTxt(txt[n]);
            bs = this.sampling();
        },
        makeBalls:function(){
            var balls = [], len = bs.length>0?bs.length:200;
            for(var i = 0;i<len;i++){
                balls.push(new dot({
                    x:Math.random()*W,
                    y:Math.random()*H,
                    z:Math.random()*6+4
                }))
            }
            return balls;
        }
    };
    var Fun = {
        towards:function(){
            for(var i = 0;i<ba.length;i++){
                ba[i].moveTo(bs[i]);
            }
        },
        checkLength:function(){
            if(ba.length == bs.length) return;
            var bal = ba.length,
                bsl = bs.length,
                len = Math.abs(bal-bsl);

            if(bal>bsl){
                for(var i = 0;i<len;i++){
                    bs.push({
                        x:Math.random()*W,
                        y:Math.random()*H
                    });
                }
            }else{
                for(var j = 0;j<len;j++){
                    ba.push(new dot({
                        x:Math.random()*W,
                        y:Math.random()*H,
                        z:Math.random()*6+4
                    }))
                }
            }
        },
        setState:function(){
            var bal = ba.length,
                bsl = bs.length,
                sml = Math.min(bal, bsl);
            for(var s = 0;s<bal;s++){
                s<sml ? ba[s].s = true : ba[s].s = false;
            }
        },
        isNumber:function(n){
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    };

    P.getTxt(page);
    ba = P.makeBalls();
    var animate = function(){
        ctx.clearRect(0, 0, W, H);
        Fun.checkLength();
        Fun.towards();
        requestAnimationFrame(animate);
    };
    animate();

    canvas.onclick = function(){
        page ++;
        P.getTxt(page%tl);
        Fun.setState();
    };
})();
