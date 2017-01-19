/*
	Auth：huangweiwei
	time:2017.1.19
*/
var game,camera,scene,renderer,tank,AllSceneMesh=[],AllBulletMesh=[];
/*
	AllSceneMesh表示场景中的物体
	AllBulletMesh表示子弹
*/

/*
	控制：
	小键盘上表示跳
	小键盘左右表示左右走
	+表示发射炮弹
*/
function resetGame(){
	game={
		//运动状态
		canGoLeft:true,
		canGoRight:true,
		canGoTop:true,
		falling:false,
		//开始的x
		StartX:0,
		//运动的参数
		jumpHeight:6,
		goDistance:0.03,
		failingSpeed:0.03,
		//场景长度
		SceneLength:35,
		//子弹速度
		BulletSpeed:0.1,
		//游戏状态
		gameStatus:"playing",
	};
}

//初始化THREE.js一些插件
function init(){
	scene=new THREE.Scene();
	camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,10000);
	renderer=new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

//初始化场景
function initGeometry(){
	for(var i=-game.SceneLength;i<=-20;i++){
		var cube=new Breakable_Brick();
		cube.mesh.position.set(i,0,0);
		scene.add(cube.mesh);
		AllSceneMesh.push(cube.mesh);
	}
	for(var i=-12;i<=-1;i++){
		var cube=new Breakable_Brick();
		cube.mesh.position.set(i,0,0);
		scene.add(cube.mesh);
		AllSceneMesh.push(cube.mesh);
	}
	for(var i=-8;i<=-5;i++){
		var cube=new Breakable_Brick();
		cube.mesh.position.set(i,3,0);
		scene.add(cube.mesh);
		AllSceneMesh.push(cube.mesh);
	}
	for(var i=3;i<=6;i++){
		var cube=new Breakable_Brick();
		cube.mesh.position.set(i,3,0);
		scene.add(cube.mesh);
		AllSceneMesh.push(cube.mesh);
	}
	var tube1=new Tube();
	tube1.mesh.position.set(11.5,1.5,0);
	scene.add(tube1.mesh);
	AllSceneMesh.push(tube1.mesh);
	for(var i=13;i<=20;i++){
		var cube=new Breakable_Brick();
		cube.mesh.position.set(i,0,0);
		scene.add(cube.mesh);
		AllSceneMesh.push(cube.mesh);
	}
	var tube2=new Tube();
	tube2.mesh.position.set(21.5,1.5,0);
	scene.add(tube2.mesh);
	AllSceneMesh.push(tube2.mesh);
	for(var i=28;i<=game.SceneLength;i++){
		var cube=new Breakable_Brick();
		cube.mesh.position.set(i,0,0);
		scene.add(cube.mesh);
		AllSceneMesh.push(cube.mesh);
	}
	tank=new Robot();
	tank.mesh.position.set(-34,2,0);
	scene.add(tank.mesh);
}

function initCamera(){
	camera.position.set(0,0,30);
	camera.lookAt(new THREE.Vector3(0,0,0));
}

//运动控制
function moving(et){
	switch(et.keyCode){
		case 39:
			if(game.canGoRight){
				tank.mesh.position.x+=game.goDistance;
				tank.mesh.children[8].position.x=0.4;
			}
			break;
		case 38:
			if(game.canGoTop){
				tank.mesh.position.y+=1;
				game.falling=true;
				game.canGoTop=false;
			}
			break;
		case 37:
			if(game.canGoLeft){
				tank.mesh.position.x-=game.goDistance;
				tank.mesh.children[8].position.x=-0.4;
			}
				
			break;
		case 107:
			addBullet()
		default:
			if(game.gameStatus=="win"){
				alert("win.")
			}
			break;
	}
}
/*
	状态码：
	0表示
	1表示在左边
	2表示在右边
	3表示上阻挡
	-1表示在空中
*/

//坦克碰撞检测及状态转移
function crashWithTank(){
	var origin=tank.mesh.position.clone();
	var collisionResults;
	var ans=[];
	var deleteObj,deleteNum;
	for(var i=0;i<tank.mesh.children.length;i++){
		var movingCube=tank.mesh.children[i];
		var checkPoint=new THREE.Vector3(origin.x+movingCube.position.x,origin.y+movingCube.position.y,movingCube.position.z);
		for(var j=0;j<movingCube.geometry.vertices.length;j++){
			var vertices=movingCube.geometry.vertices[j].clone();
			var ray=new THREE.Raycaster(checkPoint, vertices.clone().normalize());
			collisionResults=ray.intersectObjects(AllSceneMesh,true);
			for(var k=0;k<collisionResults.length;k++){
				var obj=collisionResults[k].object;
				var objPosition=new THREE.Vector3(origin.x+obj.position.x,origin.y+obj.position.y,obj.position.z)
				var dis=collisionResults[k].distance;
				var moveCubePosition=checkPoint.clone();
				if(obj.name=="StandTop"&&dis<vertices.length()){
					ans.push(-1);
				}
				
				else if(obj.name=="LeftOrRight"&&dis<vertices.length()){
					if(objPosition.x>moveCubePosition.x){
						ans.push(1);
					}
					else if(objPosition.x<moveCubePosition.x){
						ans.push(2);
					}
				}
				
				else if(obj.name=="BrockTop"&&dis<vertices.length()){
					ans.push(3);
				}
				
				else if(obj.name=="Breakable"&&dis<vertices.length()){
					for(var it=0;it<AllSceneMesh.length;it++){
						if(AllSceneMesh[it].children[2].uuid==obj.uuid){
							deleteNum=it;
							deleteObj=AllSceneMesh[it];
							break;
						}
					}
				}
			}
		}
	}
	if(deleteNum!=undefined&&deleteObj!=undefined){
		AllSceneMesh.splice(deleteNum,1);
		scene.remove(deleteObj);
	}
	if(ans.indexOf(-1)==-1){
		ans.push(0);
	}
	return ans;
}


