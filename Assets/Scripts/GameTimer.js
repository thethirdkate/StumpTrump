#pragma strict

public var gameTimeLimit : float = 60;
public var gameCount : float = 60;

public var score : float = 0;

public var scoreText : UI.Text;
public var timeText : UI.Text;

public var gameState : String = "playing";

private var brickParent : GameObject;

public var gameEndSound : AudioClip;

public var trumpEndSprite : Sprite;
public var trumpObject : GameObject;

private var endTimer : float;


function Start () {
//	DontDestroyOnLoad(this);
	brickParent = GameObject.Find("BrickParent");
}

function Update () {
	if (gameState == "playing") {
		gameCount-=Time.deltaTime;
		timeText.text = Mathf.Round(gameCount) + "";
		scoreText.text = Mathf.Round(score) + "";
		if (gameCount<=0) {
			gameOver();
		}
	}

	if (gameState == "end") {
		endTimer+=Time.deltaTime;
	    for (var touch : Touch in Input.touches)
	    {
	          if (touch.phase == TouchPhase.Began && endTimer>2) {
	          	replay();
	          }
          }
      }
    if (Input.GetKeyDown("space") && gameState=="end") { replay(); }
}

function addToScore(amount:int) {
	score+=amount;
}

function gameOver() {
	GetComponent.<AudioSource>().PlayOneShot(gameEndSound);
	gameState = "end";
	timeText.text = "Tap/space to replay";
	scoreText.text = "Final score: " + score;
	//destroy all bricks
	brickParent.GetComponent.<BrickSpawner>().destroySpawners();
	Destroy(brickParent);
	trumpObject.GetComponent.<SpriteRenderer>().sprite = trumpEndSprite;
	endTimer=0;
}

function replay() {
		Application.LoadLevel(Application.loadedLevel);
}