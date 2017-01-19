//管子

var Tube=function(){
	this.name="tube";
	
	this.mesh=new THREE.Object3D();
	var StandTop=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,0.2),new THREE.MeshBasicMaterial({color:0x9acd32}));
	StandTop.position.set(0,1.9,0);
	StandTop.name="StandTop"
	this.mesh.add(StandTop);
	var BrockTop=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,0.8),new THREE.MeshBasicMaterial({color:0x9acd32}));
	BrockTop.position.set(0,1.4,0);
	BrockTop.name="BrockTop";
	this.mesh.add(BrockTop);
	var FillingButtom=new THREE.Mesh(new THREE.CylinderGeometry(1,1,3),new THREE.MeshBasicMaterial({color:0x9acd32}));
	FillingButtom.position.set(0,-0.5,0);
	FillingButtom.name="LeftOrRight";
	this.mesh.add(FillingButtom);
}


//砖块

var Breakable_Brick=function(){
	this.name="brick";
	
	this.mesh=new THREE.Object3D();
	var standable=new THREE.Mesh(new THREE.CubeGeometry(1,0.2,1),new THREE.MeshBasicMaterial({color:0xb8860b}));
	standable.position.set(0,0.4,0);
	standable.name="StandTop";
	this.mesh.add(standable);
	var filling=new THREE.Mesh(new THREE.CubeGeometry(1,0.6,1),new THREE.MeshBasicMaterial({color:0xb8860b}));
	filling.name="LeftOrRight";
	this.mesh.add(filling);
	var breakable=new THREE.Mesh(new THREE.CubeGeometry(1,0.2,1),new THREE.MeshBasicMaterial({color:0xb8860b}));
	breakable.position.set(0,-0.4,0);
	breakable.name="Breakable";
	this.mesh.add(breakable);
}

//坦克

var Robot=function(){
	this.name="tank";
	
	this.mesh=new THREE.Object3D();
	var TopSphere=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:0xff0000}));
	TopSphere.name="TopSphere";
	TopSphere.position.set(0,0.6,0);
	this.mesh.add(TopSphere);
	var RobotBody=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.6),new THREE.MeshBasicMaterial({color:0x00ff00}));
	RobotBody.position.set(0,0.3,0);
	RobotBody.name="RobotBody";
	this.mesh.add(RobotBody);
	
	var RobotWheelBody1=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.8),new THREE.MeshBasicMaterial({color:0x0000ff}));
	RobotWheelBody1.rotation.z=Math.PI/2;
	RobotWheelBody1.name="RobotWheelBody1";
	RobotWheelBody1.position.set(0,-0.1,0.3);
	this.mesh.add(RobotWheelBody1);
	var RobotWheelLeft1=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6,0,Math.PI),new THREE.MeshBasicMaterial({color:0xff0000}));
	RobotWheelLeft1.name="RobotWheelLeft1";
	RobotWheelLeft1.rotation.y=Math.PI/2;
	RobotWheelLeft1.position.set(0.4,-0.1,0.3);
	this.mesh.add(RobotWheelLeft1);
	var RobotWheelRight1=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6,0,Math.PI),new THREE.MeshBasicMaterial({color:0xff0000}));
	RobotWheelRight1.name="RobotWheelRight1";
	RobotWheelRight1.rotation.y=-Math.PI/2;
	RobotWheelRight1.position.set(-0.4,-0.1,0.3);
	this.mesh.add(RobotWheelRight1);
	
	var RobotWheelBody2=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.8),new THREE.MeshBasicMaterial({color:0x0000ff}));
	RobotWheelBody2.rotation.z=Math.PI/2;
	RobotWheelBody2.name="RobotWheelBody2";
	RobotWheelBody2.position.set(0,-0.1,-0.3);
	this.mesh.add(RobotWheelBody2);
	var RobotWheelLeft2=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6,0,Math.PI),new THREE.MeshBasicMaterial({color:0xff0000}));
	RobotWheelLeft2.name="RobotWheelLeft2";
	RobotWheelLeft2.rotation.y=Math.PI/2;
	RobotWheelLeft2.position.set(0.4,-0.1,-0.3);
	this.mesh.add(RobotWheelLeft2);
	var RobotWheelRight2=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6,0,Math.PI),new THREE.MeshBasicMaterial({color:0xff0000}));
	RobotWheelRight2.name="RobotWheelRight2";
	RobotWheelRight2.rotation.y=-Math.PI/2;
	RobotWheelRight2.position.set(-0.4,-0.1,-0.3);
	this.mesh.add(RobotWheelRight2);
	
	var Gun=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.2),new THREE.MeshBasicMaterial({color:0x0000ff}));
	Gun.name="Gun";
	Gun.rotation.z=Math.PI/2;
	Gun.position.set(0.4,0.3,0);
	this.mesh.add(Gun);
	//robot.mesh.children[8].position.x=-robot.mesh.children[8].position.x; 炮的方向用来转向标识
}

//子弹
var Bullet=function(){
	this.mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshBasicMaterial({color:0xff0000}));
	this.name="bullet";
	this.direction=0;
}


//云
var Cloud=function(){
	this.name="Cloud";
	this.mesh=new THREE.Object3D();
	var n=5;
	for(var i=0;i<n;i++){
		var h=Math.random();
		var CubeMesh=new THREE.Mesh(new THREE.CubeGeometry(h,h,h),new THREE.MeshBasicMaterial({color:0xffffff}));
		CubeMesh.position.set(-1+Math.random()*2,0,0);
		CubeMesh.rotation.set(Math.random()*0.5,Math.random()*0.5,Math.random()*0.5);
		CubeMesh.name="Cloud"+i;
		this.mesh.add(CubeMesh);
	}
}
