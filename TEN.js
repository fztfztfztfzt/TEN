padding_large = 10;
padding_small = 4;
width = 500;
height = 500;
var bg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);
row = [1,0,0,1,0,0,1,0,0,1];
gap = (height-2*padding_large)/9;
bg.selectAll(".row1")
	.data(row)
	.enter()
	.append("line")
	.attr("x1",padding_large)
	.attr("y1",function(d,i){
		return padding_large+i*gap;
	})
	.attr("x2",width-padding_large)
	.attr("y2",function(d,i){
		return padding_large+i*gap;
	})
	.attr("stroke","black")
	.attr("stroke-width",function(d,i){
		if(i%3==0) return 4;
		else return 1;
	})
bg.selectAll(".row2")
	.data(row)
	.enter()
	.append("line")
	.attr("y1",padding_large)
	.attr("x1",function(d,i){
		return padding_large+i*gap;
	})
	.attr("y2",width-padding_large)
	.attr("x2",function(d,i){
		return padding_large+i*gap;
	})
	.attr("stroke","black")
	.attr("stroke-width",function(d,i){
		if(i%3==0) return 4;
		else return 1;
	})
var can_area = bg.append("rect")
				.attr("fill","RGBA(0,0,0,0)")
				.attr("x",padding_large-2)
				.attr("y",padding_large-2)
				.attr("height",9*gap+4)
				.attr("width",9*gap+4)
				.attr("stroke","red")
				.attr("stroke-width",5)
				
var bg2 = d3.select("body")
	.append("svg")
	.attr("width",width/2)
	.attr("height",height/2);
bg2.append("rect")
	.attr("class","turn1")
	.attr("x",width/4-gap/2+padding_small)
	.attr("y",height/4-gap/2+padding_small)
	.attr("height",gap-2*padding_small)
	.attr("width",gap-2*padding_small)
	.attr("fill","blue")
	.attr("display","block");
bg2.append("circle")
	.attr("fill","pink")
	.attr("class","turn2")
	.attr("cx",width/4)
	.attr("cy",height/4)
	.attr("r",gap/2-padding_small)
	.attr("display","none");
	
var big_x,big_y,small_x,small_y,now=9,turn=1;
var ToString = d3.format();
var map = new Array(81);
var map2 = new Array(9);
for(j=0;j<81;j++){map[j]=0;}
for(j=0;j<9;j++){map2[j]=0;}
bg.on("click",function(){
	x = d3.mouse(this)[0];
	y = d3.mouse(this)[1];
	big_x = Math.floor((x-padding_large)/(3*gap));
	big_y = Math.floor((y-padding_large)/(3*gap));
	small_x = (Math.floor((x-padding_large)/gap))%3;
	small_y = (Math.floor((y-padding_large)/gap))%3;
	if(legal(big_x,big_y,small_x,small_y)){
		map[3*big_x+small_x+9*(3*big_y+small_y)]=turn;
		if(turn==1){
			bg.append("rect")
				.attr("x",x)
				.attr("y",y)
				.attr("height",0)
				.attr("width",0)
				.attr("fill","blue")
				.attr("class",ToString(big_x)+ToString(big_y)+ToString(small_x)+ToString(small_y))
				.transition()
				.duration(1000)
				.ease("bounce")
				.attr("x",(3*big_x+small_x)*gap+padding_small+padding_large)
				.attr("y",(3*big_y+small_y)*gap+padding_small+padding_large)
				.attr("height",gap-2*padding_small)
				.attr("width",gap-2*padding_small);
		}else if(turn==2){
			bg.append("circle")
				.attr("cx",x)
				.attr("cy",y)
				.attr("r",0)
				.attr("fill","pink")
				.attr("class",ToString(big_x)+ToString(big_y)+ToString(small_x)+ToString(small_y))
				.transition()
				.duration(1000)
				.ease("bounce")
				.attr("cx",(3*big_x+small_x)*gap+gap/2+padding_large)
				.attr("cy",(3*big_y+small_y)*gap+gap/2+padding_large)
				.attr("r",gap/2-padding_small);
		}
		if(IsLine(big_x,big_y,small_x,small_y,turn)){
			bg.append("rect")
				.attr("x",padding_large+2+3*gap*big_x)
				.attr("y",padding_large+2+3*gap*big_y)
				.attr("width",3*gap-4)
				.attr("height",3*gap-4)
				.attr("fill","white");
			if(turn==1){
				bg.append("rect")
					.attr("x",padding_large+3*gap*big_x+padding_small)
					.attr("y",padding_large+3*gap*big_y+padding_small)
					.attr("width",3*gap-2*padding_small)
					.attr("height",3*gap-2*padding_small)
					.attr("fill","blue");
			}else if(turn==2){
				bg.append("circle")
					.attr("cx",padding_large+3*gap*big_x+3*gap/2)
					.attr("cy",padding_large+3*gap*big_y+3*gap/2)
					.attr("r",(3*gap-2*padding_small)/2)
					.attr("fill","pink");
			}
			if(win(turn)){
				bg.append("rect")
					.attr("x",padding_large-2)
					.attr("y",padding_large-2)
					.attr("width",9*gap+6)
					.attr("height",9*gap+6)
					.attr("fill","white");
				if(turn==1){
					bg.append("rect")
						.attr("x",padding_large-2)
						.attr("y",padding_large-2)
						.attr("width",9*gap+4)
						.attr("height",9*gap+4)
						.attr("fill","blue");
				}else if(turn==2){
					bg.append("circle")
						.attr("cx",padding_large+9*gap/2)
						.attr("cy",padding_large+9*gap/2)
						.attr("r",(9*gap-2*padding_small)/2)
						.attr("fill","pink");
				}
				d3.select(this).on("click",null);
			}
		}
		now = 3*small_y+small_x;
		if(canset(now)){
			can_area.transition()
				.delay(500)
				.attr("width",3*gap+4)
				.attr("height",3*gap+4)
				.attr("x",padding_large-2+3*gap*small_x)
				.attr("y",padding_large-2+3*gap*small_y)
		}else{
			now = 9;
			can_area.transition()
				.delay(500)
				.attr("width",9*gap+4)
				.attr("height",9*gap+4)
				.attr("x",padding_large-2)
				.attr("y",padding_large-2)
		}
		if(turn==1){
			d3.select(".turn1").attr("display","none");
			d3.select(".turn2").attr("display","block");
		}else{
			d3.select(".turn1").attr("display","block");
			d3.select(".turn2").attr("display","none");
		}
		turn = 3-turn;
		
	}
})

