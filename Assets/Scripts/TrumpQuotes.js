#pragma strict

private var trumpTimer : float = 0;
public var trumpQuotes : AudioClip[];

function Start () {

}

function Update () {

	trumpTimer += Time.deltaTime;
	if (trumpTimer>=10) {
		var playMe = trumpQuotes[Random.Range(0, trumpQuotes.Length)];
		trumpTimer=0;
		GetComponent.<AudioSource>().PlayOneShot(playMe);
	}

}