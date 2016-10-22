#pragma strict


private var familyTimer : float = 0;
private var familyShown = true;

function Start () {
	GetComponent.<SpriteRenderer>().enabled=false;
}

function Update () {
	if (familyShown) {
		familyTimer += Time.deltaTime;
		if (familyTimer>=2) {
			GetComponent.<SpriteRenderer>().enabled=false;
		}
	}
}

function showFamily() {
	familyTimer=0;
	familyShown=true;
	GetComponent.<SpriteRenderer>().enabled=true;
}