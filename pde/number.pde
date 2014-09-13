int number = 0.75;

void setup()
{
  size(70,40);
  background(125);
  fill(255);
  // noLoop();
  PFont fontA = loadFont("courier");
  textFont(fontA, 14);  
}

void draw(){
  background(number*100);
  text(str(number),20,20);
  // println("Hello ErrorLog! " + str(number));
}

void changeNumber(value){
    number = value;
}


