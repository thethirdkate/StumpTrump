#pragma strict

public var falling : boolean = true;
public var brickType : String = "lswipe";

public var brickSpeed : int = 5;

public var mySpawn : GameObject; 

public var brickParent : GameObject;
//public var powerUpMaterial : Material;
//public var deadMaterial : Material;

public var deadSprite : Sprite;
public var powerUpSprite : Sprite;

public var yDeath : float;
public var gameOverObject : GameObject;

//private var defaultMaterial : Material;

var brickLandSound : AudioClip;


public var brickIsSpecial : boolean = false;


function Start () {
	brickParent = GameObject.Find("BrickParent");
	gameOverObject = GameObject.Find("Canvas");

}

function Update () {

	if (falling) {
		transform.position.y -= 5 * Time.deltaTime;
	}


}

function OnCollisionEnter2D() {
	Debug.Log("collide");
	falling=false; 


	//gameObject.GetComponent.<SpriteRenderer>().material = deadMaterial;
	gameObject.GetComponent.<SpriteRenderer>().sprite = deadSprite;
	GetComponent.<AudioSource>().PlayOneShot(brickLandSound);

	mySpawn.GetComponent.<SpawnCounter>().brickIsFalling=false;

	//if it's landed and it's y 
/*	if (transform.position.y > yDeath) {
		gameOverObject.GetComponent.<GameTimer>().gameOver();
	}
*/
}

function OnMouseDown() {

	if (falling && brickIsSpecial) {

		//activate power up
		 brickParent.GetComponent.<InputDetector>().powerUp();
		 Destroy(this.gameObject);

	}
	else { 
		killColumn();
	}
}

function onPointerDown() {

	if (falling && brickIsSpecial) {
		//activate power up
		 brickParent.GetComponent.<InputDetector>().powerUp();
		 Destroy(this.gameObject);

	}
	else {
		killColumn();
	}
}

function killColumn() {
	var inputScript = brickParent.GetComponent.<InputDetector>();
	if (inputScript.poweredUp && !falling) { //if power up is activated, and if this isn't a falling brick
		//destroy all bricks in this column
		inputScript.destroyBricks(mySpawn);
	}
}

function powerMeUp () { //swap out plain material for fancy power up material 
	if (!falling) {
		gameObject.GetComponent.<SpriteRenderer>().sprite = powerUpSprite;
	}
}
function powerMeDown () { //swap out plain material for fancy power up material 
	if (!falling) {
		gameObject.GetComponent.<SpriteRenderer>().sprite = deadSprite;
	}
}