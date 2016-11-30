$(function(){
	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext("2d");
	var $audio=$("#audio");
	var sep=40;
	var sr=4;
	var br=18;
	var AI=true;
	var gameState="pause";
	kongbai={};
	var qizi=[];
	var qizia={};
	var kaiguan=true;
	var blackT=$("#blackT").get(0);
    var ctx1=blackT.getContext('2d');
    var whiteT=$("#whiteT").get(0);
    var ctx2=whiteT.getContext('2d');
     var de=0;//黑棋时间小点
    var deg=0;//白棋时间小点
	function l(x){
		return (x+0.5)*sep+0.5;
	}
	function m(x,y){
		return x+'_'+y;
	}
	function qipan(x){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(l(0),l(0));
		for(var i=0;i<15;i++){
			ctx.moveTo(l(0),l(i));
			ctx.lineTo(l(14),l(i));
			ctx.moveTo(l(i),l(0));
			ctx.lineTo(l(i),l(14))
			
		}
		ctx.stroke()
		ctx.closePath();
		ctx.restore();
		for(var i=0;i<15;i++){
	      for(var j=0;j<15;j++){
	        kongbai[m(i,j)]=true;
	      }
	    }
	}
	function luozi(x,y,r,color){
		ctx.save();
		ctx.translate(l(x),l(y))
		ctx.beginPath();
		ctx.arc(0,0,r,0,Math.PI*2);
		var g=ctx.createRadialGradient(-4,-9,0,0,0,18)
		if(color==="black"){
			g.addColorStop(0.1,"#999");
			g.addColorStop(0.2,"#888");
			g.addColorStop(1,"black");
		}else{
			g.addColorStop(0.1,"#fff");
			g.addColorStop(0.3,"#fff");
			g.addColorStop(1,"#ccc");
		}
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		ctx.fillStyle=g;
		qizia[x+"_"+y]=color;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
		audio.play();
		gameState="play";
		delete kongbai[m(x,y)];
	}
	function xiao(){
		function scil(x,y){
			ctx.save();
	        ctx.beginPath();
	        ctx.arc(l(x),l(y),sr,0,Math.PI*2);
	        ctx.fill();
	        ctx.closePath();
			ctx.restore();
		}
		scil(7,7);
		scil(3,3);
		scil(3,11);
		scil(11,3);
		scil(11,11);
	}
	xiao();
	
	//黑白落子的时间
    
    function pan(ctx1,qiming){
    	ctx1.clearRect(0,0,200,200);    	
	    ctx1.save();
		ctx1.beginPath();
		ctx1.fill();
		ctx1.closePath();
		ctx1.font = "20px serif";
		ctx1.fillStyle="#000";
		ctx1.textAlign="center";
		ctx1.textBaseline = "bottom";
		ctx1.fillText(""+qiming+"倒计时", 100, 20);
		ctx1.restore();

		ctx1.save();
        ctx1.beginPath();
        ctx1.translate(100,100);
        ctx1.arc(0,0,80,0,Math.PI*2);
	    ctx1.closePath();
	    ctx1.restore();
    }
   
    //黑棋时间
    function render(cp,ming,t){
    	cp.clearRect(0,0,200,200);
	    pan(cp,ming);

	    cp.save();
        cp.beginPath();
        cp.translate(100,100);
        cp.rotate(Math.PI/180*de);
        cp.arc(0,-80,10,0,Math.PI*2);
        cp.fillStyle="rgba(0,0,0,0.8)";
        cp.fill();
        cp.closePath();
	    
	    cp.restore();

	    
	    de+=3;
	     if(de>360){
	     	$("#ying").css("transform","translateX(0)");
	     	$("#ying .sheng").html("时间到，白棋胜，结束游戏");
	     	clearInterval(t);
	     }
    }

    //白棋时间
    function render1(cp,ming,t){
    	cp.clearRect(0,0,200,200);
	    pan(cp,ming);

	    cp.save();
        cp.beginPath();
        cp.translate(100,100);
        cp.rotate(Math.PI/180*deg);
        cp.arc(0,-80,10,0,Math.PI*2);
        cp.fillStyle="rgba(0,0,0,0.8)";
        cp.fill();
        cp.closePath();
	    
	    cp.restore();

	    
	    deg+=3;
	     if(deg>360){
	     	$("#ying").css("transform","translateX(0)");
	     	$("#ying .sheng").html("时间到，黑棋胜，结束游戏");
	     	clearInterval(t);
	     }
    }
    var bt=setInterval(function(){
    	render(ctx1,"黑棋",bt);
    },100);
    var wt=setInterval(function(){
    	render1(ctx2,"白棋",wt);
    },100);


    clearInterval(bt);
    clearInterval(wt);

	qipan();
	//关于人机的函数，截堵和进攻。
	
	var intel=function(){
			var mx=-Infinity;
			var pos={};
			for(var k in kongbai){
				var x=parseInt(k.split("_")[0]);
				var y=parseInt(k.split("_")[1]);
				var m=panduan(x,y,"black")
				if(m>mx){
					mx=m;
					pos={x:x,y:y};
				}
			}
			var mx2=-Infinity;
			var pos2={};

			for(var k in kongbai){
				var x=parseInt(k.split("_")[0]);
				var y=parseInt(k.split("_")[1]);
				var m=panduan(x,y,"white")
				if(m>mx2){
					mx2=m;
					pos2={x:x,y:y};
				}
			}
			if(mx>mx2){
				return pos;
			}else{
				return pos2;
			}
		}
	intel()
	function dian(e){
		var x=Math.floor(e.offsetX/sep);
		var y=Math.floor(e.offsetY/sep);
		
		if(qizia[x+"_"+y]){
     		return;
     	}
		//人机对战
		if(AI){
			luozi(x,y,br,"black");
			clearInterval(bt);
	          de=0;
	          wt=setInterval(function(){
	            render1(ctx2,"白棋",wt);
	          },100);
			if(panduan(x,y,"black")>=5){
				$(canvas).off("click");
    			clearInterval(wt);
    			$("#ying").css("transform","translateX(0)");
		    	$("#ying .sheng").html("黑棋胜，结束游戏");
		    	
			}	
			var p=intel();
			console.log(p)
			 luozi(p.x,p.y,br,'white');
	          clearInterval(wt);
	          deg=0;
	          bt=setInterval(function(){
	            render(ctx1,"黑棋",bt);
	          },100);
			if(panduan(p.x,p.y,"white")>=5){
		    	clearInterval(bt);
		    	$(canvas).off("click");
		    	$("#ying").css("transform","translateX(0)");
		    	$("#ying .sheng").html("白棋胜，结束游戏");
		    }
			return false;
	}
		//人人对战
		if(kaiguan){
			luozi(x,y,br,"black");
			clearInterval(bt);
            de=0;
        	wt=setInterval(function(){
		    	render1(ctx2,"白棋",wt);
		    },100);
		    if(panduan(x,y,"black")>=5){
		    	$(canvas).off("click");
    			clearInterval(bt);
    			clearInterval(wt);
    			$("#ying").css("transform","translateX(0)");
		    	$("#ying .sheng").html("黑棋胜，结束游戏");	
		    }
		}else{
			luozi(x,y,br,"white")
			clearInterval(wt);
        	deg=0;
        	bt=setInterval(function(){
		    	render(ctx1,"黑棋",bt);
		    },100);
		    if(panduan(x,y,"white")>=5){
		    	clearInterval(bt);
    			clearInterval(wt);
		    	$(canvas).off("click");
		    	$("#ying").css("transform","translateX(0)");
		    	$("#ying .sheng").html("白棋胜，结束游戏");
		    }
		}
		kaiguan=!kaiguan;
	}
	//点击落子
    $(canvas).on("click",dian)
	
	//判断输赢函数
	function panduan(x,y,color){
		var r=1;
		var i;
		i=1;while(qizia[m(x+i,y)]===color){r++;i++;}
		i=1;while(qizia[m(x-i,y)]===color){r++;i++;}
		var l=1;
		i=1;while(qizia[m(x,y+i)]===color){l++,i++};
		i=1;while(qizia[m(x,y-i)]===color){l++,i++};
		var zx=1;
		i=1;while(qizia[m(x+i,y+i)]===color){zx++,i++};
		i=1;while(qizia[m(x-i,y-i)]===color){zx++,i++};
		var yx=1;
		i=1;while(qizia[m(x+i,y-i)]===color){yx++,i++};
		i=1;while(qizia[m(x-i,y+i)]===color){yx++,i++};
		return Math.max(r,l,zx,yx);
	}
	//生成棋谱以及下载棋谱函数
	function qipu(){
		ctx.save();
		ctx.font="20px/1 微软雅黑";
		ctx.textBaseline="middle";
		ctx.textAlign="center";
		var i=1;
		for(var k in qizia){
			var arr=k.split("_");
			if(qizia[k]==="white"){
				ctx.fillStyle="black";
			}else{
				ctx.fillStyle="white";
			}
			ctx.fillText(i++,l(parseInt(arr[0])),l(parseInt(arr[1])));
		}
		ctx.restore();
		if($("#imgb").find("img").length){
			$("#imgb").find("img").attr("src",canvas.toDataURL());
		}else{
			$("<img>").attr("src",canvas.toDataURL()).appendTo("#imgb");
		}
		if($("#imgb").find("a").length){
			$("#imgb").find("a").attr("href",canvas.toDataURL());
		}else{
			$("<a>").attr("href",canvas.toDataURL()).attr("download","piqu.png").appendTo("#imgb");
		}
	}
	
	//再来一局或者重新开始函数
	function again(){
		
		clearInterval(bt);
    	clearInterval(wt);
		ctx.clearRect(0,0,600,600)
		xiao();
		qipan()
		$(canvas).on("click",dian);
		kaiguan=true;
		qizi=[];
		qizia={};
		AI=false;
	}
	//点击离开事件
	$(".likai").on("click",function(){
		again()
		$("#ying").css("transform","translateX(3000px)");
	})
	//游戏规则
	$(".guize").on("click",function(){
		$(".role").css("transform","scale(1) rotate(0)")
	})
	//关闭游戏规则
	$(".role .guan").on("click",function(){
		$(".role").css("transform","scale(0) rotate(360deg)")
	})
	//棋谱出现
	$(".qipu").on("click",function(){
		qipu()
		$("#imgb").css("transform","scale(1)");
	})
	//查看完棋谱后要做的事情。保证原来的棋子不变。下次查看还能继续
	$("#close").on("click",function(){
		clearInterval(bt);
    	clearInterval(wt);
		$("#imgb").css("transform","scale(0)");
		qipan();
		for(var k in qizia){
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			luozi(x,y,br,qizia[k]);
		}
	})
	//关闭棋谱
	$(".guans").on("click",function(){
		$("#imgb").css("transform","scale(0)");
	})
	$(".again").on("click",function(){
		again();
	})
	$(".zai").on("click",function(){
		again();
		$("#ying").css("transform","translateX(3000px)");
		
	})
	$(".shengcheng").on("click",function(){
		qipu()
		$("#imgb").css("transform","scale(1)");
	})
	
//	$(".renji").on("click",function(){
//		
//	})
//	$(".renren").on("click",function(){
//		
//	})
	$("#max div").on("click",function(){
		$("#max div").removeClass("active")
		$(this).addClass("active");
		var index=$(this).index();
		if(index===0){
			if(gameState==="play"){
				return;
			}
	      	 AI=false;
		}if(index===1){
			if(gameState==="play"){
				return;
			}
			AI=true;
		}
	})
	
	
	
	
})











































