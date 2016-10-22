#pragma strict

function Start () {

}

function Update () {

}

 function BackToMain(){
 	Destroy(GameObject.Find("GameMusic"));
	 Application.LoadLevel("Intro");
 }
