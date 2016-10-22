#pragma strict

public var animFrames : Sprite[];
private var animTimer : float = 0;

private var frameNumber : int = 1;
private var animating : boolean = false;

public var loadThisLevel : String;

function Start () {

}

function Update () {

	animTimer+=Time.deltaTime;
	if (animTimer>=0.2 && animating) {
		animTimer=0;
		frameNumber++;
		if (frameNumber==animFrames.length) { 
			Application.LoadLevel (loadThisLevel);
		}
		else {
			GetComponent.<SpriteRenderer>().sprite = animFrames[frameNumber];
		}
	}

}

function startAnim(levelToLoad : String) {
	loadThisLevel = levelToLoad;
	Destroy (GameObject.Find ("Canvas"));
	animating=true;
}


 function loadMyScene(whichScene : String) {
	 Application.LoadLevel(whichScene);
 }