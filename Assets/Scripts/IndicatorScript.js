#pragma strict

private var indicator : Transform;

public var indicatorActive : boolean = false;

private var brickSpawnerObject : GameObject;

private var timeToGet : float = 8;
private var timer : float = 0;

function Start () {

	//spawnBrick();
	indicator = transform.Find("indicator");
	hideIndicator();

	brickSpawnerObject = GameObject.Find("BrickParent");
}

function Update () {

	if (indicatorActive) {
		timer+=Time.deltaTime;
		if (timer>=timeToGet) {
			hideIndicator();
			brickSpawnerObject.GetComponent.<BrickSpawner>().activeIndicators--;
		}
	}

}

function activateIndicator() {
	indicator.GetComponent.<SpriteRenderer>().enabled= true;
	indicatorActive = true;
	timeToGet = Random.Range(9, 13);
}

function hideIndicator() {
	indicator.GetComponent.<SpriteRenderer>().enabled= false;
	indicatorActive = false;
	timer=0;
}