function legal(bx,by,sx,sy){
	if((now==9)||(bx+3*by==now)){
		if(map[3*bx+sx+9*(3*by+sy)]==0){
			return true;
		}
	}
	return false;
}

function IsLine(bx,by,sx,sy,turn){
	n = 3*bx+sx+9*(3*by+sy);
	bn = bx+3*by;
	if(sx==0&&sy==0){
		if(map[n+1]==turn&&map[n+2]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n+9]==turn&&map[n+18]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n+10]==turn&&map[n+20]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==0&&sy==1){
		if(map[n-9]==turn&&map[n+9]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n+1]==turn&&map[n+2]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==0&&sy==2){
		if(map[n+1]==turn&&map[n+2]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-9]==turn&&map[n-18]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-8]==turn&&map[n-16]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==1&&sy==0){
		if(map[n+9]==turn&&map[n+18]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n+1]==turn&&map[n-1]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==1&&sy==1){
		if(map[n+9]==turn&&map[n-9]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n+1]==turn&&map[n-1]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-10]==turn&&map[n+10]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-8]==turn&&map[n+8]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==1&&sy==2){
		if(map[n-1]==turn&&map[n+1]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-9]==turn&&map[n-18]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==2&&sy==0){
		if(map[n-2]==turn&&map[n-1]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n+9]==turn&&map[n+18]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n+8]==turn&&map[n+16]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==2&&sy==1){
		if(map[n-1]==turn&&map[n-2]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-9]==turn&&map[n+9]==turn){
			map2[bn] = turn;
			return true;
		}
	}else if(sx==2&&sy==2){
		if(map[n-1]==turn&&map[n-2]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-9]==turn&&map[n-18]==turn){
			map2[bn] = turn;
			return true;
		}
		if(map[n-10]==turn&&map[n-20]==turn){
			map2[bn] = turn;
			return true;
		}
	}
	n = 3*bx+27*by;
	if(map[n]!=0&&map[n+1]!=0&&map[n+2]!=0&&map[n+9]!=0&&map[n+10]!=0&&map[n+11]!=0&&map[n+18]!=0&&map[n+19]!=0&&map[n+20]!=0){
		map2[bn] = 3;
	}
	return false;
}

function canset(n){
	if(map2[n]==0) return true;
	else return false;
}

function win(turn){
	if(map2[0]==turn&&map2[1]==turn&&map2[2]==turn){
		return true;
	}
	if(map2[3]==turn&&map2[4]==turn&&map2[5]==turn){
		return true;
	}
	if(map2[6]==turn&&map2[7]==turn&&map2[8]==turn){
		return true;
	}
	if(map2[0]==turn&&map2[3]==turn&&map2[6]==turn){
		return true;
	}
	if(map2[1]==turn&&map2[4]==turn&&map2[7]==turn){
		return true;
	}
	if(map2[2]==turn&&map2[5]==turn&&map2[8]==turn){
		return true;
	}
	if(map2[0]==turn&&map2[4]==turn&&map2[8]==turn){
		return true;
	}
	if(map2[2]==turn&&map2[4]==turn&&map2[6]==turn){
		return true;
	}
	return false;
}
