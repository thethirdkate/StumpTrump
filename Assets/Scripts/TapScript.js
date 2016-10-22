// Allows "OnMouse()" events to work on the mobile devices.
// Attach this to the main camera.
 
#pragma strict
#pragma implicit
#pragma downcast
 
private var lastHitObject : GameObject;
 
function Update ()
{
  var hit : RaycastHit;
  for (var i = 0; i < Input.touchCount; ++i)
  {
    // Construct a ray from the current touch coordinates
    var ray = GetComponent.<Camera>().ScreenPointToRay(Input.GetTouch(i).position);
    if ( Physics.Raycast(ray, hit) )
    {
      var hitObject = hit.transform.gameObject;
      if (Input.GetTouch(i).phase == TouchPhase.Began)
      {
        lastHitObject = hitObject;
        hitObject.SendMessage("OnPointerDown");
      }
      if (Input.GetTouch(i).phase == TouchPhase.Ended)
      {
        if (lastHitObject == hitObject)
        {
          hitObject.SendMessage("OnPointerUpAsButton");
        }
        hitObject.SendMessage("OnPointerUp");
        lastHitObject = null;
      }
    }
  }
}