//子弹碰撞检测
function crashWithBullet(bullet){
	var origin=bullet.position.clone();
	var collisionResults=[];
	var ans=[];
	var checkPoint=bullet.position.clone();
	for(var i=0;i<bullet.geometry.vertices.length;i++){
		var vertices=bullet.geometry.vertices[i].clone();
		var ray=new THREE.Raycaster(checkPoint, vertices.clone().normalize());
		collisionResults=ray.intersectObjects(AllSceneMesh,true);
		for(var j=0;j<collisionResults.length;j++){
			var obj=collisionResults[j].object;
			var dis=collisionResults[j].distance;
			if(dis<vertices.length()&&obj.parent.children[2].name=="Breakable"){
				return obj.parent;
			}
			if(dis<vertices.length()&&obj.parent.children[2].name=="LeftOrRight"){
				return obj.parent;
			}
		}
	}
	return null;
}

//创建子弹
function addBullet(){
	var bullet=new Bullet();
	bullet.mesh.position.set(tank.mesh.position.x+tank.mesh.children[8].position.x*1.1,tank.mesh.position.y+tank.mesh.children[8].position.y,tank.mesh.position.z);
	bullet.direction=tank.mesh.children[8].position.x;
	scene.add(bullet.mesh);
	AllBulletMesh.push(bullet);
}


//动画
function loop(){
	var status=crashWithTank();
	resetGame();
	var bulletDeleteNum=[];
	var bulletDeleteObj=[];
	var deleteJudge,deleteSceneNum;
	if(tank.mesh.position.x<-game.SceneLength){
		game.canGoLeft=false;
	}
	if(tank.mesh.position.x>game.SceneLength){
		game.canGoRight=false;
		game.gameStatus="win";
	}
	if(Math.abs(tank.mesh.position.x)<game.SceneLength){
		game.gameStatus="playing";
	}
	//运动状态转换
	for(var i=0;i<status.length;i++){
		if(status[i]==0){
			game.falling=true;
		}
		if(status[i]==1){
			game.canGoLeft=false;
		}
		if(status[i]==2){
			game.canGoRight=false;
		}
		if(status[i]==3){
			game.canGoTop=false;
		}
	}
	if(game.falling){
		tank.mesh.position.y-=game.failingSpeed;
	}
	
	//子弹碰撞检测
	for(var i=0;i<AllBulletMesh.length;i++){
		if(Math.abs(AllBulletMesh[i].mesh.position.x)>game.SceneLength){
			bulletDeleteNum.push(i);
			bulletDeleteObj.push(AllBulletMesh[i].mesh);
		}
		//crash
		deleteJudge=crashWithBullet(AllBulletMesh[i].mesh);
		if(deleteJudge!=null){
			bulletDeleteNum.push(i);
			bulletDeleteObj.push(AllBulletMesh[i].mesh);
			if(deleteJudge.children[2].name=="Breakable"){
				for(var j=0;j<AllSceneMesh.length;j++){
					if(deleteJudge.children[2].uuid==AllSceneMesh[j].children[2].uuid){
						deleteSceneNum=j;
						break;
					}
				}
				if(deleteSceneNum!=undefined){
					AllSceneMesh.splice(deleteSceneNum,1);
					scene.remove(deleteJudge);
				}
			}
		}
		//move
		if(AllBulletMesh[i].direction<0){
			AllBulletMesh[i].mesh.position.x-=game.BulletSpeed;
		}
		else{
			AllBulletMesh[i].mesh.position.x+=game.BulletSpeed;
		}
	}
	for(var i=0;i<bulletDeleteNum.length;i++){
		AllBulletMesh.splice(bulletDeleteNum[i],1);
		scene.remove(bulletDeleteObj[i]);
	}
	
	//创建云
	if(Math.random()<0.01){
		var cloud=new Cloud();
		cloud.mesh.position.set(game.SceneLength,10+Math.random()*3,Math.random()*5);
		scene.add(cloud.mesh);
	}
	//除去云
	for(var i=0;i<scene.children.length;i++){
		var mesh=scene.children[i];
		if(mesh.type=="Object3D"&&mesh.children[0].name=="Cloud0"){
			if(mesh.position.x<-game.SceneLength){
				scene.remove(mesh);
				continue;
			}
			mesh.position.x-=0.1;
		}
	}
	renderer.render(scene,camera);
	requestAnimationFrame(loop);
}

//函数入口
function main(){
	resetGame();
	init();
	initGeometry();
	initCamera();
	document.addEventListener('keydown',moving,false);
	loop();
	alert("到达地图最右边按6胜利。")
}
main();//调用函数

