#pragma strict
import System.Collections.Generic;

public var brickStartSpeed : float = 5;
//public var brick

public var spawnDelay : float = 5;

public var spawnPoints : GameObject[];

public var brickPrefabs : GameObject[];

public var specialBrickPrefab : GameObject;

private var brickTimeCount : int = 0;

//for increasing brick speed
public var brickSpeedIncrease : float = 0.01;
public var brickSpeedMax : float = 8;


//for reducing brick spawn delay
public var brickSpawnDelayDecrease : float = 0.01;
public var brickSpawnDelayMin : float = 2.5;


//controls for the indicator
public var indicatorInterval : float = 8;
private var indicatorTimer : float = 0;

public var activeIndicators : int = 0;


function Start () {

	//go through children
	//count them
	//make sure they know they belong to this spawn point
	/*for (var child : Transform in transform) {

	  //child is your child transform
	  if (child.gameObject.name == "starterBrick") {
	  	//child.GetComponent.<BrickScript>().mySpawn = gameObject;
	  	gameObject.GetComponent.<SpawnCounter>().brickCount++;
	  }
	}*/


}

function Update () {

	brickTimeCount++;
	
	if (brickTimeCount >= spawnDelay) {
		spawnBrick();
		brickTimeCount=0;
	}

	//indicator appears at intervals
	indicatorTimer+=Time.deltaTime;
	if (indicatorTimer>=indicatorInterval) {
		indicatorTimer=0;
		startIndicator();
	}


}


function spawnBrick() {

	//pick a random spawn point
		//pick a spawn point that has a low count of bricks already?

	//slowly increment the speed of each spawned brick / decrease the time between brick spawns
	spawnDelay-=brickSpawnDelayDecrease;
	if (spawnDelay<brickSpawnDelayMin) { spawnDelay = brickSpawnDelayMin; }

	brickStartSpeed+=brickSpeedIncrease;
	if (brickStartSpeed>brickSpeedMax) { brickStartSpeed = brickSpeedMax; }


	var lowestBrickNumber = 99;
	var possibleSpawns = new List.<GameObject>();

	//for each spawn point..
		
	for (spawnPoint in spawnPoints) {
	//reset the array
		var numberOfBricks = spawnPoint.GetComponent.<SpawnCounter>().brickCount;
		Debug.Log(spawnPoint + " has " + numberOfBricks + " vs " + lowestBrickNumber);
		
		
		//if it's got fewer bricks than the current lowest
		//reset the array
		if (numberOfBricks < lowestBrickNumber) {
			possibleSpawns.Clear();
			possibleSpawns.Add(spawnPoint); 
			lowestBrickNumber = numberOfBricks;
		}
		//if it's got the same, add it to the array
		else if (numberOfBricks == lowestBrickNumber) {
			possibleSpawns.Add(spawnPoint);
		}
		
	}
	Debug.Log(possibleSpawns.Count + " possible spawns.");
	//and now pick a random..
	var mySpawn = possibleSpawns[Random.Range(0, possibleSpawns.Count-1)];
	
	//pick a random prefab

	var myPrefab = brickPrefabs[Random.Range(0, brickPrefabs.length)];

	var brickSpecial : boolean = false;
	//if indicator is active, 25% chance of special brick:

	if (activeIndicators>0) {
		Debug.Log("indicators are active");
		var rand = Random.Range(0,5);
		Debug.Log(rand);
		if (rand>=3) {
			brickSpecial=true;
			myPrefab = specialBrickPrefab;
			Debug.Log("special brick spawning");

		}
	}

	Debug.Log(myPrefab);
	
	//instantiate
	var newBrick = Instantiate(myPrefab, mySpawn.transform.position, Quaternion.identity);
	
	//set speed
	newBrick.GetComponent.<BrickScript>().brickSpeed = brickStartSpeed;
	
	//set brick to know which spawn point it was part of
	newBrick.GetComponent.<BrickScript>().mySpawn = mySpawn;
	
	//start it falling
	newBrick.GetComponent.<BrickScript>().falling = true;
	
	//parent it so it will get looped through when touch inputs happen
	newBrick.transform.SetParent(this.transform);
	
	//update the counter of the spawn point
	mySpawn.GetComponent.<SpawnCounter>().brickCount++;
	mySpawn.GetComponent.<SpawnCounter>().brickIsFalling = true;

	if (brickSpecial) {
		newBrick.GetComponent.<BrickScript>().brickIsSpecial = brickSpecial;
	}


}


function destroySpawners() {

	for (spawnPoint in spawnPoints) {
		Destroy(spawnPoint);
	}
}


function startIndicator() {

	if (activeIndicators<spawnPoints.length) {
		//pick a random column from one that has a highest number of bricks on it

		var lowestBrickNumber = 0;
		var possibleSpawns = new List.<GameObject>();

		for (spawnPoint in spawnPoints) {
		//reset the array
			var numberOfBricks = spawnPoint.GetComponent.<SpawnCounter>().brickCount;
			//Debug.Log(spawnPoint + " has " + numberOfBricks + " vs " + lowestBrickNumber);
			
			//IF THERE IS ONLY 1 BRICK, AND THAT BRICK IS FALLING, IT DOESNT COUNT!
			if (numberOfBricks == 1 && spawnPoint.GetComponent.<SpawnCounter>().brickIsFalling) {
				numberOfBricks = 0;
			}


			//if it's got fewer bricks than the current lowest
			//reset the array
			if (numberOfBricks > lowestBrickNumber && !spawnPoint.GetComponent.<IndicatorScript>().indicatorActive) {
				possibleSpawns.Clear();
				possibleSpawns.Add(spawnPoint); 
				lowestBrickNumber = numberOfBricks;
			}
			//if it's got the same, add it to the array


			else if (numberOfBricks == lowestBrickNumber && !spawnPoint.GetComponent.<IndicatorScript>().indicatorActive) {
				possibleSpawns.Add(spawnPoint);
			}
			
		}

		if (lowestBrickNumber>0 ) { //only spawn if there is at least 1 brick!)
			var mySpawn = possibleSpawns[Random.Range(0, possibleSpawns.Count-1)];

			//then go into the chosen spawn and activate the indicator
			mySpawn.GetComponent.<IndicatorScript>().activateIndicator();
			activeIndicators++;
		}
	}

}