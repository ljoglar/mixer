 float q = random(-.1, 0);		// Q
 float g = random(-50, 50);		// Gain
 float f = random(-200, 200);	//Freq

void setup()
{
  size(400,400);
  background(255);
  stroke(0);
 // noLoop();
}

void draw()
{
	background(255);

	// set up the coordinate axes:
	translate(width/2,height/2);
	scale(1, -1);
	line(0, 200, 0, -200);
	line(-200, 0, 200, 0);

	//draw parabola
	for(float x = -200; x < 200; x = x + 0.1){
		float y = q*pow((x+f),2) + g;
		point(x,y);
    }

}

void changeGain(value){
// console.log(value)
	g = value/40 * 200;
// console.log(g)
}

void changeFrequency(value){
	f = - ((value/20000*400)-200);
}

void changeQ(value){
// console.log(value);
	q = -(value/10000 * 20);
// console.log(q);
}