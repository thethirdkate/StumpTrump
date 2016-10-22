#pragma strict

public var poweredUp : boolean = false;

//swipe detection vars
var player : Transform;  // Drag your player here
private var fp : Vector2;  // first finger position
private var lp : Vector2;  // last finger position


var brickKillSound : AudioClip;

public var scoreScriptObject : GameObject;

//shake detection vars

var accelerometerUpdateInterval : float = 1.0 / 60.0;
// The greater the value of LowPassKernelWidthInSeconds, the slower the filtered value will converge towards current input sample (and vice versa).
var lowPassKernelWidthInSeconds : float = 1.0;
// This next parameter is initialized to 2.0 per Apple's recommendation, or at least according to Brady! ;)
var shakeDetectionThreshold : float = 2.0;

private var lowPassFilterFactor : float = accelerometerUpdateInterval / lowPassKernelWidthInSeconds;
private var lowPassValue : Vector3 = Vector3.zero;
private var acceleration : Vector3;
private var deltaAcceleration : Vector3;


public var powerUpSound : AudioClip;
public var cheering : AudioClip;

function Start() {

    shakeDetectionThreshold *= shakeDetectionThreshold;
    lowPassValue = Input.acceleration;

}

function Update()
{


//TOUCH CONTROLS
/* swipe detection */
    for (var touch : Touch in Input.touches)
    {
          if (touch.phase == TouchPhase.Began)
          {
                fp = touch.position;
                lp = touch.position;
          }
          if (touch.phase == TouchPhase.Moved )
          {
                lp = touch.position;
          }
          if(touch.phase == TouchPhase.Ended)
          { 
      
                if((fp.x - lp.x) > 80) // left swipe
          {
       			//Debug.Log("left swipe");
       			killBricks("lswipe");
       
          }
          else if((fp.x - lp.x) < -80) // right swipe
          {
       			Debug.Log("right swipe");
       			killBricks("rswipe");
          }
          else if((fp.y - lp.y) < -80 ) // up swipe
          {
                 // add your jumping code here
       			Debug.Log("up swipe");
       			killBricks("uswipe");
          }
          else if((fp.y - lp.y) > 80 ) // up swipe
          {
                 // add your jumping code here
       			Debug.Log("down swipe");
       			killBricks("dswipe");
          }
     }
 	}
 	
 	//shake detect
 	
    acceleration = Input.acceleration;
    lowPassValue = Vector3.Lerp(lowPassValue, acceleration, lowPassFilterFactor);
    deltaAcceleration = acceleration - lowPassValue;
    if (deltaAcceleration.sqrMagnitude >= shakeDetectionThreshold)
    {
        // Perform your "shaking actions" here, with suitable guards in the if check above, if necessary to not, to not fire again if they're already being performed.
        //Debug.Log("Shake event detected at time "+Time.time);
       			killBricks("shake");
    }
    
    //KEYBOARD CONTROLS
    if (Input.GetKeyDown("left")) { killBricks("lswipe"); }
    if (Input.GetKeyDown("right")) { killBricks("rswipe"); }
    if (Input.GetKeyDown("down")) { killBricks("dswipe"); }
    if (Input.GetKeyDown("up")) { killBricks("uswipe"); }
    if (Input.GetKeyDown("space")) { killBricks("shake"); }
    
   // if (Input.GetKeyDown("z")) { 
    //	powerUp();
	//}
  
}


function killBricks(action : String ) { //for killing single brick - bad naming I know
	Debug.Log("kill bricks" + action);



	//in theory, this should be looping through in the same order things were created? 
	//so in theory if we limit this to one block, it should always kill the first born block

	var killedBlock : boolean = false;

	for (var child : Transform in transform) {
		//Debug.Log(action);
		
		
		var script = child.gameObject.GetComponent.<BrickScript>();
		Debug.Log(script.falling);

		if (script.brickType == action && script.falling && !killedBlock) {
		
			var spawnPoint = child.GetComponent.<BrickScript>().mySpawn;
			spawnPoint.GetComponent.<SpawnCounter>().brickCount--;

			Destroy(child.gameObject);
			GetComponent.<AudioSource>().PlayOneShot(brickKillSound);



			scoreScriptObject.GetComponent.<GameTimer>().addToScore(1);

			if (script.brickIsSpecial) {
				powerUp();
			}

			killedBlock = true;

		}
	}
	
}

function powerUp() {
	//turn all the bricks yellow
	//also, enable power up
	poweredUp = true;
	//set all bricks to yellow
	for (var child : Transform in transform) {
		child.GetComponent.<BrickScript>().powerMeUp();
	}

		GetComponent.<AudioSource>().PlayOneShot(powerUpSound);
}

function destroyBricks(spawnPoint : GameObject) { //for multiple bricks ie when power up is used
	for (var child : Transform in transform) {
		if (child.GetComponent.<BrickScript>().mySpawn==spawnPoint) { 
			Destroy(child.gameObject);
		
		}
		else { 
			child.GetComponent.<BrickScript>().powerMeDown();
		}
	}
	spawnPoint.gameObject.GetComponent.<SpawnCounter>().brickCount=0;


	GetComponent.<AudioSource>().PlayOneShot(brickKillSound);

	if (spawnPoint.gameObject.GetComponent.<IndicatorScript>().indicatorActive) {
		//did this column have an indicator?
		//if so, hide it, add score and play cheering
		GetComponent.<AudioSource>().PlayOneShot(cheering);

		// remove indicator
		spawnPoint.gameObject.GetComponent.<IndicatorScript>().hideIndicator();
		//show the family
		spawnPoint.transform.Find("family").GetComponent.<FamilyScript>().showFamily();

		//decrease indicator count
		gameObject.GetComponent.<BrickSpawner>().activeIndicators--;


		scoreScriptObject.GetComponent.<GameTimer>().addToScore(10);
	}

	poweredUp=false;
}
